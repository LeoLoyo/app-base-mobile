import React from 'react'
import PropTypes from 'prop-types'
import _isArray from 'lodash/isArray'
import Storage from '../../core/Storage'

class Component extends React.Component {
  static defaultProps = {
    onPress: () => {}
  }

  onPress = (event) => {
    const {activeClassName, toggleFocus, params, ...props} = this.props
    if (typeof this.props.isActive === 'function') {
      this.props.isActive(this.props.onPressParams || props, params)
    }

    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit()
    }

    if (this.props.isToggler && typeof this.props.onToggle === 'function') {
      this.props.onToggle()
    }

    if (this.props.setContext) {
      this.props._setContext(this.props.setContext)
    }

    if (activeClassName) {
      toggleFocus()
    }

    if (typeof this.props.onPress === 'function') {
      this.props.onPress(this.props.onPressParams || props, params)
    }
  }

  onPressIn = () => {
    const {activeClassName, onPressIn, toggleFocus} = this.props
    if (activeClassName) {
      toggleFocus()
    }

    if (typeof onPressIn === 'function') {
      onPressIn()
    }

    if (Object.keys(this.props).indexOf('setContext:onPressIn') >= 0) {
      this.props._setContext(this.props['setContext:onPressIn'])
    }
  }

  onPressOut = async () => {
    const {activeClassName, onPressOut, toggleFocus} = this.props
    if (activeClassName) {
      toggleFocus()
    }

    if (typeof onPressIn === 'function') {
      onPressOut()
    }

    if (Object.keys(this.props).indexOf('setContext:onPressOut') >= 0) {
      this.props._setContext(this.props['setContext:onPressOut'])
    }

    if (this.props.setStorage) {
      const cb = this.props.debug ? console.warn('save successful') : null
      _isArray(this.props.setStorage) && await Storage.multiSet([this.props.setStorage], () => cb)
    }
  }

  isDisabled = () => {
    const {disabled, loading} = this.props
    if (typeof this.props.isDisabled === 'function') {
      return this.props.isDisabled()
    }
    return loading || disabled
  }

  render () {
    return this.props.render({
      disabled: this.isDisabled(),
      onPress: this.onPress,
      onPressIn: this.onPressIn,
      onPressOut: this.onPressOut
    })
  }
}

Component.propTypes = {
  activeClassName: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  debug: PropTypes.bool,
  handlePress: PropTypes.func,
  isActive: PropTypes.bool,
  isToggler: PropTypes.bool,
  isDisabled: PropTypes.func,
  onPress: PropTypes.func,
  onPressIn: PropTypes.func,
  onPressOut: PropTypes.func,
  onToggle: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  toggleFocus: PropTypes.func,
  onSubmit: PropTypes.func,
  LoadingComponent: PropTypes.string,
  setContext: PropTypes.object,
  setStorage: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  _setContext: PropTypes.func,
  params: PropTypes.object,
  render: PropTypes.func,
  onPressParams: PropTypes.object,
  'setContext:onPressIn': PropTypes.object,
  'setContext:onPressOut': PropTypes.object
}

Component.defaultProps = {
  disabled: false,
  loading: false,
  params: {},
  setStorage: false,
  debug: false
}

export default Component
