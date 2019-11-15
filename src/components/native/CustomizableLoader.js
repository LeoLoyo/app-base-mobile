import React from 'react'
import {Animated, Easing} from 'react-native'
import withStyle from '../../core/withStyle'
import PropTypes from 'prop-types'

class Component extends React.Component {
  static displayName = 'CustomizableLoader'
  static propTypes = {
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
      PropTypes.number
    ]),
    source: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]).isRequired
  }

  rotationValue = new Animated.Value(0)

  componentDidMount () {
    this.runAnimation()
  }

  runAnimation = () => {
    this.rotationValue.setValue(0)
    Animated
      .timing(this.rotationValue, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear
      })
      .start(() => this.runAnimation())
  }

  getLoaderStyle = () => {
    const rotate = this.rotationValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    return [
      this.props.style,
      {transform: [{rotate}]}
    ]
  }
  render () {
    return (
      <Animated.Image source={this.props.source} style={this.getLoaderStyle()} resizeMode='contain' />
    )
  }
}

export default withStyle(Component)
