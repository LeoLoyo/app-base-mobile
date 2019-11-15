import React from 'react'
import PropTypes from 'prop-types'
import IconTheme from '../native/IconTheme'
import Link from '../native/Link'
import View from '../native/View'

const NavButton = ({image = 'App:images:cross', icon, className, isBackButton, link, ...props}) => {
  return (
    <View className={className}>
      <Link className='flex-1 align-items-center justify-content-center' isBackButton={isBackButton} link={link}>
        <IconTheme {...icon}/>
      </Link>
    </View>
  )
}

NavButton.propTypes = {
  icon: PropTypes.bool,
  isBackButton: PropTypes.bool,
  link: PropTypes.string,
  containerclassName: PropTypes.string,
  className: PropTypes.string,
  image: PropTypes.string
}

const Component = ({children, backButton, closeButton, className}) => {
  return (
    <View className={className}>
      {children}
      {backButton && <NavButton {...backButton} />}
      {closeButton && <NavButton {...closeButton} />}
    </View>
  )
}

Component.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
  closeButton: PropTypes.object,
  backButton: PropTypes.object,
  onClose: PropTypes.func,
  onBack: PropTypes.func
}

export default Component
