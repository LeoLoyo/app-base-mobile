import _get from 'lodash/get'
import _isNumber from 'lodash/isNumber'
import _isArray from 'lodash/isArray'

const Substraction = (number, { key = 'substraction', factor = 0, abs = false }, props) => {
  const factorN = _isNumber(factor) ? factor : _get(props, factor, 0)
  const operation = (_isNumber(number) ? (number - factorN) : factorN)
  return {
    [key]: String(abs ? Math.abs(operation) : operation)
  }
}

const Abs = (number, { key = 'abs', factor = 0, abs = false }) => {
  const operation = (_isNumber(number) ? (number - factor) : factor)
  return {
    [key]: String(abs ? Math.abs(operation) : operation)
  }
}

const Mod = (number, { key = 'mod', value }) => {
  return {
    [key]: _isNumber(number) && _isNumber(value) ? ((number) % value === 0) : null
  }
}

const Division = (number, { key = 'quotient', divisor = 1, base }, props) => {
  if (!_isNumber(number) || !_isNumber(divisor)) return null

  const baseValue = _get(props, base, false)

  if (_isNumber(baseValue)) {
    return { [key]: parseFloat(((number * divisor) / baseValue).toFixed(4)) }
  }

  return { [key]: parseFloat((number / divisor).toFixed(4)) }
}

const Addition = (number, { key = 'addition', numbers = [] }) => {
  return {
    [key]: _isArray(numbers) ? numbers.reduce((prev, curr) => prev + curr, number) : null
  }
}

const ParseInt = (number = 0, { key }) => {
  return {
    [key]: parseInt(number)
  }
}

export {
  Substraction,
  Abs,
  ParseInt,
  Addition,
  Mod,
  Division
}
