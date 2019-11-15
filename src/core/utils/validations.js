/* eslint-disable max-len */
import _get from 'lodash/get'
import _isNil from 'lodash/isNil'
import _isEmpty from 'lodash/isEmpty'

export default {
  email: str => {
    if (_isNil(str)) return true
    // eslint-disable-next-line no-useless-escape
    const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return !pattern.test(String(str).trim())
  },
  required: str => {
    if (_isNil(str)) return true
    return String(str).trim() === ''
  },
  min: (str = '', condition) => {
    if (_get(str, 'length')) {
      return !(_get(str, 'length', 0) >= condition)
    }
    return false
  },
  max: (str = '', condition) => {
    if (_get(str, 'length')) {
      return !(_get(str, 'length', 0) <= condition)
    }
    return false
  },
  equals: (str = '', condition, values) => {
    if (_isEmpty(str) && (_isNil(values, condition) || _isEmpty(values[condition]))) return false
    return _get(values, condition) !== str
  },
  number: str => !/^\d+$/.test(str),
  maxDate: (str, condition) => {
    return true
  }
}
