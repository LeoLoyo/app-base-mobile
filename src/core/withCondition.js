import React from 'react'
import {
  isString,
  isUndefined,
  isArray,
  get,
  eq,
  lt,
  lte,
  gt,
  gte,
  includes,
  camelCase,
  isNil
} from 'lodash'

const operators = {
  '=': (field, value) => eq(field, value),
  '!=': (field, value) => !eq(field, value),
  '<': (field, value) => lt(field, value),
  '<=': (field, value) => lte(field, value),
  '>': (field, value) => gt(field, value),
  '>=': (field, value) => gte(field, value),
  'like': (field, value) => includes(field, value),
  '!like': (field, value) => !includes(field, value),
  'defined': (field, value) => !(isUndefined(field) || isNil(field)),
  'undefined': (field, value) => (isUndefined(field) || isNil(field))
}

export const decider = (props, values, defaultValues = [], debug = false) =>
  values.reduce((acc, val, index) => {
    if (!isArray(get(props, val, ''))) {
      acc[val] = get(props, val, undefined)
    } else {
      let {value: resolvedVal} = props[val]
        .map(params => {
          params.resp = (params.if || []).every(condition => {
            if (condition === true) return true
            let {field, path, is, value} = condition
            if (operators[get(condition, 'is', undefined)]) {
              if (isString(path)) {
                field = isArray(field)
                  ? field.map(elem => get(elem, path, elem))
                  : get(field, path, field)
              }
              return operators[is](field, value)
            }
            return false
          })
          return params
        })
        .find(item => item.resp) || {}

      if (isUndefined(resolvedVal)) {
        resolvedVal = get(defaultValues, `[${index}]`, undefined)
      }

      acc[val] = resolvedVal
    }

    return acc
  }, {})

const withCondition = (WrappedComponent, values = ['link'], defaultValues = []) => {
  class Component extends React.Component {
    state = {
      values: {}
    }

    _getOnChangeMethodName = (key) => camelCase(`on ${key} change`) // eg: onValueChange
    _onPropChange = (key, value) => {
      const funcName = this._getOnChangeMethodName(key)
      const func = get(this.props, funcName, () => {})
      func(value) // this is the callback handler, tells to the parent that a props is change
    }

    static getDerivedStateFromProps (nextProps, prevState) {
      const nextValues = decider(nextProps, values, defaultValues)
      return {
        values: nextValues
      }
    }

    componentDidUpdate (prevProps, prevState) {
      Object.keys(this.state.values).forEach(key => {
        if (!eq(this.state.values[key], prevState.values[key])) {
          this._onPropChange(key, this.state.values[key])
        }

        if (get(prevProps,
          this._getOnChangeMethodName(key), undefined) !== get(this.props,
          this._getOnChangeMethodName(key), undefined)) {
          this._onPropChange(key, this.state.values[key])
        }
      })
    }

    render () {
      return (
        <WrappedComponent {...this.props} {...this.state.values}/>
      )
    }
  }

  return Component
}

export default withCondition
