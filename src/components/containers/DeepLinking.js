import React from 'react'
// import {Platform, Linking} from 'react-native'
import PropTypes from 'prop-types'
import withNavigation from '../../core/withNavigation'

class DeepLinking extends React.Component {
  componentDidMount () { // B
    // if (Platform.OS === 'android') {
    //   Linking.getInitialURL().then(url => {
    //     this.navigate(url)
    //   })
    // } else {
    //   Linking.addEventListener('url', this.handleOpenURL)
    // }
  }

  componentWillUnmount () { // C
    // Linking.removeEventListener('url', this.handleOpenURL)
  }

  handleOpenURL = (event) => { // D
    this.navigate(event.url)
  }

  navigate = (url = '') => { // E
    // const { navigate } = this.props.navigation
    // const route = url.replace(/.*?:\/\//g, '')
    // const id = route.match(/\/([^/]+)\/?$/)[1]
    // const routeName = route.split('/')[0]
    // if (String(routeName).toLowerCase() === 'media') {
    //   navigate('Media', { id, _id: id })
    // };
  }

  render () {
    return this.props.children
  }
}

DeepLinking.propTypes = {
  config: PropTypes.any,
  children: PropTypes.any,
  navigation: PropTypes.any
}

export default withNavigation(DeepLinking)
