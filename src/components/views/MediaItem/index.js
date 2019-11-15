import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, View as NativeView, StyleSheet, Text as NativeText } from 'react-native'
import _isEqual from 'lodash/isEqual'
import _isEmpty from 'lodash/isEmpty'
import _merge from 'lodash/merge'
import _get from 'lodash/get'
import moment from 'moment'

import { FormatTime } from '../../handlers/props-manager'
import { View, IconTheme, FavoriteButton, IconThemeButton, Text, Image } from '../..'
import FooterMediaItem from './Footer'

class MediaItem extends React.Component {
  static propTypes = {
    styles: PropTypes.object,
    data: PropTypes.object.isRequired,
    onPress: PropTypes.func,
    pathImage: PropTypes.string,
    imageBackgroundDefault: PropTypes.object.isRequired,
    imageDefault: PropTypes.object,
    customImageMatch: PropTypes.object,
    favoriteButtonProps: PropTypes.object,
    scheduleRightLabelProps: PropTypes.object,
    hasLabelLeft: PropTypes.bool,
    labelIndex: PropTypes.bool,
    indexCollection: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool
  }

  static defaultProps = {
    styles: {},
    pathImage: 'thumbnails.default.url',
    favoriteButtonProps: {
      style: {
        paddingRight: 10,
        justifyContent: 'center',
        alignItems: 'flex-end'
      },
      iconStyle: {
        fontSize: 25
      },
      iconClassName: 'text-color-white',
      activeIconClassName: 'text-color-secondary',
      icon: 'heart-o',
      iconActive: 'heart',
      refetchQueries: ['getFavoritesExtended']
    },
    scheduleRightLabelProps: {},
    labelIndex: false,
    disabled: false,
    onPress: () => null
  }

  _getDataProps = ({ data } = {}) => data;

  shouldComponentUpdate (nextProps) {
    const currentDataProps = this._getDataProps(this.props)
    const nextDataProps = this._getDataProps(nextProps)
    return !_isEqual(currentDataProps, nextDataProps)
  }

  _renderHeader = (data) => {
    const { styles, labelIndex, indexCollection } = this.props
    if (data.__typename === 'Media') {
      const textLeft = moment(new Date()).diff(data.date_recorded, 'hour') <= 24
        ? '%new_media_label%'
        : labelIndex ? (indexCollection + 1) : null
      if (data.date_recorded) {
        return (
          <View style={_merge({}, stylesDefault.headerContainer, styles.headerContainer)}>
            {textLeft ? <Text
              style={Object.assign({}, stylesDefault.topLeftLabel, styles.topLeftLabel)}
              numberOfLines={1} text={textLeft} /> : <NativeView />}
            {data.duration && <NativeText
              style={[stylesDefault.topRightLabel, styles.topRightLabel]}>
              {FormatTime(data.duration, { key: 'duration' }).duration}</NativeText>}
          </View>
        )
      }
    }
    if (data.__typename === 'Schedule') {
      const { scheduleRightLabelProps } = this.props// WIP
      return (
        <NativeView style={[stylesDefault.headerContainer, styles.headerContainer]}>
          {/* WIP */}
          {
            data.current
              ? <Text
                style={Object.assign({}, stylesDefault.topLeftLabel, styles.topLeftLabel)}
                numberOfLines={1} text={'%live_now%'} />
              : <View />
          }
          {
            !data.current &&
            <IconThemeButton
              {..._merge({}, scheduleRightLabelDefault, scheduleRightLabelProps)}
              textProps={{
                className: 'text-right-label-schedule',
                text: data.scheduled ? '%label_is_scheduled%' : '%label_is_not_scheduled%'
              }} />
          }
        </NativeView>
      )
    }

    return null
  }

  _renderPlayIcon = (data) => {
    const { styles } = this.props
    if (data.__typename === 'Media' || (data.__typename === 'Schedule' && data.current)) {
      return (
        <NativeView style={[stylesDefault.wrapperIcon, styles.wrapperIcon]}>
          <NativeView style={[
            stylesDefault.containerIcon,
            styles.containerIcon
          ]}/>
          <NativeView style={[
            stylesDefault.containerBorderIcon,
            styles.containerBorderIcon
          ]}/>
          <IconTheme
            icon='play-arrow'
            config={{ useIconSet: 'materialIcons' }}
            style={Object.assign({}, stylesDefault.iconPlay, styles.iconPlay)} />
        </NativeView>
      )
    }
    return null
  }

  _renderActions = (data) => {
    const { styles } = this.props
    if (data.__typename === 'Media') {
      const { favoriteButtonProps } = this.props
      return (
        <NativeView style={[stylesDefault.containerActions, styles.containerActions]}>
          <FavoriteButton
            {...FavororitePropsDefault}
            {...favoriteButtonProps}
            favorite={data.favorite}
            _id={data._id}
          />
        </NativeView>
      )
    }
    return null
  }

