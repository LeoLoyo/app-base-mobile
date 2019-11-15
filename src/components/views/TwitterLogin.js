import React, { Component } from 'react'
import { NativeModules } from 'react-native'
import firebase from 'react-native-firebase'
import PropTypes from 'prop-types'
import _get from 'lodash/get'
import _has from 'lodash/has'
import axios from 'axios'
import withCustomComponent from '../../core/withCustomComponent'

import withConfig from '../../core/withConfig'
import withToast from '../../core/withToast'
import withNavigation from '../../core/withNavigation'
import { setAccessToken, setProfileId } from '../../core/Auth'
import { CheckSessionContext, subcribeSession } from '../../core/CheckSession'

const { RNTwitterSignIn } = NativeModules

class TwitterLogin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      loginData: null
    }
  }

  static contextType = CheckSessionContext

  _twitterSignIn = async () => {
    try {
      this.setState({ loading: true })
      const { auth } = this.props.config
      const twConsumerKey = _get(auth, 'twConsumerKey', false)
      const twConsumerSecret = _get(auth, 'twConsumerSecret', false)
      if (!twConsumerKey || !twConsumerSecret) {
        return console.warn('Check twitter credentials!')
      }
      RNTwitterSignIn.init(twConsumerKey, twConsumerSecret)
      RNTwitterSignIn.logIn()
        .then(loginData => {
          const { authToken, authTokenSecret } = loginData
          if (authToken && authTokenSecret) {
            return authToken && this._authenticationAttempt(loginData)
          }
        })
        .catch(error => {
          this.setState({ loading: false })
          // eslint-disable-next-line no-console
          console.log(error)
        })
    } catch (e) {
      console.error('Twitter sign in error: ', e)
      this._onAuthError()
    }
  }

  _authenticationAttempt = async (user) => {
    try {
      const token = await firebase.messaging().getToken()
      const { auth } = this.props.config
      const baseUrl = _get(auth, 'baseUrl', null)
      const clientID = _get(auth, 'clientID', null)
      if (!baseUrl || !clientID) {
        return console.warn(`No baseUrl/clientId provided, cant login`)
      }
      this.setState({ loginData: user })
      const config = {
        headers: {
          'x-client-id': clientID
        }
      }
      const payload = user
      if (token) {
        payload.token = token
      }

      return axios.post(`${baseUrl}/oauth/twitter-mobile/login`, payload, config)
        .then((this._onAuthSuccess))
        .catch(this._onAuthError)
    } catch (e) {
      this._onAuthError(e)
    }
  }

  _onAuthSuccess = async ({ data, ...more }) => {
    try {
      await setAccessToken(_get(data, 'access_token'))
      await setProfileId(_get(data, 'data.profileId'))
      this.setState({ loading: false, loginData: null },
        () => {
          subcribeSession(this.context)
          this.props.navigation.navigate(this.props.config.auth.viewOnLoginSuccess)
        }
      )
    } catch (e) {
      console.warn('auth success fn error: ', e)
      this.setState({ loading: false, loginData: null })
    }
  }

  _onAuthError = ({ response, ...params }) => {
    if (_has(response, 'data.error')) {
      const limitCode = _get(response, 'data.error.code', null)
      return this._retryLogin({ limit_code: limitCode, ...this.state.loginData })
      // msgError = _get(response, 'data.error', 'social_unknow')
      // return this.setState({ loading: false, loginData: null }, () => this.props.toast.error(`%${msgError}%`))
    }
    return this.setState({ loading: false, loginData: null }, () => this.props.toast.error('%social_unknow%'))
  }

  _retryLogin = (params) => {
    return axios.post(`${this.props.config.auth.baseUrl}/oauth/twitter-mobile/login`,
      params, {
        headers: {
          'x-client-id': this.props.config.auth.clientID
        }
      })
      .then(({ data }) => {
        return Promise.resolve(data)
      })
      .then((this._onAuthSuccess))
      .catch(({ response }) => {
        const message = _get(response, 'data.error.message', false)
        const messageAlt = _get(response, 'data.error', false)
        return this.setState({ loading: false, loginData: null },
          () => this.props.toast.error(`%${message || messageAlt || 'social_unknow'}%`))
      })
  }

  render () {
    const { loading } = this.state
    const {
      ItemComponent
    } = this.props

    return (
      ItemComponent && <ItemComponent
        {...this.props}
        twitter={{
          onPress: this._twitterSignIn,
          disabled: loading,
          loading: loading
        }}
      />
    )
  }
}

TwitterLogin.propTypes = {
  ItemComponent: PropTypes.any,
  config: PropTypes.object,
  navigation: PropTypes.object,
  toast: PropTypes.object
}

export default withCustomComponent(withConfig(withToast(withNavigation(TwitterLogin))), ['ItemComponent'])
