import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ImageBackground from '../native/ImageBackground'
import Controls from './Controls'
import SeekBar from './SeekBar'
import withStyle from '../../core/withStyle'

class LargePlayer extends PureComponent {
  state = {
    randomPosition: Math.round(Math.random())
  }

  render () {
    const {
      // controls
      onPlay,
      onNext,
      onBackward,
      skipForward,
      skipBackward,
      // seek props
      onSeek,
      onSlidingStart,
      currentPosition,
      // other props
      loading,
      children,
      isPlaying,
      largePlayerProps,
      duration,
      currentIndexItem,
      playlistSize,
      adsIsPlaying
    } = this.props
    const { image, seekBarProps, showControls } = largePlayerProps
    const { source, blurRadius, className } = image
    const { defaultPlayerColor } = seekBarProps
    return (
      <ImageBackground
        source={source}
        blurRadius={blurRadius}
        className={className}
      >
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { randomPosition: this.state.randomPosition }) : child)}
        {showControls && <Controls
          adsIsPlaying={adsIsPlaying}
          currentIndexItem={currentIndexItem}
          isPlaying={isPlaying}
          onPlay={onPlay}
          onNext={onNext}
          onBackward={onBackward}
          skipForward={skipForward}
          skipBackward={skipBackward}
          loading={loading}
          playlistSize={playlistSize}
        />}
        {!loading && <SeekBar
          adsIsPlaying={adsIsPlaying}
          duration={duration}
          defaultPlayerColor={defaultPlayerColor}
          onSeek={onSeek}
          currentPosition={currentPosition}
          onSlidingStart={onSlidingStart}
          displayTime={true}
          thumbColor={'white'}
        />}
      </ImageBackground>
    )
  }
}

LargePlayer.propTypes = {
  children: PropTypes.any,
  duration: PropTypes.any,
  loading: PropTypes.bool,
  isPlaying: PropTypes.bool,
  adsIsPlaying: PropTypes.bool,
  onPlay: PropTypes.func,
  onNext: PropTypes.func,
  skipBackward: PropTypes.func,
  skipForward: PropTypes.func,
  onBackward: PropTypes.func,
  onSeek: PropTypes.func,
  currentPosition: PropTypes.number,
  onSlidingStart: PropTypes.func,
  largePlayerProps: PropTypes.any,
  currentIndexItem: PropTypes.number,
  playlistSize: PropTypes.number
}

export default withStyle(LargePlayer)
