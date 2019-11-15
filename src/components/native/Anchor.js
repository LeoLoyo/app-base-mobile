
import React from 'react'
import PropTypes from 'prop-types'
import withNavigation from '../../core/withNavigation'
import Button from './Button'

function Anchor ({ children, navigateTo, ...props }) {
  return (
    <Button {...props} onPress={navigateTo}>
      {children}
    </Button>
  )
}
Anchor.propTypes = {
  children: PropTypes.any,
  navigateTo: PropTypes.func
}

export default withNavigation(Anchor)
