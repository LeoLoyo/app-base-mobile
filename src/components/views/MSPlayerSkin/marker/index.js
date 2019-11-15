import React from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import Image from '../../../native/CachedImage'
import { buildMarkersVod, buildMarkersLive } from './utils'

const Marker = ({ data, live, durationTime, styleContainer, styleMarker, startDvr: startEvent = 0, onPress }) => {
  const dataMarkers = live ? buildMarkersLive({...data, startDvr: startEvent}) : buildMarkersVod(data)
  const _offsetEvent = 60 // error opta marker
  const Markers = (dataMarkers || []).map((marker, index) => {
    const _durationEvent = durationTime - startEvent
    const _positionMarker = ((marker._time - _offsetEvent) - startEvent - (index * 16)) || 0
    const _position = Number(Number((_positionMarker * 100) / _durationEvent).toFixed(2))
    const position = Math.max(0, Math.min(100, _position))
    const onPressCurrentItem = () => onPress((marker._time - _offsetEvent))
    return (
      <TouchableOpacity
        key={index}
        style={{ width: 16, height: 16, zIndex: 99999, position: 'absolute', left: `${position}%` }}
        onPress={onPressCurrentItem}
      >
        <Image source={{ uri: marker.image }} style={{...styles.styleMarker, ...styleMarker}} />
      </TouchableOpacity>
    )
  })
  return (
    <View style={[styleContainer, styles.styleContainer]}>
      {Markers}
    </View>
  )
}

const styles = StyleSheet.create({
  styleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    height: 16
  },
  styleMarker: {
    height: 16,
    width: 16
  }
})

Marker.propTypes = {
  data: PropTypes.shape({
    date_start: PropTypes.string,
    details: PropTypes.array,
    periods: PropTypes.array
  }),
  durationTime: PropTypes.number,
  startDvr: PropTypes.number,
  styleContainer: PropTypes.object,
  styleMarker: PropTypes.object,
  live: PropTypes.bool,
  onPress: PropTypes.func
}

Marker.defaultProps = {
  data: {},
  live: false,
  startDvr: 0,
  styleMarker: {},
  onPress: () => null
}

export default Marker
