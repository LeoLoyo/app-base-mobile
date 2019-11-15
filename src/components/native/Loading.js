import React from 'react'
import PropTypes from 'prop-types'
import View from './View'
import {
  ActivityIndicator
} from 'react-native'

const LoadingComponent = ({className, style, size, color, animating}) => (
  <View className={className} style={style}>
    <ActivityIndicator size={size} color={color} animating={animating} />
  </View>
)

LoadingComponent.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['small', 'large']),
  color: PropTypes.string,
  animating: PropTypes.bool,
  style: PropTypes.object
}

LoadingComponent.defaultProps = {
  className: 'justify-content-center align-items-center flex-row',
  size: 'large',
  color: 'white',
  animating: true
}

export default LoadingComponent
