
import {reduce, get, eq, lt, lte, gt, gte, includes} from 'lodash'

const operators = {
  '=': (field, value) => eq(field, value),
  '!=': (field, value) => !eq(field, value),
  '<': (field, value) => lt(field, value),
  '<=': (field, value) => lte(field, value),
  '>': (field, value) => gt(field, value),
  '>=': (field, value) => gte(field, value),
  'like': (field, value) => includes(field, value),
  '!like': (field, value) => !includes(field, value)
}

const Conditional = (prop, {key = 'conditional', props: conditionalProps}, props) => {
  const values = reduce(conditionalProps, (acc, {condition, value, defaultValue = ''}, propKey) => {
    const resp = (condition || []).every(conditional => {
      if (condition === true) return true
      let {field, is, value} = conditional
      if (operators[get(conditional, 'is', undefined)]) {
        return operators[is](get(props, field), get(props, value))
      }
      return false
    })
    return {
      [propKey]: resp ? value : defaultValue
    }
  }, {})
  return values
}
export {
  Conditional
}
