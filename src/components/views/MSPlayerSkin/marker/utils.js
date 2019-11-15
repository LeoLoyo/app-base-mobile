import memoize from 'memoize-one'
import moment from 'moment'
import _isEmpty from 'lodash/isEmpty'
import _head from 'lodash/head'

export const buildMarkersVod = memoize(({
  offset = 0,
  match_data: { details: markers = [], periods = [] } = {}
}) => {
  if (_isEmpty(markers) || _isEmpty(periods)) return []

  const fisrPeriod = _head(periods)

  if (!fisrPeriod) return []
  const VOD_START = moment(fisrPeriod.start).subtract(offset, 'minute')

  const _periods = periods.map(period => {
    period.startPeriod = diffFromStart(VOD_START)(period.start)
    return period
  })

  const _markers = markers
    .reduce((acc, event) => {
      const fullPosition = (event.position || []).reduce((acc, marker) => {
        const currentPeriod = _periods.find(
          period => period.id === marker.period
        )

        if (!currentPeriod) {
          return acc
        }
        marker.marker_type = event.marker_type
        marker.image = event.image_url
        switch (String(marker.period)) {
          case '2':
            marker._time =
              currentPeriod.startPeriod + (marker.time - 45) * 60
            break
          case '3':
            marker._time =
              currentPeriod.startPeriod + (marker.time - 90) * 60
            break
          case '4':
            marker._time =
              currentPeriod.startPeriod + (marker.time - 105) * 60
            break
          default:
            marker._time = currentPeriod.startPeriod + marker.time * 60
        }
        return [...acc, marker]
      }, [])
      return [...acc, ...fullPosition]
    }, [])
    .sort((a, b) => a._time - b._time)
  return _markers
})

export const diffFromStart = initialDate => time => {
  const diff = moment.duration(moment(time).diff(initialDate)).asSeconds()
  return parseInt(diff, 10)
}

export const buildMarkersLive = ({
  startDvr = 0,
  date_start: dateStart,
  periods = [],
  details: data = []
}) => {
  if (!dateStart || _isEmpty(data) || _isEmpty(periods)) return []
  const diffTotal = diffFromStart(dateStart)
  const _periods = periods.map(period => {
    period.startPeriod = diffTotal(period.start) + startDvr
    return period
  })
  const details = data
    .reduce((acc, curr) => {
      const fullPosition = (curr.position || []).reduce((acc, current) => {
        const currentPeriod = _periods.find(
          period => period.id === current.period
        )

        if (!currentPeriod) {
          return acc
        }
        current.marker_type = curr.marker_type
        current.image = curr.image_url
        switch (String(current.period)) {
          case '2':
            current._time =
              currentPeriod.startPeriod + (current.time - 45) * 60
            break
          case '3':
            current._time =
              currentPeriod.startPeriod + (current.time - 90) * 60
            break
          case '4':
            current._time =
              currentPeriod.startPeriod + (current.time - 105) * 60
            break
          default:
            current._time = currentPeriod.startPeriod + current.time * 60
        }
        return [...acc, current]
      }, [])
      return [...acc, ...fullPosition]
    }, [])
    .sort((a, b) => a._time - b._time)
  return details
}
