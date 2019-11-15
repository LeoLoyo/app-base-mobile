import React from 'react'
import PropTypes from 'prop-types'
import View from '../native/View'
import withNetwork from '../../core/withNetwork'

const _renderChild = (children, isConnected) => {
  const childProps = {
    isConnected
  }
  return React.Children.map(children, child => React.cloneElement(child, childProps))
}

function ViewWithNetwork ({ children, isConnected }) {
  return (<View>{_renderChild(children, isConnected)}</View>)
}

ViewWithNetwork.propTypes = {
  children: PropTypes.any,
  isConnected: PropTypes.bool
}

export default withNetwork(ViewWithNetwork)
