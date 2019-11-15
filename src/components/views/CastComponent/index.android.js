import React from 'react'
import PropTypes from 'prop-types'

class CastComponent extends React.Component {
  render () {
    return this.props.children
  }
}

CastComponent.propTypes = {
  children: PropTypes.any
}

export default CastComponent
