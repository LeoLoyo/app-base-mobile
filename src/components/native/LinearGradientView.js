import React from 'react'
import PropTypes from 'prop-types'
import LinearGradient from 'react-native-linear-gradient'
import withStyle from '../../core/withStyle'

class LinearGradientView extends React.Component {
  render () {
    const { children, ...props } = this.props
    return (
      <LinearGradient {...props}>
        {children}
      </LinearGradient>
    )
  }
}

LinearGradientView.propTypes = {
  children: PropTypes.any
}

export default withStyle(LinearGradientView)
