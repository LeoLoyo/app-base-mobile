import React from 'react'
import {ConfigContext} from './Config'

const withConfig = (WrappedComponent) => {
  class Component extends React.Component {
    render () {
      return (
        <ConfigContext.Consumer>
          { (ctx) => <WrappedComponent config={ctx} {...this.props}/> }
        </ConfigContext.Consumer>
      )
    }
  }

  Component.propTypes = {}

  return Component
}

export default withConfig
