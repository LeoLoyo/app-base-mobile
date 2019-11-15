import React from 'react'
import PropTypes from 'prop-types'
import * as COMPONENTS from '../../components'
import KeepAwake from 'react-native-keep-awake'

class Component extends React.Component {
  render () {
    const {className} = this.props
    return (
      <COMPONENTS.View className={className}>
        {this.props.children}
        <KeepAwake />
      </COMPONENTS.View>
    )
  }
}

Component.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ])
}

export default Component
