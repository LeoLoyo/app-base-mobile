
/**
 * Libraries
 */
import React from 'react'
import PropTypes from 'prop-types'
import {isArray, reduce, negate, get} from 'lodash'
import Storage from '../core/Storage'
const PortalContext = React.createContext({})

class PortalProvider extends React.Component {
  state = {}

  _getState = () => {
    return this.state
  }

  _getStateValue = (key) => get(this.state, key, false)

  _reduceNewState = (key, value) => {
    let pieceOfState = {[key]: value}
    if (isArray(value) && key === 'toggle') {
      reduce(value, (acc, current, index) =>
        Object.assign(acc,
          {[current]: negate(this._getStateValue)(current)}),
      pieceOfState)
    }
    return pieceOfState
  }

  _setState = (params) => {
    const newState = reduce(params, (acc, param, key) =>
      Object.assign(acc, this._reduceNewState(key, param)),
    this.state)
    this.setState(newState)
  }
  componentDidMount () {
    this._loadFromStorage()
  }

  _loadFromStorage = async () => {
    try {
      const { config: { loadFromStorage = {} } } = this.props
      if (loadFromStorage.showKeys) console.warn(await Storage.getAllKeys())
      if (loadFromStorage.rehydrateContext && loadFromStorage.keys) {
        loadFromStorage.keys.forEach(async ({ name, alias, parse = false }) => {
          if (name) {
            const tempKey = await Storage.getItem(name)
            const data = { [alias || name]: parse ? JSON.parse(tempKey) : tempKey }
            this.setState({ ...data })
          }
        })
      }
    } catch (error) {
      console.error('LoadFromStorage Error: ', error)
    }
  }

  render () {
    return (
      <PortalContext.Provider value={{portal: {...this.state, get: () => this._getState(), set: this._setState}}}>
        {this.props.children}
      </PortalContext.Provider>
    )
  }
}

/**
 * Props
 */
PortalProvider.propTypes = {
  children: PropTypes.any,
  config: PropTypes.object
}

export { PortalProvider, PortalContext }
