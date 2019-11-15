import React, { Component } from 'react'
import { Platform } from 'react-native'
import _isEmpty from 'lodash/isEmpty'
import _isArray from 'lodash/isArray'
import _findIndex from 'lodash/findIndex'
import _get from 'lodash/get'
import _set from 'lodash/set'
import _has from 'lodash/has'
import PropTypes from 'prop-types'
import moment from 'moment'
import { MediastreamPlayer, MediastreamPlayerModules } from 'react-native-mediastream-player'
import MusicControl from 'react-native-music-control'
import CallDetectorManager from 'react-native-call-detection'

import TinyPlayer from '../views/TinyPlayer'
import LargePlayer from '../views/LargePlayer'

import { PortalContext } from '../../core/Portal'
import Modal from '../native/Modal'
import withMutation from '../../core/withMutation'
import { getFromMultipleStorage } from '../../core/Auth'
import Storage from '../../core/Storage'

class PlayerAudio extends Component {
  constructor (props) {
    super(props)
    this.state = {
      playing: false,
      loading: true,
      seekEmited: false,
      currentPosition: 0,
      preventTimeUpdate: false,
      firstMount: true,
      duration: 0,
      prevPlaying: false,
      reloading: false,
      adsIsPlaying: false
    }
  }

  static getMutation (props) {
    const { refetchQueries = [], query = [] } = props.mutation
    return {
      mutation: query,
      refetchQueries
    }
  }

  async componentDidMount () {
    try {
      const { data = {} } = this.context.portal
      this.setupPlayer(data)
      const { _id: currentAudio } = data
      const { auth_customer_id: customerId } = await getFromMultipleStorage(['auth_customer_id'])
      this.setState(
        () => ({ customerId, currentAudio, isAuth: !!(customerId) }),
        () => Platform.OS === 'ios' && this.setupMediaPlayerNotificationView(data))
      this.startListenerTapped()
    } catch (error) {
      console.error('methods componentDidMount AudioPlayer', error)
    }
  }

  componentDidUpdate () {
    try {
      const { currentAudio } = this.state
      const { data = {}, set: setPortal } = this.context.portal
      const { _id, reload = false } = data
      const isValidId = !!(_id && currentAudio)
      if (!isValidId) return
      if (currentAudio !== _id || ((currentAudio === _id) && reload)) {
        delete data.reload
        setPortal({ data })
        this.setState({ currentAudio: _id, loading: true, playing: false, firstMount: true })
        this.setupPlayer(data)
      }
    } catch (err) {
      console.error('Method componentDidUpdate PlayerAudio:', err)
    }
  }

  startListenerTapped = async () => {
    this.callDetector = new CallDetectorManager((event) => {
      // For iOS event will be either "Connected",
      // "Disconnected","Dialing" and "Incoming"

      // For Android event will be either "Offhook",
      // "Disconnected", "Incoming" or "Missed"
      const { playing, prevPlaying } = this.state

      switch (event) {
        case 'Disconnected':
          prevPlaying && MediastreamPlayerModules.toggle()
          this.setState({ prevPlaying: false })
          break
        case 'Connected':
          playing && MediastreamPlayerModules.pause()
          break
        case 'Incoming':
          this.setState({ prevPlaying: playing }, () => playing && MediastreamPlayerModules.pause())
          break
        case 'Offhook':
          !prevPlaying && this.setState({ prevPlaying: playing }, () => playing && MediastreamPlayerModules.pause())
          break
        case 'Missed':
          prevPlaying && MediastreamPlayerModules.toggle()
          this.setState({ prevPlaying: false })
          break
        case 'Dialing':
          !prevPlaying && this.setState({ prevPlaying: playing }, () => playing && MediastreamPlayerModules.pause())
          break
      }
    },
    false // if you want to read the phone number of the incoming call [ANDROID], otherwise false
    )
  }

  setupMediaPlayerNotificationView = (data) => {
    const { canDispatchPrev, canDispatchNext } = this.getCurrentItem()

    MusicControl.enableControl('nextTrack', canDispatchNext)
    MusicControl.enableControl('previousTrack', canDispatchPrev)
    MusicControl.enableBackgroundMode(true)
    MusicControl.enableControl('togglePlayPause', true)
    MusicControl.on('togglePlayPause', this.onPlay)
    MusicControl.on('nextTrack', this.onNextWidget)
    MusicControl.on('previousTrack', this.onPrevWidget)
    this.setupNotificationView(data)
  }

