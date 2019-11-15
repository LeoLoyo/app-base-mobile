import React from 'react'
import PropTypes from 'prop-types'
import { View as NativeView, Text as NativeText, StyleSheet } from 'react-native'
import moment from 'moment'
import _has from 'lodash/has'
import { View, Rate } from '../..'

const stylesDefault = StyleSheet.create({
  footerContainer: {
    backgroundColor: 'white',
    padding: 10
  },
  titleStyle: {
    fontSize: 20,
    marginBottom: 8
  },
  descriptionStyle: {
    fontSize: 14
  },
  timeStyle: {
    fontSize: 12
  },
  rateStyle: {
    fontSize: 18,
    marginRight: 2
  }
})

const Footer = (props) => {
  const { data, styles, hasRate = false, ratedColor, unratedColor } = props
  return (
    <NativeView style={[stylesDefault.footerContainer, styles.footerContainer]}>
      <NativeText
        style={[stylesDefault.titleStyle, styles.titleStyle]}
        numberOfLines={1}>{data.title}</NativeText>
      <NativeText
        style={[stylesDefault.descriptionStyle, styles.descriptionStyle]}
        numberOfLines={1}>{String(data.description).length ? data.description : ' '}</NativeText>
      <View className="flex-row justify-content-flex-start align-items-center">
        {hasRate && (<Rate rate={data.rate} media={data._id} icon='star'
          iconStyle={stylesDefault.rateStyle}
          ratedColor={ratedColor} unratedColor={unratedColor} />)}
        {data.date_recorded && (<NativeText
          style={[stylesDefault.timeStyle, styles.timeStyle]}
          numberOfLines={1}>{moment(data.date_recorded).locale('es').fromNow()}</NativeText>)}
        {_has(data, 'live.name') && (<NativeText
          style={[stylesDefault.timeStyle, styles.timeStyle]}
          numberOfLines={1}> - {data.live.name}</NativeText>)}
      </View>
    </NativeView>
  )
}

Footer.propTypes = {
  data: PropTypes.object,
  styles: PropTypes.object,
  hasRate: PropTypes.bool,
  ratedColor: PropTypes.string,
  unratedColor: PropTypes.string
}

Footer.defaultProps = {
  ratedColor: '#FFD800',
  unratedColor: '#707070'
}

export default Footer
