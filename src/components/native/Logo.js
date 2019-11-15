
import React from 'react'
import PropTypes from 'prop-types'
import CachedImage from './CachedImage'

export const Component = ({ source, className, ...props }) => {
  return <CachedImage className={className} source={source} resizeMode='contain' {...props} />
}

/**
 * Props
 */
Component.propTypes = {
  className: PropTypes.string,
  source: PropTypes.shape({
    uri: PropTypes.string
  })
}

export default Component
