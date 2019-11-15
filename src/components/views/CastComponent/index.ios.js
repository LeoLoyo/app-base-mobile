import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {DeviceEventEmitter, TouchableWithoutFeedback} from 'react-native'
import {View, TouchableOpacity, Text} from '../../../components'
import Chromecast from 'react-native-google-cast'

class CastComponent extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor (props) {
    super(props)
    this.chromecastCastMedia = this.chromecastCastMedia.bind(this)
    this.getChromecasts = this.getChromecasts.bind(this)
    this.disconnectChromecast = this.disconnectChromecast.bind(this)
    this.timeout = null
    this.state = {
      chromecastAround: false,
      connected: false,
      chromecastList: [],
      showModal: false,
      mediaUrl: '',
      mediaTitle: ''
    }
  }

  componentDidMount () {
    Chromecast.startScan()
    DeviceEventEmitter
      .addListener(Chromecast.DEVICE_AVAILABLE, (existance) =>
        this.setState({chromecastAround: existance.device_available}))
    DeviceEventEmitter
      .addListener(Chromecast.MEDIA_LOADED, () => {})
    DeviceEventEmitter
      .addListener(Chromecast.DEVICE_CONNECTED, () => { this.chromecastCastMedia() })
    // DeviceEventEmitter.addListener(Chromecast.DEVICE_DISCONNECTED, () => Alert('Device disconnected!'))
    this.timeout = setTimeout(() => {
      if (this.state.chromecastAround) this.getChromecasts()
    }, 5000)
  }

  componentWillUnmount () {
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = null
  }

  disconnectChromecast () {
    Chromecast.disconnect()
    this.setState({connected: false})
  }

  async getChromecasts () {
    let chromecastDevices = await Chromecast.getDevices()
    this.setState(() => ({chromecastList: chromecastDevices}))
  }

  chromecastCastMedia () {
    this.setState({connected: true})
    Chromecast.castMedia(this.state.mediaUrl,
      this.state.mediaTitle, 'https://platform-static.cdn.mdstrm.com/img/logo-platform.svg', 0)
  };

  async connectToChromecast (id) {
    const isConnected = await Chromecast.isConnected()
    isConnected
      ? this.chromecastCastMedia()
      : Chromecast.connectToDevice(id)
  }

  renderChromecastList = () => {
    return this.state.chromecastList.map((item) => {
      return (
        <TouchableOpacity key={item.id} onPress={() => this.connectToChromecast(item.id)}>
          <Text style={styles.textElement}>{item.name}</Text>
        </TouchableOpacity>
      )
    })
  }

  renderDevicesPopup = () => {
    if (this.state.chromecastAround) {
      if (this.state.connected) {
        return (
          <View key='availableDevicesContainer' style={styles.container}>
            <View key='availableDevicesElement' style={styles.element}>
              <TouchableOpacity onPress={Chromecast.togglePauseCast} style={styles.button}>
                <Text style={styles.textElement}>Play/Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.disconnectChromecast} style={styles.button}>
                <Text style={styles.textElement}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      } else {
        return (
          <View key='availableDevicesContainer' style={styles.container}>
            <View key='availableDevicesElement' style={styles.element}>
              <Text style={styles.title}>Cast to</Text>
              {this.renderChromecastList()}
            </View>
            <TouchableOpacity onPress={this.closeCastModal} style={styles.button}>
              <Text style={styles.textElement}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )
      }
    } else {
      return (
        <View key='availableDevicesContainer' style={styles.container}>
          <View key='availableDevicesElement' style={styles.element}>
            <Text style={styles.title}>No devices found</Text>
            <TouchableOpacity onPress={this.closeCastModal} style={styles.button}>
              <Text style={styles.textElement}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  openCastModal = (data) => {
    if (data != null) {
      this.setState({mediaUrl: data.value.castUrl, mediaTitle: data.value.mediaTitle})
    }
    this.setState({showModal: true})
  }

  closeCastModal = () => {
    this.setState({showModal: false})
  }

  render () {
    return [
      React.Children.map(this.props.children,
        (child) => React.cloneElement(child,
          {...this.state, ...this.props, castButtonPressed: this.openCastModal})),
      this.state.showModal && (
        <TouchableWithoutFeedback key='mainTouchable' onPress={this.closeCastModal}>
          {this.renderDevicesPopup()}
        </TouchableWithoutFeedback>
      )
    ]
  }
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    margin: 'auto',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute'
  },
  element: {
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
    width: '45%',
    maxHeight: '80%',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 0.1
  },
  title: {
    color: 'black',
    fontSize: 20,
    padding: 20
  },
  textElement: {
    color: '#007AFF',
    fontSize: 17,
    padding: 10
  },
  button: {
    backgroundColor: 'white',
    width: '45%',
    borderRadius: 14,
    padding: 10,
    marginTop: 5,
    alignItems: 'center'
  }
}

export default CastComponent
