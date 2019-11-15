import React from 'react'
import PropTypes from 'prop-types'

export default (WrappedComponent) => class Switch extends React.Component {
  static defaultProps = {
    onPress: () => {},
    onCheck: () => {},
    onUncheck: () => {},
    defaultValue: false
  }

  static propTypes = {
    onPress: PropTypes.func,
    onCheck: PropTypes.func,
    onUncheck: PropTypes.func,
    defaultValue: PropTypes.bool,
    checked: PropTypes.bool
  }

  state = {
    checked: this.props.defaultValue || false
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const {onCheck, onUncheck} = nextProps
    const checked = this.checkedValue()
    const nextOpened = this.checkedValue(nextProps, prevState)
    if (checked !== nextOpened) {
      if (nextOpened) {
        onCheck()
      } else {
        onUncheck()
      }
    }
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