  setupNotificationView = (data) => {
    const { config } = this.props
    MusicControl.setNowPlaying({
      title: data.title,
      artwork: data.image ? String(data.image + _get(config, 'player.presetImgNotificacion', '?auto=compress')) : '', // URL or RN's image require()
      artist: data.nameProgram,
      duration: data.duration // (Seconds)
    })
    this.setState({ duration: data.duration })
  }

  async componentWillUnmount () {
    const { set: setPortal } = this.context.portal
    const playing = await MediastreamPlayerModules.isPlaying()
    playing && MediastreamPlayerModules.pause()
    MediastreamPlayerModules.dismissMediastreamPlayer()
    setPortal({ data: null })
  }

  // this is the callback wheyern the player start
  onStartPlay = ({ value: playing }) => {
    if (Platform.OS === 'ios') {
      MusicControl.updatePlayback({
        state: MusicControl.STATE_PLAYING,
        elapsedTime: this.state.currentPosition
      })
    }
    if (this.state.isAuth && this.state.firstMount) {
      return this.setState({ playing, loading: false, firstMount: false, seekEmited: false, reloading: false }, () => {
        this._notifyContentViewed()
      })
    }
    this.setState({ playing, loading: false, seekEmited: false, reloading: false })
  }

  _updateSeek = () => {
    try {
      const { data: { timeViewed, viewed, content: { duration } = {} } = {} } = this.context.portal
      if (!viewed || !timeViewed) return 0
      if (timeViewed && timeViewed < duration) return parseInt(timeViewed, 10)
    } catch (error) {
      return 0
    }
  }

  _notifyContentViewed = () => {
    try {
      const { data } = this.context.portal
      const { _idEpisode, itemInStorage } = data
      !itemInStorage && this.props.mutation.action({
        variables: { _id: _idEpisode },
        refetchQueries: this.props.refetchQueries
      })
      if (itemInStorage) {
        const { downloads = {} } = this.context.portal.get()
        _set(downloads[_idEpisode], 'viewed', true)
        Storage.setItem('DOWNLOADS', JSON.stringify(downloads), () => this.context.portal.set({ downloads }))
      }
    } catch (error) {
      console.error('Player::Audio _notifyContentViewed: ', error)
    }
  }

  toogleControlsNotificationPlayer = () => {
    if (Platform.OS === 'ios') {
      const { data = {} } = this.context.portal
      this.setupMediaPlayerNotificationView(data)
    }
  }
  // Event to Ads
  onEventAds = (event) => {
    if (event === 'onAdPlay') {
      this.setState({ adsIsPlaying: true })
    } else if (event === 'onAdEnded') {
      this.setState({ adsIsPlaying: false },
        () => this.toogleControlsNotificationPlayer())
    }
  }

  // function props of the player
  onPlay = () => {
    const { adsIsPlaying } = this.state
    // avoid player notification to play episode audio on pause/play
    if (!adsIsPlaying) {
      this.setState({ playing: !this.state.playing })
      this._player && MediastreamPlayerModules.toggle()
    }
  }

  onReady = () => {
    const { data: { _id } } = this.context.portal
    this._player && this.setState({ currentAudio: _id })
  }

  onEnd = (data) => this.changeItemIndex(1)

  onPrevWidget = () => {
    const { canDispatchPrev } = this.getCurrentItem()
    canDispatchPrev && this.changeItemIndex(-1)
  }
  onNextWidget = () => {
    const { canDispatchNext } = this.getCurrentItem()
    canDispatchNext && this.changeItemIndex(1)
  }

  skipForward = () => {
    const { content: { duration } } = this.context.portal.data
    const forward10 = duration > this.state.currentPosition + 10 ? this.state.currentPosition + 10 : null
    this._player && forward10 ? MediastreamPlayerModules.seekTo(forward10) : this.changeItemIndex(1)
  }

  skipBackward = () => {
    const backward10 = this.state.currentPosition - 10 > 0 ? this.state.currentPosition - 10 : 0
    this._player && MediastreamPlayerModules.seekTo(backward10)
  }

  onError = (data) => {
    const { set: setPortal } = this.context.portal
    this.setState(
      () => ({ playing: false }),
      () => setPortal({ data: null }))
  }

