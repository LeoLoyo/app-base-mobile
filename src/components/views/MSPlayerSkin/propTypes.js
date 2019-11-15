import PropTypes from 'prop-types'

const _propTypes = {
  orientationOnMount: PropTypes.oneOf(['lockToLandscape', 'lockToPortrait']),
  orientationOnUnmount: PropTypes.oneOf(['lockToLandscape', 'lockToPortrait']),
  skinStyle: PropTypes.object
}

const _defaultProps = {
  skinStyles: {
    thumbStyle: {}
  },
  configPlayer: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
}

export {
  _propTypes,
  _defaultProps
}
