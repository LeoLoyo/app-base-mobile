import React from 'react'
import PropTypes from 'prop-types'
import {PortalContext} from '../../core/Portal'

function Portal (props) {
  return (
    <PortalContext.Consumer>
      { ({portal}) => React.Children.map(props.children,
        (child) => React.isValidElement(child) ? React.cloneElement(child, {portal}) : child) }
    </PortalContext.Consumer>
  )
}

Portal.propTypes = {
  children: PropTypes.any
}

export default Portal
