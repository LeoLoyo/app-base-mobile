import React from 'react'
import PropTypes from 'prop-types'
import withTimeLimit from '../../core/withTimeLimit'

class Component extends React.Component {
  static displayName = 'TimeLimitView'

  componentDidMount () {
    if (this.props.action === 'start') {
      this.start()
    }

    if (this.props.action === 'stop') {
      this.start()
    }
  }

  start = () => {
    const {settings} = this.props
    this.props.timeLimit.start({settings})
  }

  stop = () => {
    const {settings} = this.props
    this.props.timeLimit.stop({settings})
  }
  render () {
    return React.Children.map(this.props.children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {timeLimitSettings: this.props.timeLimit})
      }
      return child
    })
  }
}

Component.propTypes = {
  action: PropTypes.any,
  timeLimit: PropTypes.object,
  children: PropTypes.any,
  settings: PropTypes.any
}

export default withTimeLimit(Component)
