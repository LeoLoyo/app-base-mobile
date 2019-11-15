import React from 'react'
import PropTypes from 'prop-types'
import withCondition from '../../core/withCondition'

class Component extends React.Component {
  render () {
    return this.props.shouldRender ? this.props.children[0] : this.props.children[1]
  }
}

Component.propTypes = {
  shouldRender: PropTypes.bool,
  children: PropTypes.node
}

Component.defaultProps = {
  shouldRender: false
}

export default withCondition(Component, ['shouldRender'])
