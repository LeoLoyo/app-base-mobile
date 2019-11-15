import React from 'react'
import {AppComponentsContext} from './AppComponents'

const withAppComponents = (WrappedComponent) => {
  class Component extends React.PureComponent {
    static displayName = 'withAppComponents'
    render () {
      return (
        <AppComponentsContext.Consumer>
          { (ctx) => <WrappedComponent appComponents={ctx} {...this.props}/> }
        </AppComponentsContext.Consumer>
      )
    }
  }

  Component.propTypes = {}

  return Component
}

export default withAppComponents
