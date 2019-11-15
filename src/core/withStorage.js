/**
 * Libraries
 */
import React from 'react'
import unset from 'lodash/unset'
import isNil from 'lodash/isNil'
import pickBy from 'lodash/pickBy'
import PropTypes from 'prop-types'

/**
 * Components
 */
import {getFromStorage, setToStorage, removeFromStorage} from './Auth'
/**
 * Main component
 *
 */
export default function (WrappedComponent) {
  /**
   * Main component
   */

  class Component extends React.Component {
    static defaultProps = {
      shouldRestore: false
    }
    state = {
      storage: {},
      renderReady: false
    }

    async componentDidMount () {
      const {name, shouldRestore} = this.props
      let storage = {}

      if (shouldRestore) {
        try {
          storage = await Promise.resolve(getFromStorage(name))
          storage = isNil(storage) ? {} : JSON.parse(storage)
        } catch (e) {
          console.error(e)
        }
      }

      this.setState({storage, renderReady: true})
    }

    storageSave = (data = {}) => {
      const {name} = this.props
      const storage = pickBy(Object.assign({}, this.state.storage, data), val => !isNil(val))
      this.setState({storage})
      return setToStorage(name, JSON.stringify(storage))
    }

    storageCleanKey = (key) => {
      let {storage} = this.state
      const {name} = this.props
      unset(storage, key)
      this.setState({storage})
      return setToStorage(name, JSON.stringify(storage))
    }

    storageClean = () => {
      const {name} = this.props
      return removeFromStorage(name)
    }

    render () {
      const {storage, renderReady} = this.state
      return (
        renderReady ? <WrappedComponent
          storage={storage}
          storageSave={this.storageSave}
          storageClean={this.storageClean}
          storageCleanKey={this.storageCleanKey}
          ref={this.props.innerRef}
          {...this.props}
        /> : null
      )
    }
  }

  /**
   * Props
   */
  Component.propTypes = {
    innerRef: PropTypes.func,
    name: PropTypes.string,
    shouldRestore: PropTypes.bool
  }

  return Component
}
