import React from 'react'
import firebase from 'react-native-firebase'
import PropTypes from 'prop-types'
import {get} from 'lodash'
import _isFunction from 'lodash/isFunction'
import NavigationService from './NavigatorService'
import Storage from './Storage'
import {PortalContext} from './Portal'
import withMutation from './withMutation'
class Notifications extends React.Component {
  constructor (props) {
    super(props)
    this.messageListener = null
    this.notificationListener = null
  }

  static getMutation () {
    return {
      mutation: `mutation subscription($token: String) {
          notification {
            subscription (token: $token)
          }
        }`
    }
  }

  navigationHandler = ({ notification = {} }) => {
    const {type} = notification.data || {}
    switch (type) {
      case 'episode':
        // create episode object
        return this.goToEpisode(notification.data)
      default:
        return NavigationService.navigate('Home')
    }
  }

  getInitialNotification = async () => {
    try {
      const message = await firebase.notifications().getInitialNotification()
      message && this.navigationHandler(message)
    } catch (error) {
      console.error(error)
    }
  }

  goToEpisode = message => {
    const { _id: _idEpisode,
      media_id: _id,
      image,
      body: title,
      showName: nameProgram,
      show: showId,
      first_emision: firstEmision,
      monthCreated,
      dayCreated,
      media_duration: duration,
      episodes = [],
      content = null,
      media_file: path,
      seasons = [] } = message
    // show object to mini player
    const show = {text: nameProgram, id: showId}
    // object to portal
    const data = {
      _id,
      _idEpisode,
      description: '',
      image,
      title,
      nameProgram,
      show,
      duration: parseInt(duration, 10),
      firstEmision,
      monthCreated,
      dayCreated,
      episodes,
      content,
      path,
      playlists: {
        seasons,
        pathItems: null
      }
    }
    NavigationService.navigate('ShowDetails', {_id: showId})
    this.context.portal.set({data})
  }

  _defaultMessageHandler = (message) => console.warn(message)
  handlers = {
    logHandler: this._defaultMessageHandler
  }

  _onMessageHandler = () => firebase.messaging().onMessage((message) => {
    return this.navigationHandler(message)
  })

  _notificationHandler = () => firebase
    .notifications()
    .onNotificationOpened((notificationOpen) => {
      this.navigationHandler(notificationOpen)
    })

  _subscribeToTopic = async (topicName, handler) => {
    try {
      const { config } = this.props
      const tokendDevices = await firebase.messaging().getToken()
      await this.props.mutation.action({
        variables: { token: tokendDevices },
        refetchQueries: this.props.refetchQueries
      })
      if (get(config, 'notifications.saveTokenInStorage', false)) {
        const PREFIX_DEVICES_TOKEN = 'APP_DEVICE_TOKEN'
        tokendDevices && await Storage.setItem(PREFIX_DEVICES_TOKEN, tokendDevices)
      }

      const mustSubscribe = get(config, 'notifications.initialSubscribe', true)
      mustSubscribe && await firebase.messaging().subscribeToTopic(topicName)
      this.messageListener = this._onMessageHandler()
      this.notificationListener = this._notificationHandler()
    } catch (e) {
      console.error('error subsribing to topic:', e)
    }
  }

  _unSubscribeToTopic = (topicName) => {
    firebase.messaging().unsubscribeFromTopic(topicName)
  }

  async componentDidMount () {
    await this.getInitialNotification()
    const {config} = this.props
    const enabled = await firebase.messaging().hasPermission()
    const topic = get(config, 'notifications.topic', 'generalTopic')
    const handler = get(config, 'notifications.handler')
    if (enabled) {
      return this._subscribeToTopic(topic, handler)
    }
    try {
      await firebase.messaging().requestPermission()
      // User has authorised
      this._subscribeToTopic(topic, handler)
    } catch (error) {
      // User has rejected permissions
      console.error('requestPermission disabled')
    }
  }

  componentWillUnmount () {
    _isFunction(this.messageListener) && this.messageListener()
    _isFunction(this.notificationListener) && this.notificationListener()
  }

  render () {
    return null
  }
}

Notifications.contextType = PortalContext

Notifications.propTypes = {
  config: PropTypes.object,
  children: PropTypes.any,
  mutation: PropTypes.any,
  refetchQueries: PropTypes.any
}

Notifications.defaultProps = {
  refetchQueries: []
}

export default withMutation(Notifications)