  onStop = ({ value: freshPlaying }) => {
    const { seekEmited, playing, reloading } = this.state
    if ((seekEmited && playing) || reloading) {
      // this.setState({ seekEmited:false })
      return
    }
    this.setState({ freshPlaying, seekEmited: false, playing: false })
    if (Platform.OS === 'ios') {
      MusicControl.updatePlayback({
        state: MusicControl.STATE_PAUSED,
        elapsedTime: this.state.currentPosition
      })
    }
  }

  onNext = () => {
    this.changeItemIndex(1)
  }

  onBackward = () => {
    this.changeItemIndex(-1)
  }

  getPlaylist = () => {
    const { data } = this.context.portal
    const { playlists: { seasons, pathItems } } = data

    if (!_isArray(seasons)) return []
    return seasons.reduce((prev, curr) => ([...prev, ..._get(curr, pathItems)]), [])
  }

  getCurrentItem = () => {
    const { data } = this.context.portal
    const playlist = this.getPlaylist()
    let currentItemIndex
    if (_isEmpty(playlist)) {
      currentItemIndex = 0
    } else {
      currentItemIndex = _findIndex(playlist, ['content._id', data._id])
    }

    return {
      canDispatchNext: currentItemIndex >= 0 && currentItemIndex < playlist.length - 1,
      canDispatchPrev: currentItemIndex > 0
    }
  }

  changeItemIndex = value => {
    try {
      const { data, set: setPortal } = this.context.portal
      const playlist = this.getPlaylist()
      if (_isEmpty(playlist)) {
        setPortal({ data: { ...data, reload: true } })
        return false
      }
      const currentItemIndex = _findIndex(playlist, ['content._id', data._id])
      const nextItem = playlist[currentItemIndex + (value)]

      if (_isEmpty(nextItem)) {
        if (currentItemIndex > 0) this.onPlayNext(playlist[0])
        else setPortal({ data: { ...data, reload: true } })
        return
      }
      this.onPlayNext(nextItem)
    } catch (e) {
      console.error('method changeItemIndex error :', e)
    }
  }

  onPlayNext = (nextItem = {}) => {
    const { data, set: setPortal } = this.context.portal
    const { image } = data
    const {
      _id: idEpisode,
      text, images,
      content: {
        _id,
        duration,
        date_recorded: dateRecorded,
        file,
        keep_watching: {
          time: timeViewed
        } = {}
      }
    } = nextItem
    const newDataContext = {
      ...data,
      ...nextItem,
      dayCreated: moment(dateRecorded).format('D'),
      monthCreated: moment(dateRecorded).format('MMMM YYYY'),
      path: file,
      duration,
      timeViewed,
      _idEpisode: idEpisode,
      title: text,
      image: images[0] || image,
      _id
    }
    return setPortal({ data: newDataContext })
  }
  onSeek = time => {
    MediastreamPlayerModules.seekTo(time)
    this.setState({
      seekEmited: true,
      preventTimeUpdate: false
    })
    if (Platform.OS === 'ios') {
      MusicControl.updatePlayback({
        elapsedTime: Math.ceil(time)
      })
    }
  }

  onSlidingStart = () => this.setState({ preventTimeUpdate: true })

  onTimeUpdate = ({ value }) => {
    const { data } = this.context.portal
    const { _idEpisode, itemInStorage } = data
    const { preventTimeUpdate } = this.state
    if (!preventTimeUpdate && this.state.currentPosition !== value.val) {
      this.setState(() => ({currentPosition: value.val}))
    }
    // update keep watching value
    if (itemInStorage) {
      this.updateProgressOfDownload(value.val, _idEpisode)
    }
  }

  toggleModal = () => {
    const { set: setPortal, modalPlayer } = this.context.portal
    setPortal({ modalPlayer: !modalPlayer })
  }

  updateProgressOfDownload = (time, idEpisode) => {
    const { downloads = {} } = this.context.portal.get()

    const interval = 15 // interval
    const doEvery = ((time % interval) === 0) // every Interval seconds update the progress
    if (doEvery && _isArray(downloads)) {
      _set(downloads[idEpisode], 'content.keep_watching.time', time)
      const progress = Math.round(time * 100 / downloads[idEpisode].content.duration)
      _set(downloads[idEpisode], 'content.keep_watching.progress', progress)
      Storage.setItem('DOWNLOADS', JSON.stringify(downloads), () => this.context.portal.set({downloads}))
    }
  }

