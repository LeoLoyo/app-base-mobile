/**
 * Calculation of VH strings
 */

import { Dimensions } from 'react-native'

const SUFFIX = 'vh'
const DEFAULT_VH = 16
const ABSOLUTE_HEIGHT = Dimensions.get('window').height

export {
  isVh,
  calcVh
}

/**
 * Is string contains vh
 * @param {String} str
 * @returns {Boolean}
 */
function isVh (str) {
  return typeof str === 'string' && str.substr(-SUFFIX.length) === SUFFIX
}

/**
 * Calculate vh to pixels: '1.2vh' => 1.2 * vh
 * @param {String} str
 * @returns {number}
 */
function calcVh (str = DEFAULT_VH) {
  let factor = str.substr(0, str.length - SUFFIX.length)
  let isInvalid = factor === '' ? 1 : parseFloat(factor)
  if (isNaN(isInvalid)) {
    throw new Error('Invalid vh value: ' + str)
  }
  return factor * ABSOLUTE_HEIGHT / 100
}
