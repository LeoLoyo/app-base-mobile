import React from 'react'
import PropTypes from 'prop-types'
import { Alert as NativeAlert } from 'react-native'
import { withNavigation } from 'react-navigation'
import withTranslation from '../../../../core/withTranslation'
import { View, Text, IconThemeButton, Image } from '../../../../components'
import { isAuthenticated } from '../../../../core/Auth'
import _get from 'lodash/get'

const buildMatch = (categories, schedules) => {
  return schedules.map(schedule => Object.assign({}, schedule, {
    match: {
      'rival-1': schedule.customJson['rival-1'] ? categories[schedule.customJson['rival-1']] : null,
      'rival-2': schedule.customJson['rival-2'] ? categories[schedule.customJson['rival-2']] : null
    }
  }))
}

const SchedulesMatch = ({
  _id,
  schedules,
  premium,
  freemium,
  purchased,
  className,
  styles,
  liveSignalProps,
  baseCategories,
  navigation,
  authRequiredMessage,
  messageNotSubscribed,
  teamDefault
}) => {
  const {
    classNameContainer,
    classNameOpacity,
    classNameContainerMatch,
    classNameContainRow,
    classNameContainerRival,
    classNameContainerVS,
    classNameBtn,
    classNameBtnPremium,
    classNameIcon,
    classNameIconPremium,
    classNameTextBtn,
    classNameTextBtnPremium
  } = className
  const {
    styleOpacity,
    styleContainer,
    styleContainerText,
    styleImageRival,
    styleTextRival,
    styleTextInLive,
    styleTextVS,
    styleBtn,
    styleIcon
  } = styles
  const {
    opacityTransparent = false,
    link,
    textBtnMatch,
    iconBtn,
    authRequired
  } = liveSignalProps
  const params = { _id: _id }
  const Matches = buildMatch(baseCategories, schedules)
  const { match: { 'rival-1': rival1, 'rival-2': rival2 } } = Matches[0]
  const imageRival1 = _get(rival1, 'image', teamDefault)
  const imageRival2 = _get(rival2, 'image', teamDefault)
  const abbreviationRival1 = _get(rival1, 'customJson.abbreviation', '')
  const abbreviationRival2 = _get(rival2, 'customJson.abbreviation', '')
  let _source1 = String(imageRival1).includes('https') ? imageRival1 : teamDefault
  let _source2 = String(imageRival2).includes('https') ? imageRival2 : teamDefault
  const _classNameIcon = premium ? classNameIconPremium : classNameIcon
  const _classNameBtn = premium ? classNameBtnPremium : classNameBtn
  const _classNameTextBtn = premium ? classNameTextBtnPremium : classNameTextBtn
  return (
    <View className={classNameContainer} style={styleContainer}>
      {opacityTransparent ? <View className={classNameOpacity} style={styleOpacity} /> : null}
      <View className={classNameContainerMatch} style={styleContainerText}>
        <View className={classNameContainRow}>
          <View className={classNameContainerRival}>
            <Image
              source={{ uri: _source1 }}
              style={styleImageRival}
            />
            <Text style={styleTextRival} text={abbreviationRival1} />
          </View>
          <View className={classNameContainerVS}>
            <Text style={styleTextInLive} text={'En Vivo'} />
            <Text style={styleTextVS} text={'V/S'} />
          </View>
          <View className={classNameContainerRival}>
            <Image
              source={{ uri: _source2 }}
              style={styleImageRival}
            />
            <Text style={styleTextRival} text={abbreviationRival2} />
          </View>
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
          textProps={{ className: _classNameTextBtn, text: textBtnMatch }} />
      </View>
    </View>
  )
}

SchedulesMatch.propTypes = {
  _id: PropTypes.string,
  schedules: PropTypes.array,
  authRequiredMessage: PropTypes.string,
  messageNotSubscribed: PropTypes.string,
  className: PropTypes.object,
  styles: PropTypes.object,
  liveSignalProps: PropTypes.object,
  freemium: PropTypes.bool,
  premium: PropTypes.bool,
  purchased: PropTypes.bool,
  navigation: PropTypes.object,
  baseCategories: PropTypes.object,
  teamDefault: PropTypes.string
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

const onPress = async (
  isFreemium = false,
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

export default withNavigation(withTranslation(SchedulesMatch, ['authRequiredMessage', 'messageNotSubscribed']))
