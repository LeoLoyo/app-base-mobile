import React from 'react'
import PropTypes from 'prop-types'
import { Dimensions, StyleSheet, Text as NativeText, View } from 'react-native'
import Slider from 'react-native-slider'
import { Text } from '../../components'

const { width } = Dimensions.get('window')

function pad (n, width, z = 0) {
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

const minutesAndSeconds = (position) => ([
  pad(Math.floor(position / 60), 2),
  pad(position % 60, 2)
])

const SeekBar = ({duration, currentPosition, onSeek, onSlidingStart, defaultPlayerColor, adsIsPlaying}) => {
  const elapsed = minutesAndSeconds(Math.round(currentPosition))
  const remaining = minutesAndSeconds(+duration)
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <NativeText style={styles.text}>
          {elapsed[0] + ':' + elapsed[1]}
        </NativeText>
        <View style={{flex: 1}}/>
        <NativeText style={[styles.text, {width: 40}]}>
          {+duration > 1 && `${remaining[0]}:${remaining[1]}`}
        </NativeText>
      </View>

      {adsIsPlaying && <Text text={'%ads_label%'} className={'text-align-center text-ads-player'}/>}
      <Slider
        disabled={adsIsPlaying}
        maximumValue={Math.max(duration, 1, currentPosition + 1)}
        onSlidingStart={onSlidingStart}
        onSlidingComplete={onSeek}
        value={currentPosition}
        style={styles.slider}
        minimumTrackTintColor={defaultPlayerColor}
        maximumTrackTintColor='rgba(255, 255, 255, 0.14)'
        thumbStyle={styles.thumb}
        trackStyle={styles.track}/>

    </View>
  )
}

SeekBar.propTypes = {
  duration: PropTypes.number,
  adsIsPlaying: PropTypes.bool,
  currentPosition: PropTypes.number,
  onSeek: PropTypes.func,
  onSlidingStart: PropTypes.func,
  defaultPlayerColor: PropTypes.string
}

SeekBar.defaultProps = {
  duration: 220,
  currentPosition: 0,
  onSeek: () => {
  },
  onSlidingStart: () => null,
  defaultPlayerColor: 'red'
}

const styles = StyleSheet.create({
  slider: {
    marginBottom: 30
  },
  container: {
    width: width * 0.90,
    paddingHorizontal: 40
    // paddingTop: 16
  },
  track: {
    height: 4,
    borderRadius: 1
  },
  thumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white'
  },
  text: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold'
  }
})

export default SeekBar
