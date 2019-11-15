import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import View from '../../../native/View'
import Text from '../../../native/Text'
import IconTheme from '../../../native/IconTheme'

const FormatDate = ({ prop, format = 'HH:mm', locale = 'en' }) => {
  moment.locale(locale)
  return moment(prop).isValid() ? moment(prop).format(format) : new Date()
}

/**
   * Info of a Schedule
   */
const ScheduleInfo = React.memo(({
  time,
  scheduled,
  current,
  boxScheduleInfoProps,
  scheduleInfoIconProps: {
    isScheduledProps,
    isNotScheduledProps,
    playScheduledProps
  },
  scheduleInfoTimeProps,
  scheduleInfoDateProps,
  LoadingComponent

}) => {
  const iconProps = current ? playScheduledProps : scheduled ? isScheduledProps : isNotScheduledProps
  return (
    <View {...boxScheduleInfoProps}>
      {LoadingComponent || <IconTheme {...iconProps} />}
      <Text {...scheduleInfoTimeProps} text={FormatDate({ prop: time })} />
      <Text {...scheduleInfoDateProps} text={FormatDate({ prop: time, format: 'DD/MM' })} />
    </View>
  )
})

ScheduleInfo.displayName = 'ScheduleInfo'

ScheduleInfo.propTypes = {
  time: PropTypes.string,
  date: PropTypes.string,
  scheduled: PropTypes.bool,
  current: PropTypes.bool,
  boxScheduleInfoProps: PropTypes.object,
  scheduleInfoIconProps: PropTypes.shape({
    isScheduledProps: PropTypes.object,
    isNotScheduledProps: PropTypes.object,
    playScheduledProps: PropTypes.object
  }),
  scheduleInfoTimeProps: PropTypes.object,
  scheduleInfoDateProps: PropTypes.object,
  LoadingComponent: PropTypes.any
}

export default ScheduleInfo
