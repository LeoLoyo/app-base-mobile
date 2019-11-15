
import React from 'react'
import {UIManager, LayoutAnimation, Platform} from 'react-native'

export default (WrappedComponent) => class AnimatedComponent extends React.Component {
  constructor (props) {
    super(props)
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
    }
  }

  componentDidUpdate () {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {type: LayoutAnimation.Types.easeInEaseOut}
    })
  }

  render () {
    return <WrappedComponent {...this.props} />
  }
}
