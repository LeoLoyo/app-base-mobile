import React from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Fade from './Fade'
import styles from './styles'

function PlayerControls (props) {
  const { style, contentContainerStyle, isVisible, children, top, drawGradient = true } = props
  const { playerBaseControl, playerControlsWrapper, playerControls } = styles
  const controlWrapperStyle = [playerControlsWrapper, style]
  const controlStyle = [playerBaseControl, playerControls, contentContainerStyle]
  return (
    <Fade style={controlWrapperStyle} visible={isVisible}>
      {drawGradient ? (
        <LinearGradient
          colors={top ? ['#000', '#000', 'transparent'] : ['transparent', '#000', '#000']}
          style={{ minHeight: 60, width: '100%', bottom: 0 }}>
          <View style={controlStyle}>
            {children}
          </View>
        </LinearGradient>
      ) : (
        <View style={controlStyle}>
          {children}
        </View>
      )}

    </Fade>
  )
}

PlayerControls.displayName = 'PlayerControls'

PlayerControls.propTypes = {
  style: PropTypes.any,
  contentContainerStyle: PropTypes.any,
  isVisible: PropTypes.bool,
  top: PropTypes.bool,
  children: PropTypes.any,
  drawGradient: PropTypes.bool
}

export default React.memo(PlayerControls)
