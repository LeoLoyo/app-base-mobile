import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dimensions, Platform, View } from 'react-native'
import WebView from 'react-native-webview'
import { getWebPlayer } from './html'
import withTranslation from '../../../core/withTranslation'
import Loading from '../Loading'

const { width, height } = Dimensions.get('window')

class PlayerWeb extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ...this._getNewLayoutValues(),
      token: null,
      loading: true
    }

    this.handlers = []
  }

    _getNewLayoutValues = () => ({
      width: width,
      height: width * 9 / 16
    })

    // cast webview postmessage to RN handlers
    _onMessage = (e) => {
      const handlers = {
        'onPlayerReady': this.onPlayerReady,
        'onPlay': this.onPlay,
        'onVideoEnd': this.onVideoEnd,
        'onVideoStop': this.onVideoStop,
        'onVideoError': this.onVideoError,
        'onVolumeChange': this.onVolumeChange,
        'onTimeUpdate': this.onTimeUpdate,
        'onFullscreenChange': this.onFullscreenChange
      }

      const { event, data } = JSON.parse(e.nativeEvent.data)

      // todo handle the respective events
      const handler = handlers[event]

      if (handler) {
        handler(data)
      }
    }

    // handlers functions
    // callback empty
    onPlayerReady = () => {

    }

    // callback empty
    onPlay = (data) => {

    }

    // callback empty
    onVideoEnd = (data) => {

    }

    // callback empty
    onVideoStop = (data) => {

    }

    // callback empty
    onVideoError = () => {

    }

    onVolumeChange = ({value: volume}) => {

    }

    onTimeUpdate = ({value: time}) => {

    }

    onFullscreenChange = ({value: fullscreen}) => {

    }

    _patchPostMessageJsCode = `
        (function() {
          var originalPostMessage = window.postMessage;
        
          var patchedPostMessage = function(message, targetOrigin, transfer) { 
            originalPostMessage(message, targetOrigin, transfer);
          };
        
          patchedPostMessage.toString = function() { 
            return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
          };
        
          window.postMessage = patchedPostMessage;
        })();
      `

    _setNewLayoutValues = () => this.setState(this._getNewLayoutValues)

    render () {
      const { id, type, scalesPageToFit, scrollEnabled } = this.props

      const html = getWebPlayer({
        id,
        token: null,
        type,
        width: width,
        height: height * 0.30
      })
      return (
        <View style={{
          width: width,
          height: height * 0.30,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <WebView
            renderLoading={() => <Loading color={'black'}/>}
            startInLoadingState
            bounces={false}
            source={{ html }}
            javaScriptEnabled
            domStorageEnabled
            style={{
              width: width,
              height: height * 0.30,
              flex: 1
            }}
            onMessage={this._onMessage}
            injectedJavaScript={this._patchPostMessageJsCode}
            scrollEnabled={scrollEnabled}
            scalesPageToFit={scalesPageToFit || Platform.OS === 'android'}
            onError={error => error}
            onLoad={callback => callback}

          />
        </View>
      )
    }
}

PlayerWeb.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  scalesPageToFit: PropTypes.bool,
  scrollEnabled: PropTypes.bool
}

export default withTranslation(PlayerWeb)
