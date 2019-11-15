import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import Slider from 'react-native-slider'
import Marker from './marker'
import FirebaseMarkersPlayerLive from './FirebaseMarker'

function ProgressBar (props) {
  const {
    duration,
    time,
    onSlidingStart,
    onSlidingComplete,
    thumbStyle,
    trackColorTinColor,
    matchData,
    isLive,
    dvrMinimumValue,
    dvrMaximumValue
  } = props
  let { val: currentPosition } = time
  const { val: durationTime } = duration
  let maxValue = durationTime
  if (isLive) {
    maxValue = dvrMaximumValue
  }
  return (
    <View>
      <FirebaseMarkersPlayerLive isLive={isLive}>
        {({ markers }) => {
          return (
            <React.Fragment>
              {
                isLive
                  ? (<Marker
                    live
                    data={markers}
                    durationTime={maxValue}
                    startDvr={dvrMinimumValue}
                    onPress={onSlidingComplete}/>)
                  : (<Marker
                    data={matchData}
                    durationTime={durationTime}
                    onPress={onSlidingComplete}/>)
              }
              <View style={styles.bar}>
                <Slider
                  {...props}
                  value={Math.max(Math.min(currentPosition, maxValue), 0)}
                  minimumValue={dvrMinimumValue || 0}
                  maximumValue={Math.max(currentPosition, maxValue)}
                  onSlidingStart={onSlidingStart}
                  onSlidingComplete={onSlidingComplete}
                  style={styles.slider}
                  minimumTrackTintColor={trackColorTinColor}
                  maximumTrackTintColor='rgba(255, 255, 255, 0.14)'
                  thumbStyle={[styles.thumb, thumbStyle]}
                  trackStyle={styles.track}
                />
              </View>
            </React.Fragment>
          )
        }}
      </FirebaseMarkersPlayerLive>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    paddingTop: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%'
  },
  slider: {
    width: '100%',
    height: 18
  },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#BEEA57'
  },
  track: {
    height: 2,
    borderRadius: 2,
    backgroundColor: '#777777'
  }
})

ProgressBar.displayName = 'ProgressBar'

ProgressBar.propTypes = {
  duration: PropTypes.object,
  time: PropTypes.object,
  onSlidingStart: PropTypes.func,
  onSlidingComplete: PropTypes.func,
  thumbStyle: PropTypes.object,
  trackColorTinColor: PropTypes.string,
  matchData: PropTypes.object,
  dvrMinimumValue: PropTypes.number,
  dvrMaximumValue: PropTypes.number,
  isLive: PropTypes.bool
}

ProgressBar.defaultProps = {
  thumbStyle: {},
  trackColorTinColor: '#BEEA57',
  isLive: false,
  dvrMinimumValue: 0
}
export default React.memo(ProgressBar)
