import React from 'react'
import PropTypes from 'prop-types'

import PlayerButton from './PlayerButton'
import styles from './styles'

class PlayerControlButton extends React.PureComponent {
  render () {
    const {style, buttonStyle, ...props} = this.props
    const {playerControlsButton, playerControlsButtonContent} = styles
    const containerStyles = [playerControlsButton, style]
    const buttonStyles = [playerControlsButtonContent, buttonStyle]
    return (
      <PlayerButton
        isVisible
        style={containerStyles}
        buttonStyle={buttonStyles}
        {...props} />
    )
  }
}

PlayerControlButton.displayName = 'PlayerControlButton'
PlayerControlButton.propTypes = {
  style: PropTypes.any,
  buttonStyle: PropTypes.any
}

export default React.memo(PlayerControlButton)
