import React from 'react'
import { withNavigationFocus } from 'react-navigation'

const MyScreen = ({children, isFocused}) => {
  return React.Children.map(children,
    (child) => React.cloneElement(child, {isFocused})
  )
}

export default withNavigationFocus(MyScreen)
