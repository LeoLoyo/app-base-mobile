import React from 'react'
import PropTypes from 'prop-types'
import { GoogleSignin } from 'react-native-google-signin'
import { withApollo } from 'react-apollo'
import firebase from 'react-native-firebase'
import _get from 'lodash/get'
import _has from 'lodash/has'
import axios from 'axios'
import { CheckSessionContext, subcribeSession } from '../../core/CheckSession'
import { setAccessToken, setProfileId } from '../../core/Auth'
import { CustomComponentProvider } from '../../core/withCustomComponent'
import withConfig from '../../core/withConfig'
import withToast from '../../core/withToast'
import withNavigation from '../../core/withNavigation'

class GoogleLoginButton extends React.Component {
  static contextType = CheckSessionContext

  state = {
    isSigninInProgress: false,
    loginData: null
  };

  _signIn = async () => {
    try {
      this.setState({ loading: true })
      await GoogleSignin.configure({
        forceConsentPrompt: true
      })
      await GoogleSignin.hasPlayServices()
      const { accessToken, ...userInfo } = await GoogleSignin.signIn()

      return accessToken && this._authenticationAttempt(userInfo)
    } catch (error) {
      return this._onAuthError(error)
    }
  };

  isSigninInProgress = () => {
    return false
  };
  // Authentication Attempt
  _authenticationAttempt = async ({ user: params }) => {
    const token = await firebase.messaging().getToken()
    const payload = {
      id: _get(params, 'id', null),
      first_name: _get(params, 'giveName', _get(params, 'name')),
      last_name: _get(params, 'familyName', null),
      email: _get(params, 'email', null)
    }

    if (token) {
      payload.token = token
    }

    this.setState({loginData: payload})
    return axios.post(`${this.props.config.auth.baseUrl}/oauth/google/login`,
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
    return axios.post(`${this.props.config.auth.baseUrl}/oauth/google/login`,
      params, {
        headers: {
          'x-client-id': this.props.config.auth.clientID
        }
      })
      .then(({ data }) => {
        return Promise.resolve(data)
      })
      .then((this._onAuthSuccess))
      .catch(({response}) => {
        const message = _get(response, 'data.error.message', false)
        const messageAlt = _get(response, 'data.error', false)
        return this.setState({ loading: false, loginData: null },
          () => this.props.toast.error(`%${message || messageAlt || 'social_unknow'}%`))
      })
  }

  _onAuthError = ({ response, ...params }) => {
    if (_has(response, 'data.error')) {
      const message = _get(response, 'data.error.message', false)
      if (message) {
        const limitCode = _get(response, 'data.error.code', null)
        // this.setState({ loading: false }, () => this.props.toast.error(`%${message}%`))
        return this._retryLogin({limit_code: limitCode, ...this.state.loginData})
      }
      const msgError = _get(response, 'data.error', 'social_unknow')
      return this.setState({ loading: false }, () => this.props.toast.error(`%${msgError}%`))
    }
    return this.setState({ loading: false }, () => this.props.toast.error('%social_unknow%'))
  }

  // Set access token / profile info on auth success
  _onAuthSuccess = ({ data, ...more }) => {
    const { client: apollo, refecthAll } = this.props
    Promise.all([setAccessToken(_get(data, 'access_token')), setProfileId(_get(data, 'data.profileId'))])
      .then(() => {
        this.setState({ loading: false, loginData: null }, () => {
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
    return (
      <CustomComponentProvider {...this.props} components={['ItemComponent']} >
        {({ ItemComponent }) => {
          return ItemComponent ? (
            <ItemComponent
              {...this.props}
              google={{
                onPress: this._signIn,
                disabled: this.state.loading,
                loading: this.state.loading
              }}
            />)
            : null
        }
        }
      </CustomComponentProvider>
    )
  }
}

GoogleLoginButton.propTypes = {
  ItemComponent: PropTypes.string,
  config: PropTypes.object,
  navigation: PropTypes.object,
  toast: PropTypes.object,
  client: PropTypes.object,
  refecthAll: PropTypes.bool
}

GoogleLoginButton.defaultProps = {
  refecthAll: false
}

export default withConfig(withToast(withNavigation(withApollo(GoogleLoginButton))))
