import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'react-native'
import firebase from 'react-native-firebase'
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'
import Icon from 'react-native-vector-icons/FontAwesome'
import { withApollo } from 'react-apollo'
import axios from 'axios'
import _get from 'lodash/get'
import { CheckSessionContext, subcribeSession } from '../../core/CheckSession'
import { Button, Text, View } from '../../components'
import withConfig from '../../core/withConfig'
import withToast from '../../core/withToast'
import withNavigation from '../../core/withNavigation'
import withStyle from '../../core/withStyle'
import withTranslation from '../../core/withTranslation'

import { setAccessToken, setProfileId } from '../../core/Auth'

const SocialIcon = withStyle(Icon)

class FBLoginButton extends React.Component {
  static contextType = CheckSessionContext

  state = {
    login: false,
    loginData: null
  }

  _loginManager = async () => {
    const {
      termsAgree,
      withTermsAndConditions,
      messageAlert: { titleAlert, subTitleAlert, textButtonAlert }
    } = this.props

    // Attempt a login using the Facebook login dialog asking for default permissions.
    try {
      if (withTermsAndConditions) {
        if (!termsAgree) return Alert.alert(titleAlert, subTitleAlert, [{ text: textButtonAlert }])
      }
      this.setState({ loading: true })
      const permissionsReq = await LoginManager
        .logInWithReadPermissions(['public_profile', 'email'])
      if (permissionsReq.isCancelled) {
        this.setState({ loading: false })
        return
      }
      await AccessToken.getCurrentAccessToken()
      this._getUserInfo()
    } catch (error) {
      this.setState({ loading: false })
      console.error(error)
    }
  }

  // Create Response Callback.
  _responseInfoCallback = (error, result) => {
    if (error) {
      console.error('Error fetching data: ' + error.toString())
      return
    }
    // from here it should authenticate against the Auth Service
    this._authenticationAttempt(result)
  }

  // Graph Request Builder
  _getUserInfo = () => {
    // Create a graph request asking for user information with a callback to handle the response.
    const infoRequest = new GraphRequest(
      '/me?fields=id,first_name,last_name,name,picture.type(large),email,gender',
      null,
      this._responseInfoCallback
    )
    // Start the graph request.
    new GraphRequestManager().addRequest(infoRequest).start()
  }

  // Authentication Attempt
  _authenticationAttempt = async (params) => {
    const token = await firebase.messaging().getToken()
    const payload = {
      id: _get(params, 'id', null),
      first_name: _get(params, 'first_name', _get(params, 'name')),
      last_name: _get(params, 'last_name', null),
      email: _get(params, 'email', null)
    }
    if (token) {
      payload.token = token
    }
    this.setState({loginData: payload})
    axios.post(`${this.props.config.auth.baseUrl}/oauth/facebook/login`,
      payload, {
        headers: {
          'x-client-id': this.props.config.auth.clientID
        }
      })
      .then(({ data }) => Promise.resolve(data))
      .then((this._onAuthSuccess))
      .catch(this._onAuthError)
  }

  _retryLogin = (params) => {
    return axios.post(`${this.props.config.auth.baseUrl}/oauth/facebook/login`,
      params, {
        headers: {
          'x-client-id': this.props.config.auth.clientID
        }
      })
      .then(({ data }) => Promise.resolve(data))
      .then((this._onAuthSuccess))
      .catch(({response}) => {
        const message = _get(response, 'data.error.message', false)
        const messageAlt = _get(response, 'data.error', false)
        return this.setState({ loading: false, loginData: null },
          () => this.props.toast.error(`%${message || messageAlt || 'social_unknow'}%`))
      })
  }

  // Show an alert
  _onAuthError = ({ response }) => {
    const message = _get(response, 'data.error.message', false)
    if (message) {
      const limitCode = _get(response, 'data.error.code', null)
      // this.setState({ loading: false }, () => this.props.toast.error(`%${message}%`))
      return this._retryLogin({limit_code: limitCode, ...this.state.loginData})
    }
    this.setState({ loading: false, loginData: null },
      () => this.props.toast.error(`%${_get(response, 'data.error', 'social_unknow')}%`))
  }

