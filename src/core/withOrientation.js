import React from 'react'
import {isFunction} from 'lodash'
import PropTypes from 'prop-types'
import Orientation from 'react-native-orientation-locker'

const withOrientation = (WrappedComponent) => {
  class Component extends React.Component {
    static propTypes = {
      onOrientationChange: PropTypes.func,
      orientationOnMount: PropTypes.string,
      orientationOnUnmount: PropTypes.string
    }
    static defaultProps = {
      onOrientationChange: () => {}
    }

    _orientationDidChange = (orientation) => this.props.onOrientationChange(orientation)

    componentDidMount () {
      const {orientationOnMount} = this.props
      Orientation.addOrientationListener(this._orientationDidChange)
      if (orientationOnMount && isFunction(Orientation[orientationOnMount])) {
        Orientation[orientationOnMount]()
      }
    }

    componentWillUnmount () {
      const {orientationOnUnmount} = this.props
      Orientation.removeOrientationListener(this._orientationDidChange)
      if (orientationOnUnmount && isFunction(Orientation[orientationOnUnmount])) {
        Orientation[orientationOnUnmount]()
      }
    }

    render () {
      return (
        <WrappedComponent {...this.props} />
      )
    }
  }

  return Component
}

export default withOrientation
