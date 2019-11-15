import React from 'react'
import { withNavigation } from 'react-navigation'
import PropTypes from 'prop-types'
import eq from 'lodash/eq'
import lt from 'lodash/lt'
import lte from 'lodash/lte'
import gt from 'lodash/gt'
import get from 'lodash/get'
import gte from 'lodash/gte'
import includes from 'lodash/includes'
import isString from 'lodash/isString'
import isArray from 'lodash/isArray'
import {isAuthenticated} from '../../core/Auth'

class Component extends React.Component {
  constructor (props) {
    super(props)
    this._iterateScreens(get(props, 'screens', {}))
  }

  _operators = {
    '=': (field, value) => eq(field, value),
    '!=': (field, value) => !eq(field, value),
    '<': (field, value) => lt(field, value),
    '<=': (field, value) => lte(field, value),
    '>': (field, value) => gt(field, value),
    '>=': (field, value) => gte(field, value),
    'like': (field, value) => includes(field, value),
    '!like': (field, value) => !includes(field, value)
  }

  _iterateScreens = async (screens) => {
    const navParams = get(this.props, 'navigation.state.params', {})

    for (let screenName of Object.keys(screens)) {
      const screenValidations = screens[screenName]

      let validationProgress = []
      for (let validation of screenValidations) {
        if (validation === true) {
          validationProgress.push(true)
        } else if (this._operators[get(validation, 'is', undefined)]) {
          let {field, path, is, value} = validation
          field = await Promise.resolve(this[field] || navParams[field])
          if (isString(path)) {
            field = isArray(field)
              ? field.map(elem => get(elem, path, elem))
              : get(field, path, field)
          }
          validationProgress.push(this._operators[is](field, value))
        } else {
          validationProgress.push(false)
        }
      }

      const isValidScreen = validationProgress.every(value => value)

      if (isValidScreen) {
        const {method} = this.props
        const params = {...this.props.navigation.state.params, ...this.props.params} || {}
        this.props.navigation[method || 'navigate'](screenName, params)
        return
      }
    }
  }

  get isAuth () {
    return isAuthenticated()
  }

  isAuth = () => isAuthenticated()

  screenValidators = {
    isAuth: this.isAuth
  }

  // Render any loading content that you like here
  render () {
    return null
  }
}

Component.propTypes = {
  className: PropTypes.string,
  loadingComponentColor: PropTypes.string,
  method: PropTypes.string,
  navigation: PropTypes.object,
  params: PropTypes.object
}

Component.defaultProps = {
  className: 'absolute-fill bg-dark flex-1 align-items-center justify-content-center',
  loadingComponentColor: 'white'
}

export default withNavigation(Component)
