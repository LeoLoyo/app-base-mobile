import React from 'react'
import PropTypes from 'prop-types'
const noop = () => null
class Looper extends React.Component {
  state = {
    index: 0
  }

  looper = null

  shouldComponentUpdate (newProps, prevState) {
    return prevState.index !== this.state.index
  }

  componentDidMount () {
    this.loop()
  }

  componentDidUpdate () {
    this.loop()
  }

  componentWillUnmount () {
    clearTimeout(this.looper)
  }

  timeoutHandler = (newIndex) => {
    const {onTickEvent = noop} = this.props
    this.setState({ index: newIndex }, () => {
      typeof onTickEvent === 'function' && onTickEvent(this.state.index)
    })
  }

  dispatchTickEvent = (index) => {
    this.timeoutHandler(typeof index !== 'number' ? 0 : index)
  }

  loop = () => {
    const {timeoutValue = 3000, limit} = this.props
    this.looper && clearTimeout(this.looper)
    this.looper = setTimeout(() => {
      const {index} = this.state
      const newIndex = (index + 1 >= limit ? 0 : index + 1)
      this.timeoutHandler(newIndex)
    }, timeoutValue)
  }

  render () {
    const {children} = this.props
    const {index: looperIndex} = this.state
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child
      return React.cloneElement(child, {extraItemProps: {
        looper: { looperIndex, dispatchTickEvent: this.dispatchTickEvent }}})
    })
  }
}

Looper.propTypes = {
  limit: PropTypes.number,
  timeoutValue: PropTypes.number,
  onTickEvent: PropTypes.func,
  children: PropTypes.any
}

export default Looper
