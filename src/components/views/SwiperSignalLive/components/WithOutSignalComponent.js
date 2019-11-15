import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, IconTheme, ImageBackground } from '../../../../components'

const WithOutSignal = ({ className, styles, liveSignalProps, containerStyle, imageWithOutSignal }) => {
  const {
    classNameLiveSignal: {
      classNameContainer
    },
    classNameWithOutSignal: {
      classNameSubTitle,
      classNameTitle,
      classNameContainerIcon
    }
  } = className
  const {
    stylesLiveSignal: {
      containerItem
    },
    stylesWithOutSignal: {
      stylesTitle,
      stylesSubTitle,
      styleContainerIcon,
      styleIcon
    }
  } = styles
  const { titleWithOutSignal, subTitleWithOutSignal, iconWithOutSignal } = liveSignalProps
  return (
    <View style={containerStyle} >
      <ImageBackground
        source={imageWithOutSignal}
        style={containerItem}>
        <View className={classNameContainer}>
          <View className={classNameContainerIcon} style={styleContainerIcon}>
            <IconTheme
              style={styleIcon}
              icon={iconWithOutSignal} />
          </View>
          <Text className={classNameTitle} style={stylesTitle} text={titleWithOutSignal} />
          <Text className={classNameSubTitle} style={stylesSubTitle} text={subTitleWithOutSignal} />
        </View>
      </ImageBackground>
    </View>
  )
}

WithOutSignal.propTypes = {
  name: PropTypes.string,
  className: PropTypes.object,
  styles: PropTypes.object,
  liveSignalProps: PropTypes.object,
  containerStyle: PropTypes.object,
  imageWithOutSignal: PropTypes.object
}

export default WithOutSignal
