import React from 'react'
import PropTypes from 'prop-types'
import { Text, TouchableHighlight } from 'react-native'
import Fade from './Fade'
import styles from './styles'

function PlayerHeader (props) {
  const { isVisible, isLive, name, style, liveBadgeStyle, titleStyle, updateSeek } = props
  const {
    playerHeaderContainer,
    playerHeaderTitleStyle,
    playerHeaderLiveBadge,
    playerHeaderLiveBadgeText
  } = styles
  return (
    <Fade visible={isVisible} style={[playerHeaderContainer, style]}>
      {isLive && (
        <TouchableHighlight
          activeOpacity={0.95}
          onPress={updateSeek}
          style={[playerHeaderLiveBadge, liveBadgeStyle]}>
          <Text style={playerHeaderLiveBadgeText}>{`LIVE`}</Text>
        </TouchableHighlight>
      )}
      <Text numberOfLines={1} style={[playerHeaderTitleStyle, titleStyle]}>
        {name}
      </Text>
    </Fade>
  )
}

PlayerHeader.displayName = 'PlayerHeader'

PlayerHeader.propTypes = {
  isVisible: PropTypes.bool,
  isLive: PropTypes.bool,
  name: PropTypes.string,
  style: PropTypes.any,
  liveBadgeStyle: PropTypes.any,
  titleStyle: PropTypes.string,
  updateSeek: PropTypes.func
}

export default React.memo(PlayerHeader)
