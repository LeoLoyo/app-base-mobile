import React from 'react'
import PropTypes from 'prop-types'
import { Alert as NativeAlert } from 'react-native'
import { withNavigation } from 'react-navigation'
import { View, Text, IconThemeButton } from '../../../../components'
import { isAuthenticated } from '../../../../core/Auth'
import withTranslation from '../../../../core/withTranslation'

const LiveSignal = ({
  _id,
  name,
  className,
  authRequiredMessage,
  messageNotSubscribed,
  styles,
  liveSignalProps,
  freemium,
  navigation,
  purchased,
  premium
}) => {
  const {
    classNameContainer,
    classNameOpacity,
    classNameContainerText,
    classNameText,
    classNameBtn,
    classNameIcon,
    classNameTextBtn,
    classNameBtnPremium,
    classNameIconPremium,
    classNameTextBtnPremium
  } = className
  const { styleOpacity, styleContainer, styleContainerText, styleText, styleBtn, styleIcon } = styles
  const {
    opacityTransparent = false,
    link,
    textBtn,
    iconBtn,
    authRequired } = liveSignalProps
  const params = { _id: _id }
  const _classNameIcon = premium ? classNameIconPremium : classNameIcon
  const _classNameBtn = premium ? classNameBtnPremium : classNameBtn
  const _classNameTextBtn = premium ? classNameTextBtnPremium : classNameTextBtn
  return (
    <View className={classNameContainer} style={styleContainer}>
      {opacityTransparent ? <View className={classNameOpacity} style={styleOpacity} /> : null}
      <View className={'justify-content-center align-items-center'} style={styleContainerText}>
        <View className={classNameContainerText} >
          <Text numberOfLines={2} className={classNameText} style={styleText} text={name} />
        </View>
        <IconThemeButton
          icon={iconBtn}
          iconStyle={styleIcon}
          iconClassName={_classNameIcon}
          onPress={() => onPress(freemium,
            link,
            navigation,
            params,
            purchased,
            authRequired,
            messageNotSubscribed,
            authRequiredMessage)}
          style={styleBtn}
          className={_classNameBtn}
          textProps={{ className: _classNameTextBtn, text: textBtn }} />
      </View>
    </View>
  )
}
LiveSignal.propTypes = {
  authRequiredMessage: PropTypes.string,
  messageNotSubscribed: PropTypes.string,
  _id: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.object,
  styles: PropTypes.object,
  liveSignalProps: PropTypes.object,
  freemium: PropTypes.bool,
  premium: PropTypes.bool,
  purchased: PropTypes.bool,
  navigation: PropTypes.object
}

const launchAlert = (message) => {
  return NativeAlert.alert(
    '',
    message,
    [
      {
        text: 'OK',
        style: 'OK'
      }
    ]
  )
}

const onPress = async (isFreemium = false,
  link,
  navigation,
  params,
  purchased = false,
  authRequired,
  messageNotSubscribed,
  authRequiredMessage = '') => {
  try {
    if (authRequired) {
      const isAuth = await isAuthenticated()
      if (!isAuth) return launchAlert(authRequiredMessage)
    }
    const hasAccess = (purchased || isFreemium)
    hasAccess
      ? navigation.navigate(link, params)
      : launchAlert(messageNotSubscribed)
  } catch (error) {
    console.warn('onPress error: ', error)
  }
}

export default withNavigation(withTranslation(LiveSignal, ['authRequiredMessage', 'messageNotSubscribed']))
