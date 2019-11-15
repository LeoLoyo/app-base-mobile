import React from 'react'
import PropTypes from 'prop-types'
import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import { View, Text, ImageBackground } from '../../../../components'
import LiveSignalNavigation from './LiveSignalComponent'
import SchedulesMatch from './SchedulesMatch'

const ItemComponent = ({
  item,
  styles,
  classNames,
  liveSignalProps,
  imageBackgroundDefault,
  baseCategories,
  teamDefault
}) => {
  const { name, schedules, _id } = item
  const { containerItem, textTab, stylesLiveSignal, stylesMatchSignal } = styles
  const {
    classNameTab,
    classNameTabText,
    classNameLiveSignal,
    classNameMatchSignal,
    classNameTabPremium,
    classNameTabTextPremium
  } = classNames
  let _source = {
    uri: _get(schedules, '0.customJson.backgroundimagelive', false)
  }
  if (!_source.uri) {
    _source = imageBackgroundDefault
  }
  // Checking if the user has a purchase or suscription
  const isLivePurchased = (!_isEmpty(item) && _get(item, 'purchased') === 1)
  const isMatch = (!_isEmpty(schedules) && _get(schedules, '0.customJson.rival-1', false))
  const isSchedulePurchased = (!_isEmpty(schedules) && _get(schedules, '0.purchased') === 1)
  const isPurchased = (isLivePurchased || isSchedulePurchased)
  const premium = _get(item, 'customJson.premium', false)
  const _classNameTab = premium ? classNameTabPremium : classNameTab
  const _classNameTabText = premium ? classNameTabTextPremium : classNameTabText
  return (
    <ImageBackground
      source={_source}
      style={containerItem}>
      <View className={_classNameTab}>
        <Text style={textTab} className={_classNameTabText} text={name} />
      </View>
      {!isMatch
        ? <LiveSignalNavigation
          _id={_id}
          premium={premium}
          name={_get(schedules, '0.name', null)}
          freemium={_get(schedules, '0.customJson.freemium', false)}
          purchased={isPurchased}
          className={classNameLiveSignal}
          styles={stylesLiveSignal}
          liveSignalProps={liveSignalProps}
          authRequiredMessage={liveSignalProps.authRequiredMessage}
          messageNotSubscribed={liveSignalProps.messageNotSubscribed} />
        : <SchedulesMatch
          _id={_id}
          premium={premium}
          freemium={_get(schedules, '0.customJson.freemium', false)}
          schedules={schedules}
          purchased={isPurchased}
          className={classNameMatchSignal}
          styles={stylesMatchSignal}
          liveSignalProps={liveSignalProps}
          baseCategories={baseCategories}
          teamDefault={teamDefault}
          authRequiredMessage={liveSignalProps.authRequiredMessage}
          messageNotSubscribed={liveSignalProps.messageNotSubscribed} />
      }
    </ImageBackground>
  )
}

ItemComponent.propTypes = {
  item: PropTypes.object,
  styles: PropTypes.object,
  classNames: PropTypes.object,
  liveSignalProps: PropTypes.object,
  imageBackgroundDefault: PropTypes.object,
  baseCategories: PropTypes.object,
  teamDefault: PropTypes.string
}

export default ItemComponent
