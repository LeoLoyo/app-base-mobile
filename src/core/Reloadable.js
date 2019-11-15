import React, { Component } from 'react'
import _get from 'lodash/get'
import _isArray from 'lodash/isArray'

const reloadable = (WrappedComponent, prop = 'current') => {
  class Reloadable extends Component {
    state = {reload: false}
    isUnmounted = false

    _reload = () => {
      if (!this.isUnmounted) {
        this.setState(
          () => ({reload: true}),
          () => {
            if (!this.isUnmounted) this.setState(() => ({reload: false}))
          }
        )
      }
    }

    componentWillUnmount () {
      this.isUnmounted = true
    }

    componentDidUpdate (prevProps) {
      if (!_isArray(prop)) {
        if (_get(prevProps, prop, undefined) !== _get(this.props, prop, undefined)) return this._reload()
        return
      }
      for (let currentProp of prop) {
        if (_get(prevProps, currentProp, undefined) !== _get(this.props, currentProp, undefined) && this._reload) {
          this._reload()
        }
      }
    }

    render () {
      return this.state.reload ? null : <WrappedComponent {...this.props} />
    }
  }

  return Reloadable
}

export default reloadable
