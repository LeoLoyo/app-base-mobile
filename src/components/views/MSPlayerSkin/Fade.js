import React from 'react'
import PropTypes from 'prop-types'
import { View, Animated } from 'react-native'

export default class Fade extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      mounted: props.visible
    }
  }
  static propTypes = {
    animated: PropTypes.bool,
    visible: PropTypes.bool,
    style: PropTypes.any,
    children: PropTypes.any
  }
  static defaultProps = {
    animated: false
  }

  componentWillMount () {
    this._visibility = new Animated.Value(this.props.visible ? 1 : 0)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.animated) {
      if (nextProps.visible) {
        this.setState(() => ({mounted: true}))
      }
      Animated
        .timing(this._visibility, {toValue: nextProps.visible ? 1 : 0, duration: 300})
        .start(() => this.setState(() => ({mounted: nextProps.visible})))
    }
  }

  render () {
    const {visible, style, children, animated, ...rest} = this.props
    const {mounted} = this.state

    if (!animated) {
      return (
        <View style={style} {...rest} >
          {visible && children}
        </View>
      )
    }

    const containerStyle = {
      opacity: this._visibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
      }),
      transform: [
        {
          scale: this._visibility.interpolate({
            inputRange: [0, 1],
            outputRange: [1.1, 1]
          })
        }
      ]
    }

    const combinedStyle = [containerStyle, style]
    return (
      <Animated.View style={combinedStyle} {...rest}>
        {mounted && children}
      </Animated.View>
    )
  }
}
