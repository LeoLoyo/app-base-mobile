import React from 'react'
import PropTypes from 'prop-types'
import PlayerQueryVodView from '../../PlayerQueryVodView'
import PlayerQueryLiveView from '../../PlayerQueryLiveView'

function Player (props) {
  const _className = props.orientation === 'landscape'
    ? 'bg-dark w-100 h-100'
    : 'bg-dark w-100 aspect-ratio-16-9'
  const Player =
      props.type === 'Media' ? (
        <PlayerQueryVodView
          {...props}
          orientationOnUnmount="lockToPortrait"
          classNameWrapper={_className}
        >{props.children}</PlayerQueryVodView>
      ) : props.type === 'Live' ? (
        <PlayerQueryLiveView
          {...props}
          orientationOnUnmount="lockToPortrait"
          classNameWrapper={_className}
        >{props.children}</PlayerQueryLiveView>
      ) : null
  return Player
}

Player.propTypes = {
  children: PropTypes.any,
  type: PropTypes.oneOf(['Live', 'Media']).isRequired,
  orientation: PropTypes.oneOf(['landscape', 'portrait']).isRequired,
  orientationOnMount: PropTypes.oneOf(['lockToLandscape', 'lockToPortrait'])
    .isRequired
}

export default Player
