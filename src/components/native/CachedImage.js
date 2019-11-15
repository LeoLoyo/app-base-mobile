import React from 'react'
import {Image} from 'react-native'
import {has, isString} from 'lodash'
import FastImage from 'react-native-fast-image'
import { createImageProgress } from 'react-native-image-progress'
import PropTypes from 'prop-types'
import withStyle from '../../core/withStyle'

const ImageWithProgress = createImageProgress(FastImage)

const parseUrl = (path) => {
  return has(path, 'baseUrl')
    ? `${path.baseUrl || ''}${path.folder || ''}${path.fileName || ''}` : ''
}

const fixHttpPrefix = (imageUri) => {
  return `https:${imageUri}`
}
class CachedImage extends React.PureComponent {
  render () {
    const {
      animated, source = {}, imageRef,
      priority = 'normal', resizeMode = 'cover', indicatorProps, ...props} = this.props
    if (has(source, 'uri')) {
      if (!isString(source.uri) || String(source.uri).includes('undefined')) return null
      if (source.uri.length === 0) return null
      return (
        <ImageWithProgress
          {...props}
          ref={imageRef}
          resizeMode={FastImage.resizeMode[resizeMode]}
          indicatorProps={indicatorProps}
          source={{
            uri: ((source.parse || 0)
              ? parseUrl(source.uri) : (source.uri.indexOf('//')
                ? source.uri : fixHttpPrefix(source.uri))),
            priority: FastImage.priority[priority]}}
        />
      )
    }

    return <Image {...props} ref={imageRef} source={source} resizeMode={resizeMode} />
  }
}

CachedImage.defaultProps = {
  indicatorProps: {
    color: 'white'
  }
}

CachedImage.propTypes = {
  animated: PropTypes.bool,
  resizeMode: PropTypes.string,
  priority: PropTypes.string,
  imageRef: PropTypes.string,
  images: PropTypes.object,
  indicatorProps: PropTypes.object,
  source: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number
  ]).isRequired,
  config: PropTypes.object
}

export default withStyle(CachedImage)