  _renderContent = (data = {}) => {
    const {
      styles = {},
      pathImage = 'thumbnails.default.url',
      imageBackgroundDefault,
      customImageMatch
    } = this.props

    const { 'rival-1': rivalOne, 'rival-2': rivalTwo } = data.match || {}

    let _source = {}

    if (String(_get(data, pathImage)).includes('http')) {
      _source.uri = _get(data, pathImage)
    } else if (data.__typename === 'Schedule') {
      const isMatch = !_isEmpty(rivalOne) && !_isEmpty(rivalTwo)
      if (customImageMatch && isMatch) {
        _source = customImageMatch
      } else {
        _source = imageBackgroundDefault
      }
    } else {
      _source = imageBackgroundDefault
    }

    return (
      <View style={{ position: 'relative', width: '100%', aspectRatio: 16 / 9 }}>
        <Image
          source={_source}
          style={Object.assign({}, stylesDefault.imageContainer, styles.imageContainer)}
        />
        <View className="absolute-fill bg-dark" style={{ opacity: 0.4 }} />

        {/* Conditional Header */}
        <View style={stylesDefault.containerElemets}>
          {this._renderHeader(data)}

          <NativeView
            style={[stylesDefault.wrapperContent, styles.wrapperContent]}>

            {
              data.__typename === 'Schedule'
                ? this._renderContentSchedule(data)
                : (<Fragment>

                  {/* Conditional PlayIcon */}
                  {this._renderPlayIcon(data)}

                  {/* Conditional Actions */}
                  {this._renderActions(data)}
                </Fragment>)
            }

          </NativeView>
        </View>

      </View>
    )
  }

  _renderContentSchedule = ({ match, ...otherProps }) => {
    const { 'rival-1': rivalOne, 'rival-2': rivalTwo } = match || {}
    const isMatch = !_isEmpty(rivalOne) && !_isEmpty(rivalTwo)
    if (!isMatch) return this._renderPlayIcon(otherProps)
    return (
      <View className={'flex-row justify-content-center align-items-center content-schedule'}>
        <View className="container-rival-one">
          <Image
            key="rivalOne"
            source={{ uri: String(rivalOne.image).includes('https://') ? rivalOne.image : this.props.imageDefault.uri }}
            style={{
              width: 80,
              height: 80
            }}
          />
        </View>
        <View className="container-info-match">
          {!otherProps.current && (
            <Text
              className="text-align-center text-info-time-hh"
              text={moment(otherProps.date_start).format('hh:mm')} />
          )}
          <Text className="text-align-center text-info-schedule-vs" text={'%vs%'} />
        </View>
        <View className="container-rival-two">
          <Image
            key="rivalTwo"
            source={{ uri: String(rivalTwo.image).includes('https://') ? rivalTwo.image : this.props.imageDefault.uri }}
            style={{
              width: 80,
              height: 80
            }}
          />
        </View>
      </View>)
  }
  _renderFooter = () => <FooterMediaItem {...this.props}/>

  render () {
    const { data } = this.props
    const { styles = {}, onPress, disabled } = this.props
    return (
      <TouchableOpacity
        onPress={() => onPress(data)}
        disabled={disabled}
        style={[stylesDefault.container, styles.container]}>
        <Fragment>
          {this._renderContent(data)}
          { this._renderFooter() }
        </Fragment>
      </TouchableOpacity>
    )
  }
}

const scheduleRightLabelDefault = {
  style: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingVertical: 8
  },
  icon: 'notifications',
  iconProps: {
    config: {
      useIconSet: 'materialIcons'
    },
    fontSize: 25,
    color: 'white'
  }
}

const stylesDefault = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderColor: 'black',
    borderWidth: 0.1,
    width: '100%'
  },
  imageContainer: {
    width: '100%',
    height: '100%'
  },
  containerElemets: {
    position: 'absolute',
    height: '100%',
    width: '100%'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  topLeftLabel: {
    maxWidth: '40%',
    backgroundColor: 'gray',
    paddingVertical: 4,
    paddingHorizontal: 6,
    textAlign: 'center',
    fontSize: 16
  },
  topRightLabel: {
    width: '20%',
    backgroundColor: 'gray',
    paddingVertical: 4,
    textAlign: 'center',
    fontSize: 16
  },
  wrapperContent: {
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  wrapperIcon: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'black',
    opacity: 0.6,
    position: 'absolute'
  },
  containerBorderIcon: {
    borderColor: 'white',
    borderWidth: 3,
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute'
  },
  iconPlay: {
    fontSize: 30,
    marginLeft: 7,
    color: 'white'
  },
  containerActions: {
    width: 50,
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 0,
    bottom: 10
  }
})

const FavororitePropsDefault = {
  style: {
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  iconStyle: {
    fontSize: 25
  },
  iconClassName: 'text-color-white',
  activeIconClassName: 'text-color-secondary',
  icon: 'heart-o',
  iconActive: 'heart',
  refetchQueries: ['getFavoritesExtended']
}

export default MediaItem
