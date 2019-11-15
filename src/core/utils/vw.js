/**
 * Calculation of VW strings
 */

import {
  Dimensions
} from 'react-native'

const SUFFIX = 'vw'
const DEFAULT_VW = 16
const ABSOLUTE_WIDTH = Dimensions.get('window').width

export {
  isVw,
  calcVw
}

/**
 * Is string contains vw
 * @param {String} str
 * @returns {Boolean}
 */
function isVw (str) {
  return typeof str === 'string' && str.substr(-SUFFIX.length) === SUFFIX
}

/**
 * Calculate vw to pixels: '1.2vw' => 1.2 * vw
 * @param {String} str
 * @returns {number}
 */
function calcVw (str = DEFAULT_VW) {
  let factor = str.substr(0, str.length - SUFFIX.length)
  let isInvalid = factor === '' ? 1 : parseFloat(factor)
  if (isNaN(isInvalid)) {
    throw new Error('Invalid vw value: ' + str)
  }
  return factor * ABSOLUTE_WIDTH / 100
}
