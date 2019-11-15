import React from 'react'
import PropTypes from 'prop-types'
import _isFunction from 'lodash/isFunction'

/**
 * This component is intended to throw actions agree the life cycle of a React Component
 * E.g.:
 * ```yaml
   name: Lifecycle
   props:
    onMount: '{{refetch}}'
    onUnmount: '{{otherFunction}}'
 */

class Lifecycle extends React.Component {
  componentDidMount () {
    _isFunction(this.props.onMount) && this.props.onMount(this.props.params)
  }
  componentDidUpdate (prevProps) {
    _isFunction(this.props.onUpdate) && this.props.onUpdate(this.props.params)
  }

  componentWillUnmount () {
    _isFunction(this.props.onUnmount) && this.props.onUnmount(this.props.params)
  }

  render () {
    return null
  }
}

/**
 * Props
 */
Lifecycle.propTypes = {
  onMount: PropTypes.any,
  onUpdate: PropTypes.any,
  onUnmount: PropTypes.any,
  params: PropTypes.any
}

export default Lifecycle
