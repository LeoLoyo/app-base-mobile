
/**
 * Libraries
 */
import React from 'react'
import PropTypes from 'prop-types'

/**
 * Main component
 *
 */
export default function (WrappedComponent) {
  /**
   * Main component
   */
  class Component extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        active: false,
        force: false
      }
      this.toggleFocus = this.toggleFocus.bind(this)
    }

    toggleFocus () {
      if (this.props.activeClassName) {
        this.setState({force: !this.state.force})
      }
    }

    render () {
      const {force} = this.state
      const {isActive} = this.props
      const {activeClassName, className} = this.props
      return <WrappedComponent
        {...this.props}
        toggleFocus={this.toggleFocus}
        className={isActive || force ? `${className} ${activeClassName}` : className}
      />
    }
  }

  /**
   * Props
   */
  Component.propTypes = {
    activeClassName: PropTypes.string,
    className: PropTypes.string,
    isActive: PropTypes.bool
  }

  Component.defaultProps = {
    isActive: false
  }

  return Component
}
