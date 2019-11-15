import React from 'react'
import PropTypes from 'prop-types'
import {UIManager, LayoutAnimation} from 'react-native'

const Animator = (WrappedComponent) => class Animator extends React.Component {
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillUpdate () {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {type: LayoutAnimation.Types.easeInEaseOut}
    })
  }

  render () {
    return <WrappedComponent {...this.props} />
  }
}

export {Animator}

export const Switch = (WrappedComponent) => {
  class Switch extends React.Component {
    static propTypes = {
      onCheck: PropTypes.func,
      onUncheck: PropTypes.func,
      defaultValue: PropTypes.bool,
      checked: PropTypes.bool,
      PropTypes: PropTypes.func,
      onPress: PropTypes.func
    }
    static defaultProps = {
      onPress: () => {},
      onCheck: () => {},
      onUncheck: () => {},
      defaultValue: false
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps (nextProps, nextState) {
      const {onCheck, onUncheck} = nextProps
      const checked = this.checkedValue()
      const nextOpened = this.checkedValue(nextProps, nextState)
      if (checked !== nextOpened) {
        if (nextOpened) {
          onCheck()
        } else {
          onUncheck()
        }
      }
    }

    state = {
      checked: this.props.defaultValue || false
    }

    onButtonPress = () => {
      let {onPress, checked} = this.props
      if (!this.checkedPropIsBoolean()) {
        checked = this.state.checked
        this.setState((prevState) => ({checked: !prevState.checked}))
      }
      onPress(checked)
    }

    check = () => this.setState(() => ({checked: true}))
    uncheck = () => this.setState(() => ({checked: false}))
    toggle = () => this.setState((prevState) => ({checked: !prevState.checked}))
    setCheckState = (checked) => this.setState(() => ({checked}))

    checkedPropIsBoolean = (props = this.props) => typeof props.checked === 'boolean'

    checkedValue = (props = this.props, state = this.state) => {
      let {checked} = props
      if (!this.checkedPropIsBoolean(props)) {
        checked = state.checked
      }
      return checked
    }

    switch = {
      onPress: this.onButtonPress,
      checkedValue: this.checkedValue,
      check: this.check,
      uncheck: this.uncheck,
      toggle: this.toggle,
      setCheckState: this.setCheckState
    }

    render () {
      const {...props} = this.props

      return <WrappedComponent {...props} switchProps={this.switch} />
    }
  }

  Switch.displayName = `WithSwitch(${WrappedComponent.displayName})`
  return Switch
}
