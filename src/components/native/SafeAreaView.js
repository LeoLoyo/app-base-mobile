import React from 'react'
import {SafeAreaView} from 'react-native'
import PropTypes from 'prop-types'
import withStyle from '../../core/withStyle'

class Component extends React.Component {
  render () {
    return (
      <SafeAreaView {...this.props}>
        {this.props.children}
      </SafeAreaView>
    )
  }
}

Component.propTypes = {
  children: PropTypes.array
}

export default withStyle(Component)
