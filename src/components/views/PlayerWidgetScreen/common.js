import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import _head from 'lodash/head'

/**
 * Check if live or Schedule is purchased.
 *
 * @param {object} live
 */

export const isPurchased = (content = {}) => {
  const { __typename } = content

  if (__typename === 'Media') return content.purchased === 1

  const Live = _head(content) || {}
  const { purchased } = Live
  if (purchased === 1) return true

  if (purchased === -1) {
    const { schedules = [] } = Live
    const currentSchedule = _head(schedules) || {}
    const { purchased: purchasedSchedule } = currentSchedule
    return purchasedSchedule === 1
  }

  return false
}

/**
   * Check is Schedule is a Match.
   *
   * @param {object} schedule
   */

export const isMatch = (content = {}) => {
  const { season = null, match_id: matchId = null, competition = null } = content.opta || {}
  const isMatch = !_isEmpty(season) && !_isEmpty(matchId) && !_isEmpty(competition)
  return isMatch
}

export const propTypesDefault = {
  data: PropTypes.object,
  loading: PropTypes.bool,
  widgetProps: PropTypes.object,
  msgEmpty: PropTypes.string,
  msgNotPurchased: PropTypes.string
}
