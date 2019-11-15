import React from 'react'
import PropTypes from 'prop-types'
import {Platform, Dimensions} from 'react-native'
import get from 'lodash/get'
import isString from 'lodash/isString'
import WebView from 'react-native-webview'
import withStyle from '../../core/withStyle'
import withNavigation from '../../core/withNavigation'
import {deepMap} from '../../core/utils/map'

const {height, width} = Dimensions.get('window')

class Component extends React.Component {
  _bridgeJs = () => {
    return (
      `
        (function ready() {
          function whenRNPostMessageReady(cb) {
            if (postMessage.length === 1) cb();
            else setTimeout(function() { whenRNPostMessageReady(cb) }, 100);
          }
          whenRNPostMessageReady(function() {
            const oldPostMessage = window.postMessage;
            window.postMessage = function (data) {
              if (typeof data !== 'string') {
                data = JSON.stringify(data);
              }
              oldPostMessage.apply(window, [data]);
            }
            window.postMessage('reactNativeBridgeReady');
            if (window.onBridgeReady) window.onBridgeReady();
          });
        })();
        window.postMessage.toString = () => (
          String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
        );
      `
    )
  }

  state = {
    bridgeReady: false,
    webViewRef: null
  }

  didBlurSubscription = null

  _buildUrl = () => {
    const {uriParams = {}, uri, isHtml} = this.props
    if (!uri) return uri
    const query = get(uriParams, 'query', {})
    const _id = get(uriParams, '_id')
    const buildQuery = (query) => Object.keys(query).map((key) => `${key}=${query[key]}`).join('&')
    return isHtml ? {html: uri} : {
      uri: (query && _id) ? `${uri}/${_id}?${buildQuery(query)}` : uri
    }
  }

  _prepareHTML = (params) => {
    return (
      ` (function ready() {
          window.RN_PARAMS = ${JSON.stringify(params)};

          if (typeof window.boostrap === 'function' ) {
            window.boostrap();
          }
        })();
      `
    )
  }

  _onLoadEnd = () => {
    const {isHtml, createBridge, uriParams} = this.props
    if (isHtml && createBridge && this.view) {
      this.view.injectJavaScript(this._prepareHTML({
        height,
        width,
        ...uriParams
      }))
    }
  }

  _onLoadError = (err) => {
    console.error('load error', err)
  }

  _onNavigationStateChange = (args) => {
    // DO Nothing
    if (this.view && this.props.onNavigationStateChange === 'function') {
      this.props.onNavigationStateChange(args, this.view)
    }
  }

  render () {
    const {createBridge = false, html, ...props} = this.props
    const url = this._buildUrl()
    const extraProps = createBridge ? {
      ref: view => { this.view = view },
      _injectedJavaScript: this._bridgeJs,
      onMessage: this.onMessage
    } : {}

    return (
      <WebView
        {...props}
        {...extraProps}
        source={url}
        scalesPageToFit={this.props.scalesPageToFit || Platform.OS === 'android'}
        // startInLoadingState={true}
        onLoadEnd={this._onLoadEnd}
        onLoadError={this._onLoadError}
        onNavigationStateChange={this._onNavigationStateChange}
      />

    )
  }

  onMessage = (event) => {
    if (event.nativeEvent.data === 'reactNativeBridgeReady') {
      this.handleMessageAction('reactNativeBridgeReady')
    } else {
      try {
        const message = JSON.parse(event.nativeEvent.data)
        const {event: eventName, ...params} = message
        if (eventName) {
          this.handleMessageAction(eventName, params)
        } else {
          console.warn('Bridge event has no `event` prop', message)
        }
      } catch (e) {
        console.warn('Bridge event could not be parsed', event.nativeEvent.data, e)
      }
    }
  }

  _replaceParams (props, params) {
    return deepMap(props, (val) => {
      if (!isString(val)) return val
      const match = val.match(/^\$\{(.*)\}$/)
      const prop = match && match.pop()
      return get(params, prop, val)
    })
  }

  handleMessageAction (event, params = {}) {
    const eventData = get(this.props, `events.${event}`, null)

    if (eventData && eventData.action) {
      const props = Object.assign({}, {event: params || {}, props: this.props, state: this.state})
      switch (eventData.action) {
        case 'navigate':
          this.props.navigation.navigate(eventData.link, this._replaceParams(eventData.params, props))
          break
        case 'setContext':
          this.props._setContext(this._replaceParams(eventData.params, props))
          break
      }
    }
  }

  postMessage = (msg) => {
    if (this.state.bridgeReady && this.view) {
      this.view.postMessage(typeof msg === 'object' ? JSON.stringify(msg) : msg)
    }
  }
}

Component.propTypes = {
  navigation: PropTypes.object,
  uriParams: PropTypes.object,
  uri: PropTypes.string,
  isHtml: PropTypes.bool,
  html: PropTypes.any,
  createBridge: PropTypes.bool,
  scalesPageToFit: PropTypes.bool,
  _setContext: PropTypes.func,
  onNavigationStateChange: PropTypes.func
}

Component.defaultProps = {
  createBridge: false,
  isHtml: false
}

export default withNavigation(withStyle(Component))
