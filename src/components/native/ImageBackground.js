import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ImageBackground as NativeImageBackground } from 'react-native'
import withStyle from '../../core/withStyle'
import { has } from 'lodash'

class ImageBackground extends Component {
  static defaultProps = {}

  static propTypes = {
    source: PropTypes.any,
    containerStyle: PropTypes.any,
    children: PropTypes.any,
    blurRadius: PropTypes.number
  }

  state = {}

  parseUrl = (path) => {
    return has(path, 'baseUrl') ? `${path.baseUrl || ''}${path.folder || ''}${path.fileName || ''}` : ''
  }

  fixHttpPrefix = (imageUri) => {
    return `https:${imageUri}`
  }

  checkImageSource = source => {
    if (source.uri) {
      return {
        uri: source.uri.indexOf('//') ? source.uri : this.fixHttpPrefix(source.uri)
      }
    }

    return source
  }

  render () {
    const { source = {}, children, blurRadius, ...props } = this.props
    return (
      <NativeImageBackground
        {...props}
        source={this.checkImageSource(source)}
        blurRadius={blurRadius}
      >
        {children}
      </NativeImageBackground>
    )
  }
}

export default withStyle(ImageBackground)
