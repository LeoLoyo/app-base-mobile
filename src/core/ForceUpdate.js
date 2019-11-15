import React from 'react'
import PropTypes from 'prop-types'
import {Alert, AppState, BackHandler, Linking, Platform} from 'react-native'
import VersionCheck from 'react-native-version-check'
import RNExitApp from 'react-native-exit-app'

class ForceUpdate extends React.Component {
  constructor (props) {
    super(props)
    this.appID = props.appID
    this.appName = props.appName

    this.state = {
      appState: AppState.currentState
    }
  }

  componentDidMount () {
    AppState.addEventListener('change', this._handleAppStateChange)
    this.checkUpdateAndForce()
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

    _handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active' && this.state.appState === 'background') {
        this.checkUpdateAndForce()
      }
      this.setState({appState: nextAppState})
    };

    checkUpdateAndForce = async () => {
      const {disableForceUpdate} = this.props
      if (disableForceUpdate === 'true') {
        return console.warn('Force update disable on dev')
      }
      try {
        const response = await VersionCheck.needUpdate({
          currentVersion: VersionCheck.getCurrentVersion(),
          forceUpdate: true
        })

        let url = await this.getStoreUrl()

        if (response && response.isNeeded) {
          Alert.alert(
            'Nueva versión disponible',
            'Deseas ir a la tienda y actualizar la app?',
            [
              {
                text: 'Cerrar',
                onPress: () => {
                  (Platform.OS === 'ios') ? RNExitApp.exitApp() : BackHandler.exitApp()
                }
              },
              {text: 'Actualizar', onPress: () => Linking.openURL(url)}
            ],
            {cancelable: false}
          )
        }
      } catch (e) {
        console.error(e)
      }
    }

    getStoreUrl = async () => {
      const config = {
        appID: this.appID,
        appName: this.appName
      }
      return (Platform.OS === 'ios') ? VersionCheck.getStoreUrl(config) : VersionCheck.getStoreUrl()
    }

    shouldComponentUpdate () {
      return false
    }

    render () {
      return null
    }
}

ForceUpdate.propTypes = {
  appID: PropTypes.string,
  appName: PropTypes.string,
  disableForceUpdate: PropTypes.any
}

export default ForceUpdate
