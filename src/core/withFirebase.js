import React from 'react'
import PropTypes from 'prop-types'
import firebase from 'react-native-firebase'
import { Alert as NativeAlert } from 'react-native'
import NavigatorService from './NavigatorService'
import { logout } from './utils/auth'

const withFirebase = (Component) => {
  return class WrapperComponent extends React.Component {
    static propTypes = {
      config: PropTypes.object,
      sessionNetworkTitle: PropTypes.string,
      sessionNetworkMsg: PropTypes.string,
      sessionId: PropTypes.string
    }
    invalidSession = () => {
      const { config: { auth }, sessionNetworkTitle, sessionNetworkMsg } = this.props
      if (!auth) return
      const { viewOnNetworkError, sessionAlert = false } = auth
      if (sessionAlert) {
        NavigatorService.navigate(viewOnNetworkError)
        return NativeAlert.alert(
          sessionNetworkTitle,
          sessionNetworkMsg,
          [
            {
              text: 'Aceptar',
              onPress: () => {}
            }
          ],
          { cancelable: false }
        )
      }
    }
    _observableSession = () => {
      const { sessionId } = this.props
      if (!sessionId) return null
      firebase.database().ref(`sessions/${sessionId}`)
        .on('value', async (snapshot) => {
          if (!snapshot.val()) {
            await logout()
            this.invalidSession()
          }
        })
      return true
    }
    render () {
      return <Component {...this.props} _observableSession={this._observableSession}/>
    }
  }
}

export default withFirebase
