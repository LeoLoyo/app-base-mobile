import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class Component extends React.PureComponent {
  render () {
    return (<Icon {...this.props} />)
  }
}

Component.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.number
}
