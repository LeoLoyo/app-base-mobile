import React from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'
import styles from './styles'
import { FormatTime } from '../../handlers/props-manager'

function DescriptionTime ({ time, duration }) {
  const { _time } = FormatTime(time.val, { key: '_time' })
  const { _duration } = FormatTime(duration.val, { key: '_duration' })
  return (
    <View style={styles.playerTimeWrapper}>
      <Text style={styles.playerCurrentTime}>{`${_time} / `}</Text>
      <Text style={styles.playerDuration}>{_duration}</Text>
    </View>
  )
}

DescriptionTime.displayName = 'DescriptionTime'

DescriptionTime.propTypes = {
  time: PropTypes.object,
  duration: PropTypes.object
}

export default React.memo(DescriptionTime)
