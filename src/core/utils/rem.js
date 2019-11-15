/**
 * Calculation of REM strings
 */

const SUFFIX = 'rem'
const DEFAULT_REM = 16

export {
  isRem,
  calcRem
}

/**
 * Is string contains rem
 * @param {String} str
 * @returns {Boolean}
 */
function isRem (str) {
  return typeof str === 'string' && str.substr(-SUFFIX.length) === SUFFIX
}

/**
 * Calculate rem to pixels: '1.2rem' => 1.2 * rem
 * @param {String} str
 * @param {Number} rem
 * @returns {number}
 */
function calcRem (str, rem = DEFAULT_REM) {
  let koefStr = str.substr(0, str.length - SUFFIX.length)
  let koef = koefStr === '' ? 1 : parseFloat(koefStr)
  if (isNaN(koef)) {
    throw new Error('Invalid rem value: ' + str)
  }
  return rem * koef
}
