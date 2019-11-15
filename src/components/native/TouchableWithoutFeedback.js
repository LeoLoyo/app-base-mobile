import React, { Fragment } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import PropTypes from 'prop-types'
import withStyle from '../../core/withStyle'

class Component extends React.Component {
  render () {
    const { onPress, onPressIn, onPressOut } = this.props
    return (
      <TouchableWithoutFeedback
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Fragment>{this.props.children}</Fragment>
      </TouchableWithoutFeedback>
    )
  }
}

Component.propTypes = {
  children: PropTypes.array,
  onPress: PropTypes.func,
  onPressIn: PropTypes.func,
  onPressOut: PropTypes.func
}

export default withStyle(Component)
