import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import each from 'lodash/each'
import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
import isUndefined from 'lodash/isUndefined'
import merge from 'lodash/merge'
import {deepMap} from '../../core/utils/map'
import * as PropsFilters from '../handlers/props-manager'
import * as COMPONENTS from '../../components'

const replaceMatch = (expression, mutatorFn, noMatchFn) => {
  const pattern = /.\{\{(.{1,}?)\}\}/g
  const patternWithDot = /\{\{(.{1,}?)\}\}/g
  const defaultReplacer = (_, match) => match.toUpperCase()
  const replacer = typeof mutatorFn === 'function' ? mutatorFn : defaultReplacer
  if (!pattern.test(expression)) return noMatchFn(expression) // applies when {{data}}
  return String(expression).replace(patternWithDot, replacer) // applies when a value has the format 'text {{variableA}} {{variableB}} text'
}

class PropsManager extends React.Component {
  static displayName = 'PropsManager'
  static propTypes = {
    children: PropTypes.node.isRequired,
    context: PropTypes.object,
    prevContextElement: PropTypes.any,
    propsFilters: PropTypes.array
  }

  state = {
    filteredValues: {},
    context: {},
    hasOwnContext: false
  }

  constructor (props) {
    super(props)
    this.state.hasOwnContext = !!props.context
    Object.assign(this.state.context, props.context || {})
  }

  _setContext = (newContext) => {
    return this.state.hasOwnContext
      ? this.setState({context: Object.assign(this.state.context, newContext)})
      : this.props.prevContextElement && this.props.prevContextElement._setContext(newContext)
  }

  _getContext = () => {
    return this.state.hasOwnContext
      ? this.state.context
      : this.props.prevContextElement && this.props.prevContextElement._getContext()
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!isObject(nextProps.propsFilters)) return null
    let filteredValues = {}

    each(nextProps.propsFilters, ({path, handler, params}) => {
      const filter = PropsFilters[handler]
      if (!filter) {
        console.warn(`Propfilter: ${handler} does not exists`)
        return
      }
      const managerData = merge({}, nextProps, prevState, filteredValues)
      filteredValues = {
        ...filteredValues,
        ...filter(get(managerData, path, undefined), params, {...nextProps, ...filteredValues})}
    })
    return {filteredValues}
  }

  _isTruthy = (prop) => {
    if ((isArray(prop) && prop.length === 0) || isUndefined(prop)) return undefined
    return prop
  }

  _propMatchBeta (val) {
    const props = Object.assign({},
      this.props, {
        context: this._getContext(), _setContext: this._setContext, _getContext: this._getContext})

    const reducePropValue = (match) =>
      match.split(',').reduce((acc, currentMatch) => {
        const [path, defaultPath] = String(currentMatch).trim().split(':')
        const pathProp = get(props, path, get(this.state.filteredValues, path, undefined))
        const truthyPathProp = this._isTruthy(pathProp)
        const prop = defaultPath
          ? truthyPathProp
            ? this._propMatchBeta(defaultPath)
            : undefined
          : truthyPathProp
        return acc || prop
      }, undefined)

    const prop = replaceMatch(
      val,
      (_, match) => reducePropValue(match), // applies when a value has the format 'text {{variableA}} {{variableB}} text'
      val => {
        const matchArray = String(val).match(/.*?{{(.+)}}.*?/)
        const match =
          matchArray && matchArray.length >= 2 ? matchArray[1] : null
        if (!match) return val
        return reducePropValue(match)
      }
    )
    return prop
  }

  _renderChildren = (children) => {
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child

      const childProps = deepMap(child.props, (val) => {
        if (!isString(val)) return val
        return this._propMatchBeta(val)
      }, ['children'])

      childProps.prevContextElement = this.state.hasOwnContext ? this : this.props.prevContextElement

      if (Object.keys(childProps).length > 0) {
        child = React.cloneElement(child, childProps)
      }

      if (child.type.displayName === PropsManager.displayName) return child
      if (child.type === COMPONENTS.Query) return child
      if (child.type === COMPONENTS.NavigationManager) return child
      if (child.type === COMPONENTS.SearchQueryView) return child
      if (child.type === COMPONENTS.PropsManager) return child
      if (child.type === COMPONENTS.ConditionalProps) return child
      if (child.type === COMPONENTS.OSEspecificProps) return child
      return React.cloneElement(child, {
        children: child.props.children ? this._renderChildren(child.props.children) : null,
        _setContext: this._setContext,
        _getContext: this._getContext
      })
    })
  }

  render () {
    return this._renderChildren(this.props.children)
  }
}

export default PropsManager
