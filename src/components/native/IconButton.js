import React from 'react'
import PropTypes from 'prop-types'
import * as COMPONENTS from '../../components'

const Component = ({image = 'App:images:cross', icon, className, onPress, disabled}) => {
  return (
    <COMPONENTS.View className={className}>
      <COMPONENTS.TouchableOpacity
        disabled={disabled}
        className='flex-1 align-items-center justify-content-center' onPress={onPress}>
        <COMPONENTS.IconTheme {...icon} disabled={disabled}/>
      </COMPONENTS.TouchableOpacity>
    </COMPONENTS.View>
  )
}

Component.propTypes = {
  image: PropTypes.string,
  icon: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func
}

export default Component
