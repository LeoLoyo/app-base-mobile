import React from 'react'
import GoogleCast, { CastButton } from 'react-native-google-cast'
import moment from 'moment'
import KeepAwake from 'react-native-keep-awake'
import Orientation from 'react-native-orientation-locker'
import {
  Alert,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  StatusBar,
  Button,
  BackHandler,
  TouchableOpacity,
  Platform
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { MediastreamPlayer, MediastreamPlayerModules } from 'react-native-mediastream-player'
import _debounce from 'lodash/debounce'
import _get from 'lodash/get'
import _isFunction from 'lodash/isFunction'
import _isUndefined from 'lodash/isUndefined'
import _isEmpty from 'lodash/isEmpty'

// components
import PlayerControls from './PlayerControls'
import PlayerHeader from './PlayerHeader'
import PlayerControlButton from './PlayerControlButton'
import ProgressBar from './ProgressBar'
import DescriptionTime from './DescriptionTime'

import { Loading, Text } from '../..'

// assets
import * as Assets from './assets'

// styles
import styles from './styles'

// propTypes & props Component
import { _propTypes, _defaultProps } from './propTypes'
import { VideoTypes, Environments, GoogleCastEvents } from './_variables'
import { convertHMS } from '../../../core/utils/time-to-hms'

class PlayerWrapper extends React.Component {
  static propTypes = _propTypes

  static defaultProps = _defaultProps

  constructor (props) {
    super(props)
    this.state = {
      isPlaying: false,
      isReady: false,
      visibleControls: true,
      duration: { val: 0, str: '00:00' },
      time: { val: 0, str: '00:00' },
      isFullScreen: props.orientationOnMount === 'lockToLandscape',
      fullScreenStyle: props.orientationOnMount === 'lockToLandscape'
        ? styles.playerFullScreen
        : styles.playerOutFullScreen,
      preventTimeUpdate: false,
      // player
      showLoadingConfigPlayer: true,
      skinStylesPlayer: {},
      // cast
      isCasting: false,
      castDevice: null,
      castPosition: { val: 0, str: '00:00' }
    }

    this._shutdownTimer = null

    this.dateStartPlay = moment()
  }

  componentDidMount () {
    const { orientationOnMount } = this.props
    if (_isFunction(Orientation[orientationOnMount])) Orientation[orientationOnMount]()
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    this.getConfigPlayer()
    this.initChromeCast()
    this.registerListeners()
  }

  componentWillUnmount () {
    this._cancelHideControls()
    const { orientationOnUnmount } = this.props
    if (_isFunction(Orientation[orientationOnUnmount])) Orientation[orientationOnUnmount]()
    MediastreamPlayerModules.dismissMediastreamPlayer()
    this.backHandler.remove()
    this._shutdownTimer && clearTimeout(this._shutdownTimer)
    GoogleCastEvents.forEach(event => GoogleCast.EventEmitter.addListener(GoogleCast[event], () =>
      GoogleCast.EventEmitter.removeAllListeners(GoogleCast[event])
    ))
  }

  initChromeCast = async () => {
    try {
      const state = await GoogleCast.getCastState()
      const castDevice = await GoogleCast.getCastDevice()
      const isCasting = state.toString() === 'Connected'
      if (isCasting) MediastreamPlayerModules.pause()
      this.setState({isCasting, castDevice})
    } catch (e) {
      console.error(e)
    }
  }

  registerListeners = () => {
    GoogleCastEvents.forEach(event => {
      GoogleCast.EventEmitter.addListener(GoogleCast[event], (...args) => {
        switch (event) {
          case 'SESSION_STARTING':
            GoogleCast.getCastDevice().then(castDevice => this.setState({castDevice}))
            break
          case 'SESSION_STARTED':
            const {configCast} = this.props
            const {time, duration} = this.state
            GoogleCast.castMedia({
              ...configCast,
              streamDuration: duration.val, // seconds
              playPosition: time.val // seconds
            })
            GoogleCast
              .getCastDevice()
              .then(castDevice => this.setState({castDevice}))
            this.setState({isCasting: true, isPlaying: true})
            MediastreamPlayerModules.pause()
            break

          case 'MEDIA_PROGRESS_UPDATED':
            const { mediaProgress: { progress } } = args[0]
            const progressObj = {val: parseInt(progress, 10), str: convertHMS(progress)}
            this.setState({time: progressObj, castPosition: progressObj})
            this._shutdownTimer && clearTimeout(this._shutdownTimer)
            break

          case 'MEDIA_STATUS_UPDATED':
            const { mediaStatus: { idleReason, playerState } } = args[0]

            if (playerState === 4) {
              this._shutdownTimer = setTimeout(() => {
                this.stopCast()
                return this._renderAlert()
              }, 60000)
            }

            if (idleReason === 4 || playerState === 1) {
              this._shutdownTimer = setTimeout(() => {
                this.stopCast()
                return this._renderAlert()
              }, 60000)
            }
            break
          case 'MEDIA_PLAYBACK_STARTED':

            break
          case 'MEDIA_PLAYBACK_ENDED':
            this.setState({time: {val: 0, str: '00:00'}})
            this.stopCast()
            break
          case 'SESSION_ENDED':
            this.stopCast()
            break
        }
      })
    })
  }

  handleBackPress = () => {
    const {onGoBackPress} = this.props
    const { isCasting } = this.state
    if (isCasting) {
      // show alert message
      return Alert.alert(
        'Tienes un cast activo',
        'Deseas detener el cast?',
        [
          {
            text: 'Seguir...',
            style: 'cancel'
          },
          {text: 'Detener', onPress: this.stopCastOnBack}
        ],
        {cancelable: false}
      )
    }
    onGoBackPress()
    return true
  }

  getConfigPlayer = async () => {
    try {
      const { configPlayer: { id, environment }, orientationOnMount, geoRestriction, msgGeoRestriction } = this.props
      const Environment = environment === 'dev' ? Environments.DEV : Environments.PRODUCTION
      const urlConfig = `${Environment}/${VideoTypes.VOD}/${id}.json`
      // eslint-disable-next-line no-undef
      const response = await fetch(urlConfig)
      const responseJson = await response.json()
      const isFullScreen = orientationOnMount === 'lockToLandscape'

      this.setState(() => {
        if (_get(responseJson, 'status') === 'ERROR' && _get(responseJson, 'data') === 'GEO') {
          return ({
            showLoadingConfigPlayer: false,
            geo: {
              message: responseJson.message
            },
            isFullScreen
          })
        } else if (geoRestriction && geoRestriction.restricted) {
          return ({
            showLoadingConfigPlayer: false,
            geo: {
              message: msgGeoRestriction
            },
            isFullScreen
          })
        }
        return ({
          showLoadingConfigPlayer: false,
          ...this.drawPlayer(responseJson),
          isFullScreen
        })
      })
    } catch (error) {
      this.setState({ showLoadingConfigPlayer: false })
    }
  }

  drawPlayer = (config) => {
    const { skinStyles } = this.props
    let customStyles = {}

    if (_get(config, 'player.base_color')) {
      customStyles = ({
        thumbStyle: {
          backgroundColor: 'white'
        },
        trackColorTinColor: config.player.base_color,
        liveBadgeStyle: {
          backgroundColor: config.player.base_color
        }
      })
    }
    const hasLogoUrl = /(png|jpg)/.test(_get(config, 'player.logo.url'))
    const hasLogoSrc = /(png|jpg)/.test(_get(config, 'player.logo.src'))

    let logoPlayer = hasLogoUrl ? config.player.logo.url : hasLogoSrc ? config.player.logo.src : false

    return Object.assign({},
      { skinStylesPlayer: { ...skinStyles, ...customStyles } },
      logoPlayer && ({ logoPlayer }))
  }

  render () {
    const { orientationOnMount } = this.props
    const { showLoadingConfigPlayer, geo, isFullScreen } = this.state
    const showFullScreen = orientationOnMount === 'lockToLandscape' ? true : isFullScreen
    if (showLoadingConfigPlayer) return this._renderLoading()

    if (geo) return this._renderGeo()
    return (
      <SafeAreaView
        style={{...this.state.fullScreenStyle}}>
        <KeepAwake />
        {showFullScreen && <StatusBar hidden />}
        {this._renderPlayer()}
        {this._renderControls()}
        {this.props.children}
      </SafeAreaView>
    )
  }

  // methods controls player

  toggle = () => [this._toggleControls(true), MediastreamPlayerModules.toggle()]

  _seekToLive = async (arg) => {
    try {
      const seekTime = parseInt(arg)
      const duration = await MediastreamPlayerModules.getDuration()
      MediastreamPlayerModules.seekTo(Math.min(seekTime, duration))
      this.setState({ preventTimeUpdate: false })
    } catch (err) {
      return 0
    }
  }

  _seekTo = (arg) => {
    const { isCasting } = this.state
    const { live } = this.props.configPlayer
    const seekTime = arg ? parseInt(arg) : Math.max(this.state.time.val - 10, 0)
    if (isCasting) {
      GoogleCast.seek(seekTime)
      return GoogleCast.play()
    }
    if (live) {
      return this._seekToLive(seekTime)
    }
    MediastreamPlayerModules.seekTo(seekTime)
    this.setState({ preventTimeUpdate: false })
  }

  _seekCurrentTimeLive = async () => {
    const _duration = await MediastreamPlayerModules.getDuration()
    MediastreamPlayerModules.seekTo(_duration)
  }

  _onSlidingStart = () => {
    const { isCasting } = this.state
    if (isCasting) {
      GoogleCast.pause()
    }
    this.setState({ isPlaying: false, preventTimeUpdate: true }, this._cancelHideControls)
  }

  _onTimeUpdate = ({ value: time }) => {
    const { preventTimeUpdate, time: currentTime } = this.state
    if (!preventTimeUpdate && currentTime.val !== time.val) {
      this.setState(() => ({ time }))
    }
  }

  _onDurationUpdate = ({ value: duration }) => this.setState({ duration })

  _hideControls = _debounce(() => this.setState(() => ({ visibleControls: false })), 3000)

  _cancelHideControls = this._hideControls.cancel

  _onToggle = (event, ...props) => {
    const [{ value: isPlaying }] = props
    if (event === 'onReady') this.setState({ isReady: true })
    else if (event === 'onBuffering') this.setState({ isReady: false })
    else this.setState({ isPlaying, isReady: true })
    if (isPlaying) this._hideControls()
    else this._cancelHideControls()
  }

  toggleReproduction = () => {
    const { isCasting, isPlaying } = this.state
    this.setState({ isPlaying: !isPlaying })
    if (isCasting) {
      return isPlaying ? GoogleCast.pause() : GoogleCast.play()
    } else {
      return isPlaying ? MediastreamPlayerModules.pause() : MediastreamPlayerModules.play()
    }
  }

  _toggleControls = (nextState) => {
    if (!this.state.isReady) return
    nextState = _isUndefined(nextState) ? !this.state.visibleControls : nextState
    this._hideControls()
    if (nextState && this.state.isPlaying) this._hideControls()
    else this._cancelHideControls()
    this.setState({ visibleControls: !!(nextState) })
  }

  _onScreenPress = this._toggleControls

  inFullScreen = () => this.setState({ fullScreenStyle: styles.playerFullScreen, isFullScreen: true },
    () => {
      Orientation.getOrientation((orientation, err) => {
        if (err) return false
        orientation !== 'LANDSCAPE' && Orientation.lockToLandscape()
      })
    })

  outFullScreen = () => this.setState({ fullScreenStyle: styles.playerOutFullScreen, isFullScreen: false }, () => {
    this.props.orientationOnMount !== 'lockToLandscape' && Orientation.lockToPortrait()
  })

  isFullScreen = () => this.state.isFullScreen

  toogleFullScreen = () => this.isFullScreen() ? this.outFullScreen() : this.inFullScreen()

  // View Componets
  _renderLoading = () => {
    const { skinStylesPlayer: { trackColorTinColor }, fullScreenStyle } = this.state
    return (<View style={[styles.loading, fullScreenStyle]} key={'loading-player'}>
      <Loading color={trackColorTinColor} />
    </View>
    )
  }

  _renderGeo = () => {
    const { geo = { message: 'GEOGRAPHICAL RESTRICTION' }, fullScreenStyle } = this.state
    const { onGoBackPress } = this.props
    return (
      <View style={[styles.geoRestriction, fullScreenStyle]}>
        <Text style={{ color: 'white', textAlign: 'center', marginBottom: 10 }}> {geo.message} </Text>
        {onGoBackPress && <Button
          onPress={() => onGoBackPress()}
          title="Volver" />}
      </View>
    )
  }

  _renderPlayer = () => {
    const { configPlayer } = this.props
    const { isReady } = this.state
    return [<MediastreamPlayer
      style={styles.player}
      {...configPlayer}
      onReady={(arg) => this._onToggle('onReady', arg)}
      onPlay={(arg) => this._onToggle('onPlay', arg)}
      onPause={(arg) => this._onToggle('onPause', arg)}
      onBuffering={(arg) => this._onToggle('onBuffering', arg)}
      onEnd={(arg) => this._onToggle('onEnd', arg)}
      onError={(arg) => this._onToggle('onError', arg)}
      onTimeUpdate={this._onTimeUpdate}
      onDurationUpdate={this._onDurationUpdate}
      showControls={false}
      key='player-wrapper-1'
    />,
    !isReady && Platform.OS !== 'ios' && this._renderLoading()]
  }

  _renderCastMessage = () => {
    const {castPosition, isCasting, castDevice} = this.state
    if (!isCasting || _isEmpty(castDevice)) return
    if (!_isEmpty(castDevice) && castPosition.val === 0) return <Loading/>

    return (
      <View style={[styles.playerControlsButtonGroup, { marginRight: 20 }]}>
        <Text
          style={styles.castTitle}>
          Reproduciendo en {castDevice.name.length > 10 ? castDevice.name.substring(0, 10) + '...' : castDevice.name}
        </Text>
      </View>
    )
  }

  _renderAlert = () => {
    return Alert.alert(
      'Problemas de conexión',
      'Intenta conectarte nuevamente tu Chrome Cast',
      [
        {
          text: 'Cerrar'
        }
      ]
    )
  }

  stopCastOnBack = () => {
    const { onGoBackPress } = this.props
    try {
      GoogleCast.stop()
      GoogleCast.endSession(true)
      return onGoBackPress()
    } catch (e) {
      console.error(e)
    }
  }

  stopCast = () => {
    const {isCasting} = this.state
    try {
      isCasting && GoogleCast.endSession()
      GoogleCast.stop()
      this.setState({isCasting: false, castDevice: null})
      this._shutdownTimer && clearTimeout(this._shutdownTimer)
    } catch (e) {
      this.setState({isCasting: false, castDevice: null})
      this._shutdownTimer && clearTimeout(this._shutdownTimer)
    }
  }

  confirmStopCast = () => {
    const { isCasting } = this.state
    if (isCasting) {
      // show alert message
      return Alert.alert(
        'Tienes un cast activo',
        'Deseas detener el cast?',
        [
          {
            text: 'Seguir...',
            style: 'cancel'
          },
          {text: 'Detener', onPress: this.stopCast}
        ],
        {cancelable: false}
      )
    }
  }

  _renderCastButton = () => {
    const {isCasting} = this.state

    return !isCasting
      ? <CastButton style={{ width: 24, height: 24, tintColor: 'white' }} />
      : <TouchableOpacity onPress={this.confirmStopCast}>
        <MaterialCommunityIcons
          name={'cast-off'}
          color={'white'}
          size={26}
        />
      </TouchableOpacity>
  }

  _renderControls = () => {
    const {
      onGoBackPress,
      configPlayer,
      matchData,
      orientationOnMount,
      initialStateDvr,
      ButtonHeaderRightComponent = null
    } = this.props
    const initialFullScreen = orientationOnMount === 'lockToPortrait'
    const { live, name = 'OTT-Player', dvr = false } = configPlayer
    const {
      visibleControls,
      isReady,
      isPlaying,
      isFullScreen,
      fullScreenStyle,
      time,
      duration,
      skinStylesPlayer: {
        thumbStyle,
        trackColorTinColor,
        liveBadgeStyle
      }
    } = this.state
    const dataDvr = {}

    const now = moment()

    if (live && dvr && _get(initialStateDvr, 'windowDvr', false)) {
      dataDvr.scheduleOffSet = _get(initialStateDvr, 'scheduleOffSet', () => null)(this.dateStartPlay)
      const diff = now.diff(this.dateStartPlay)
      dataDvr.dvrMaximumValue = parseInt(moment.duration(diff).asSeconds() + _get(initialStateDvr, 'windowDvr'))
      dataDvr.startDvr = _get(initialStateDvr, 'windowDvr') - dataDvr.scheduleOffSet
    }
    return (
      <TouchableWithoutFeedback onPress={this._onScreenPress} key={'2'}>
        <View style={[styles.transparentPlayerWrapper, fullScreenStyle]}>
          <PlayerControls isVisible={visibleControls} style={styles.top} top>
            <View style={[styles.playerControlsButtonGroup, { flex: 1 }]}>
              {onGoBackPress && <PlayerControlButton onPress={this.handleBackPress} source={Assets.goBackImg} />}
              <PlayerHeader
                updateSeek={this._seekCurrentTimeLive}
                name={name}
                isLive={live}
                style={styles.playerHeader}
                isVisible
                liveBadgeStyle={liveBadgeStyle}
              />
            </View>
            {isReady && isFullScreen && ButtonHeaderRightComponent &&
                (<View style={[styles.playerControlsButtonGroup, styles.playerControlsButtonGroupRight]}>
                  {ButtonHeaderRightComponent}
                </View>)}
          </PlayerControls>

          {isReady && (
            <PlayerControls isVisible={visibleControls} drawGradient={false} style={[styles.bottomBar]}>
              { (dvr || !live) && <ProgressBar
                matchData={matchData}
                time={time}
                isLive={live}
                dvrMinimumValue={_get(dataDvr, 'startDvr')}
                dvrMaximumValue={_get(initialStateDvr, 'dvrMaximumValue')}
                duration={duration}
                onSlidingStart={this._onSlidingStart}
                onSlidingComplete={this._seekTo}
                thumbStyle={thumbStyle}
                trackColorTinColor={trackColorTinColor}
                {...dataDvr}
              />}
            </PlayerControls>
          )}
          {isReady && (
            <PlayerControls isVisible={visibleControls} style={styles.bottom}>
              <View style={styles.playerControlsButtonGroup}>
                <PlayerControlButton
                  onPress={this.toggleReproduction}
                  state={isPlaying}
                  source={Assets.playImg}
                  altSource={Assets.pauseImg} />
                {!live && <PlayerControlButton
                  onPress={this._seekTo}
                  state
                  source={Assets.goToImg}
                  altSource={Assets.goToImg} />}
                {!live && <DescriptionTime time={time} duration={duration} />}
              </View>
              {this._renderCastMessage()}
              <View style={styles.playerControlsButtonGroup}>
                {this._renderLogoPlayer()}
                {this._renderCastButton()}
                {initialFullScreen && <PlayerControlButton
                  onPress={this.toogleFullScreen}
                  state={isFullScreen}
                  source={Assets.fullScreenImg}
                  altSource={Assets.exitScreenImg} />}
              </View>
            </PlayerControls>)}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  _renderLogoPlayer = () => {
    const { logoPlayer, isFullScreen } = this.state
    return (isFullScreen && logoPlayer) && (<PlayerControlButton source={{ uri: logoPlayer }} />)
  }
}

export default PlayerWrapper
