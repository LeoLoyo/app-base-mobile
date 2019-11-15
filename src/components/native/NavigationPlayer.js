import React from 'react'
import {get} from 'lodash'
import PropTypes from 'prop-types'
import {BackHandler, Platform} from 'react-native'
import PlayerBridge from 'react-native-mediastream-player'
import withNavigation from './../../core/withNavigation'
import withToast from './../../core/withToast'
import Player from './Player'
import View from './View'
import Live from './Live'

class NavigationPlayer extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onSubmit: PropTypes.func,
    navigation: PropTypes.object,
    onError: PropTypes.func,
    loading: PropTypes.bool,
    type: PropTypes.string,
    containerClassName: PropTypes.string,
    containerStyle: PropTypes.string,
    toast: PropTypes.object,
    _setContext: PropTypes.func,
    nextMedia: PropTypes.any,
    playerStyle: PropTypes.string,
    playerClassName: PropTypes.string,
    style: PropTypes.any
  }

  static defaultProps = {
    onError: () => {}
  }

  state = {
    isFullscreen: false
  }

  componentDidMount () {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
  }

  handleBackPress = () => {
    PlayerBridge.dismissMediastreamPlayer()
    PlayerBridge.releasePlayer()
    this.goBack()
    return true
  }

  goBack = () => this.props.navigation.goBack(null)

  _onError = (e) => {
    this.props.onError(e)
    this.props.toast.error('%toast_media_error%', 2000, 'toast-bottom')
    this.goBack()
  }

  _onEnd = () => {
    if (typeof this.props._setContext === 'function' && this.props.nextMedia) {
      this.props._setContext({current: this.props.nextMedia})
    }
  }

  _onFullScreen = () => {
    this.setState({isFullscreen: !this.state.isFullscreen})
  }

  _offFullScreen = () => {
    this.setState({isFullscreen: !this.state.isFullscreen})
  }

  _renderPlayer = () => {
    const {id, type, playerStyle, playerClassName, style, ...props} = this.props
    const itemId = id || get(this.props, 'navigation.state.params.id', undefined)
    const playerType = type || get(this.props, 'navigation.state.params.type', 'vod')
    const navigationParams = get(this.props, 'navigation.state.params', {})
    return playerType === 'live'
      ? <Live
        {...this.props}
        {...navigationParams}
        id={itemId}
        type={playerType}
        onError={this._onError}
        dismissPlayer={this.goBack} /> : (
        <Player
          {...props}
          playerClassName={playerClassName}
          playerStyle={playerStyle}
          id={itemId}
          type={playerType}
          onError={this._onError}
          onEnd={this._onEnd}
          dismissPlayer={this.goBack}
          _onFullScreen={this._onFullScreen}
          _offFullScreen={this._offFullScreen}
        />
      )
  }

  render () {
    const {containerClassName, containerStyle} = this.props
    const {isFullscreen} = this.state
    const computedStyle = isFullscreen && Platform.OS === 'ios' ? {} : containerStyle
    const computedClassName = isFullscreen && Platform.OS === 'ios'
      ? 'w-viewport-100 h-viewport-100'
      : containerClassName
    return (
      <View className={computedClassName} style={computedStyle}>
        {this._renderPlayer()}
      </View>
    )
  }
}

export default withNavigation(withToast(NavigationPlayer))