  // emulates playlist behavior
  setupPlayer = async (data = {}) => {
    try {
      const { config, mergeWithDownload, keyDownload, pathDownloads, iconImage = '' } = this.props
      const { [keyDownload]: downloads } = this.context.portal
      const { customerId = null } = this.state
      const { _id: id } = data
      const { canDispatchPrev, canDispatchNext } = this.getCurrentItem()

      if (_isEmpty(data)) return null
      const configPlayer = {
        id,
        autoPlay: true,
        customUI: false,
        showControls: false,
        volume: 1,
        type: _get(config, 'player.type', 'VOD'),
        audio: true,
        environment: _get(config, 'player.environment', 'dev'),
        accountID: _get(config, 'player.account'),
        distributorId: _get(config, 'player.distributorId', null),
        appName: _get(config, 'player.appName', null),
        appVersion: _get(config, 'player.appVersion', null),
        customerID: customerId,
        onTimeUpdate: this.onTimeUpdate,
        onPlay: this.onStartPlay,
        onError: this.onError,
        onReady: this.onReady,
        onPause: this.onStop,
        onEnd: this.onEnd,
        onPrevWidget: this.onPrevWidget,
        onNextWidget: this.onNextWidget,
        miniPlayerConfig: {
          hasWidgetNotifications: true,
          name: String(_get(data, 'title', '')),
          description: _get(data, 'show.text', ''),
          album: String(_get(data, 'description', '')),
          image: data.image ? String(data.image + _get(config, 'player.presetImgNotificacion', '?auto=compress')) : '',
          imageIconUrl: iconImage,
          setStateNext: canDispatchNext,
          setStatePrev: canDispatchPrev
        },
        audioVideoFormat: _get(config, 'player.audioFormat', 'MP3'),
        startAt: this._updateSeek()
      }
      const source = _get(data, 'itemInStorage.pathMedia', false)
      if (source) {
        configPlayer.src = source
      }

      if (mergeWithDownload) {
        if (_has(downloads, _get(data, pathDownloads))) {
          const itemInStorage = _get(downloads, _get(data, pathDownloads))
          if (_has(itemInStorage, 'pathMedia')) {
            configPlayer.src = _get(itemInStorage, 'pathMedia')
          }
        }
      }
      if (this._player) {
        // create a new instance of the player with the same config but different mediaID
        configPlayer.needReload = true
        this.setState({
          currentPosition: 0,
          playing: false,
          currentAudio: id,
          loading: true,
          reloading: true,
          adsIsPlaying: false
        })
        MediastreamPlayerModules.reloadPlayer(configPlayer)
        if (Platform.OS === 'ios') {
          MusicControl.enableControl('nextTrack', canDispatchNext)
          MusicControl.enableControl('previousTrack', canDispatchPrev)
          this.setupNotificationView(data)
        }
      }
    } catch (err) {
      console.error('method setupPlayer error :', err)
    }
  }

  _setRefPlayer = ref => {
    this._player = ref
  }

