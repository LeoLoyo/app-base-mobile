import React from 'react'
import PropTypes from 'prop-types'
import {Image, TouchableOpacity} from 'react-native'

/**
 * ButtonHeaderRightComponent
 */

export default function ButtonHeaderRightComponent ({ widgetModalRef }) {
  return widgetModalRef.current ? (
    <TouchableOpacity onPress={widgetModalRef.current.open}>
      <Image source={require('./bar_chart.png')} style={{ width: 35, height: 35 }}/>
    </TouchableOpacity>
  ) : null
}

ButtonHeaderRightComponent.propTypes = {
  widgetModalRef: PropTypes.object
}

ButtonHeaderRightComponent.defaultProps = {
  widgetModalRef: {
    current: {
      open: () => null
    }
  }
}
