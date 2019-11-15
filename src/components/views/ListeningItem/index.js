import React from 'react'
import PropTypes from 'prop-types'
import { Dimensions, StyleSheet } from 'react-native'
import _merge from 'lodash/merge'
import _get from 'lodash/get'

import { View, IconThemeButton, Text, Image } from '../..'

const { width } = Dimensions.get('window')

class ListeningItem extends React.Component {
  static propTypes = {
    image: PropTypes.string,
    onPress: PropTypes.any,
    onPressParams: PropTypes.object,
    text: PropTypes.string,
    imageDefault: PropTypes.string,
    duration: PropTypes.any,
    progress: PropTypes.any,
    styles: PropTypes.object,
    classNames: PropTypes.object,
    textDate: PropTypes.string,
    textParams: PropTypes.object
  }

  static defaultProps = {
    onPress: () => { },
    progress: 0.7,
    classNames: {
      classNameContainer: 'bg-primary'
    }
  }

  render () {
    const {
      text,
      imageDefault,
      duration,
      progress,
      styles,
      textDate,
      textParams,
      classNames: {
        classNameContainer,
        classNameVertical,
        classNameRow,
        classNameTitle,
        classNameIconPlay,
        classNameTextDuration,
        classNameTextDate
      },
      onPress,
      onPressParams
    } = this.props
    const progressInt = progress > 100 ? 100 : progress
    const progressFinal = { width: `${progressInt.toString()}%`, borderBottomEndRadius: progressInt < 98 ? 0 : 10 }
    const image = _get(this.props, 'image', imageDefault)
    return (
      <View
        className={classNameContainer}
        style={_merge({}, stylesDefault.container, _get(styles, 'container', {}))}>
        <Image
          source={{ uri: image }}
          style={_merge({}, stylesDefault.image, _get(styles, 'image', {}))} />
        <View
          style={{ flex: 1, justifyContent: 'space-between' }}>
          <View
            className={classNameVertical}
            style={_merge({}, stylesDefault.containerVertical, _get(styles, 'containerVertical', {}))}>
            <Text
              className={classNameTitle}
              text={text}
              numberOfLines={width > 320 ? 2 : 1}
              style={_merge({}, stylesDefault.title, _get(styles, 'title', {}))} />
            <View
              className={classNameRow}
              style={_merge({}, stylesDefault.containerRow, _get(styles, 'containerRow', {}))}>
              <IconThemeButton
                iconClassName={classNameIconPlay}
                onPress={() => onPress(onPressParams)}
                icon={'play-circle-filled'}
                iconStyle={_merge({}, stylesDefault.iconPlay, _get(styles, 'iconPlay', {}))}
                iconProps={{ config: { useIconSet: 'materialIcons' } }}
              />
              <View style={{ alignItems: 'flex-start', marginVertical: 10 }}>
                <Text
                  className={classNameTextDate}
                  text={textDate}
                  numberOfLines={1}
                  textParams={textParams}
                  style={_merge({}, stylesDefault.textDate, _get(styles, 'textDate', {}))} />
                <Text
                  className={classNameTextDuration}
                  numberOfLines={1}
                  text={duration}
                  style={_merge({}, stylesDefault.textDuration, _get(styles, 'textDuration', {}))} />
              </View>
            </View>
          </View>
          <View
            style={_merge({}, stylesDefault.containerProgress, _get(styles, 'containerProgress', {}))} >
            <View
              style={_merge({}, stylesDefault.progress, _merge({}, _get(styles, 'progress', {}), progressFinal))} />
          </View>
        </View>
      </View>
    )
  }
}

const stylesDefault = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    flexDirection: 'row',
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderWidth: 0.1,
    borderRadius: 10,
    width: width * 0.9,
    backgroundColor: 'white',
    marginHorizontal: 5
  },
  image: {
    width: '35%',
    height: '100%',
    borderBottomStartRadius: 10,
    borderTopStartRadius: 10,
    backgroundColor: 'black',
    overflow: 'hidden'
  },
  containerVertical: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 10
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
    marginHorizontal: 12
  },
  containerRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  },
  iconPlay: {
    color: '#00bcff',
    fontSize: 45,
    marginStart: 12,
    marginEnd: 5
  },
  textDate: {
    fontSize: 10,
    color: 'gray',
    marginBottom: 5
  },
  textDuration: {
    fontSize: 10,
    color: 'gray'
  },
  containerProgress: {
    width: '100%',
    backgroundColor: '#BBBBBB',
    borderBottomEndRadius: 10
  },
  progress: {
    height: 7,
    backgroundColor: '#00bcff'
  }
})

export default ListeningItem