  _renderPlayerMediastream = ({
    title = '',
    description = '',
    image = '',
    _id,
    itemInStorage: { pathMedia: source = null } = {},
    show },
  { player }) => {
    const {
      account,
      distributorId = null,
      appName = null,
      appVersion = null,
      type = 'VOD',
      environment = 'dev',
      presetImgNotificacion = '?auto=compress',
      audioFormat
    } = player
    const { canDispatchPrev, canDispatchNext } = this.getCurrentItem()

    const { currentAudio, customerId = null } = this.state
    const { iconImage = '' } = this.props
    return currentAudio ? (<MediastreamPlayer
      id={_id}
      ref={this._setRefPlayer}
      key={'MediastreamPlayer'}
      src={source}
      audio
      autoPlay={true}
      onPlay={this.onStartPlay}
      onPause={this.onStop}
      onError={this.onError}
      onReady={this.onReady}
      onEnd={this.onEnd}
      onPrevWidget={this.onPrevWidget}
      onNextWidget={this.onNextWidget}
      onTimeUpdate={this.onTimeUpdate}
      onAdLoaded={() => this.onEventAds('onAdLoaded')}
      onAdPlay={() => this.onEventAds('onAdPlay')}
      onAdPause={() => this.onEventAds('onAdPause')}
      onAdResume={() => this.onEventAds('onAdResume')}
      onAdEnded={() => this.onEventAds('onAdEnded')}
      onAdError={() => this.onEventAds('onAdError')}
      miniPlayerConfig={{
        hasWidgetNotifications: true,
        name: String(title),
        description: _get(show, 'text', ''),
        album: String(description),
        image: String(image + presetImgNotificacion),
        imageIconUrl: iconImage,
        setStateNext: canDispatchNext,
        setStatePrev: canDispatchPrev
      }}
      showControls={false}
      type={type}
      environment={environment}
      handleAppStateChange={(state) => null} // if state is background show Widget
      accountID={account}
      customerID={customerId} // if this is null android will crash
      // Player tracker config
      distributorId={distributorId}
      appName={appName}
      appVersion={appVersion}
      onUnmount={() => null}
      video
      audioVideoFormat={audioFormat || 'MP3'}
      startAt={this._updateSeek()}
    />) : null
  }
  _renderTinyPlayer = (data, { loading, playing }) => {
    const { tinyPlayerProps } = this.props
    const { adsIsPlaying = false } = this.state
    return (
      <TinyPlayer
        key={'TinyPlayer'}
        tinyPlayerProps={tinyPlayerProps}
        loading={loading}
        isPlaying={playing}
        onPlay={this.onPlay}
        toggleModal={this.toggleModal}
        adsIsPlaying={adsIsPlaying}
        // seek bar props
        data={data}
      />
    )
  }

  _renderLargePlayer = ({ duration }, { currentPosition, loading, playing }, modalPlayer) => {
    const { largePlayerProps, children } = this.props
    const { adsIsPlaying = false } = this.state
    const { data } = this.context.portal
    const playlist = this.getPlaylist()
    const currentItemIndex = _findIndex(playlist, ['content._id', data._id])
    return (<Modal
      key={'Modal-LargePlayer'}
      visible={modalPlayer}
      animationType={'slide'}
      transparent={false}
      android={{
        hardwareAccelerated: true,
        onRequestClose: this.toggleModal
      }}
    >
      <LargePlayer
        key={'LargePlayer'}
        // control props
        onPlay={this.onPlay}
        onNext={this.onNext}
        onBackward={this.onBackward}
        skipForward={this.skipForward}
        skipBackward={this.skipBackward}
        loading={loading}
        isPlaying={playing}
        // seek bar props
        currentPosition={currentPosition}
        onSlidingStart={this.onSlidingStart}
        onSeek={this.onSeek}
        duration={duration}
        largePlayerProps={largePlayerProps}
        currentIndexItem={currentItemIndex}
        playlistSize={playlist.length}
        adsIsPlaying={adsIsPlaying}
      >
        {children}
      </LargePlayer>
    </Modal>)
  }

  render () {
    const { config } = this.props
    const { data, modalPlayer = false } = this.context.portal
    return !_isEmpty(data) ? (
      [
        this._renderPlayerMediastream(data, config),
        this._renderTinyPlayer(data, this.state),
        this._renderLargePlayer(data, this.state, modalPlayer)
      ]
    ) : null
  }
}

PlayerAudio.propTypes = {
  type: PropTypes.oneOf(['tiny', 'large']),
  image: PropTypes.any,
  episode: PropTypes.object,
  config: PropTypes.object,
  containerStyle: PropTypes.any,
  defaultStyle: PropTypes.object,
  tinyPlayerProps: PropTypes.any,
  largePlayerProps: PropTypes.any,
  data: PropTypes.object,
  portal: PropTypes.object,
  children: PropTypes.any,
  mutation: PropTypes.any,
  mergeWithDownload: PropTypes.bool,
  keyDownload: PropTypes.string,
  refetchQueries: PropTypes.any,
  pathDownloads: PropTypes.string,
  iconImage: PropTypes.string
}
PlayerAudio.defaultProps = {
  defaultStyle: {
    width: 0,
    height: 0
  },
  mergeWithDownload: false,
  keyDownload: 'downloads',
  pathDownloads: '_idEpisode'
}

PlayerAudio.contextType = PortalContext
export default withMutation(PlayerAudio)
