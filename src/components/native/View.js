import React from 'react'
import {View} from 'react-native'
import PropTypes from 'prop-types'
import withStyle from '../../core/withStyle'

class Component extends React.Component {
  static displayName = 'View'
  render () {
    return (
      <View {...this.props}>{this.props.children}</View>
    )
  }
}

Component.propTypes = {
  children: PropTypes.any
}

export default withStyle(Component)
