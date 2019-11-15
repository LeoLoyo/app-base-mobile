import React from 'react'
import {ToastContext} from './Toast'

const withToast = (WrappedComponent) => {
  class Component extends React.Component {
    static displayName = 'withToast'
    render () {
      return (
        <ToastContext.Consumer>
          { (ctx) => <WrappedComponent toast={ctx} {...this.props}/> }
        </ToastContext.Consumer>
      )
    }
  }

  Component.propTypes = {}

  return Component
}

export default withToast