  // Set access token / profile info on auth success
  _onAuthSuccess = ({ data }) => {
    const { client: apollo, refecthAll } = this.props
    Promise.all([setAccessToken(_get(data, 'access_token')),
      setProfileId(_get(data, 'data.profileId'))])
      .then(() => {
        this.setState({ loading: false, loginData: null },
          () => {
            refecthAll && apollo.reFetchObservableQueries()
            subcribeSession(this.context)
            this.props.navigation.navigate(this.props.config.auth.viewOnLoginSuccess)
          })
      }).catch((error) => {
        console.error('error', error)
        this.setState({ loading: false, loginData: null })
      })
  }

  render () {
    const { text, buttonProps, containerProps, textProps, containerCircleProps, iconProps } = this.props
    const { loading } = this.state
    return (
      <Button style={FBLoginButton.btnStyle} {...buttonProps} loading={loading}
        onPress={this._loginManager}>
        <View style={FBLoginButtonStyles.containerStyle} {...containerProps} >
          <View style={FBLoginButtonStyles.containerCircle} {...containerCircleProps}>
            <SocialIcon name='facebook' style={FBLoginButtonStyles.iconStyle} {...iconProps} />
          </View>
          {text && <Text style={FBLoginButtonStyles.textStyle} text={text} {...textProps}></Text>}
        </View>
      </Button>
    )
  }
}

const FBLoginButtonStyles = {
  containerStyle: {
    'flexDirection': 'row',
    'justifyContent': 'center',
    'alignItems': 'center',
    'width': '100%',
    'paddingHorizontal': 20
  },
  containerCircle: {
    'height': 35,
    'width': 35,
    'backgroundColor': 'white',
    'borderRadius': 17.5,
    'alignItems': 'center'
  },
  btnStyle: {
    'marginVertical': 10,
    'backgroundColor': '#3b5998',
    'height': 60,
    'borderRadius': 4,
    'width': '100%',
    'justifyContent': 'center',
    'alignItems': 'center'
  },
  textStyle: {
    'fontSize': 18,
    'marginLeft': 10
  },
  iconStyle: {
    'fontSize': 30,
    'color': '#3b5998',
    'position': 'absolute',
    'bottom': -2.5
  }
}

FBLoginButton.propTypes = {
  text: PropTypes.string,
  textStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  iconStyle: PropTypes.object,
  navigation: PropTypes.object,
  config: PropTypes.shape({
    auth: PropTypes.shape({
      baseUrl: PropTypes.string.isRequired,
      clientID: PropTypes.string.isRequired,
      viewOnLoginSuccess: PropTypes.string.isRequired
    })
  }),
  toast: PropTypes.object,
  buttonProps: PropTypes.any,
  containerProps: PropTypes.any,
  textProps: PropTypes.any,
  termsAgree: PropTypes.bool,
  withTermsAndConditions: PropTypes.bool,
  messageAlert: PropTypes.shape({
    titleAlert: PropTypes.string,
    subTitleAlert: PropTypes.string,
    textButtonAlert: PropTypes.string
  }),
  containerCircleProps: PropTypes.object,
  iconProps: PropTypes.object,
  client: PropTypes.object,
  refecthAll: PropTypes.bool
}

FBLoginButton.defaultProps = {
  termsAgree: false,
  withTermsAndConditions: false,
  messageAlert: {
    titleAlert: 'Ups!',
    subTitleAlert: 'Acepta los Términos y Condiciones',
    textButtonAlert: 'Ok'
  },
  refecthAll: false
}

export default withConfig(withToast(withNavigation(withTranslation(withApollo(FBLoginButton, [
  'messageAlert.titleAlert',
  'messageAlert.subTitleAlert',
  'messageAlert.textButtonAlert'
])))))
