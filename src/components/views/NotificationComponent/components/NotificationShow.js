import React from 'react'
import PropTypes from 'prop-types'
import _get from 'lodash/get'
import { View, Image, Text, Link } from '../../../../components'
import { DateTimeFromMoment } from '../../../handlers/props-manager'

const NotificationShow = ({
  data,
  itemComponentProps
}) => {
  const {
    defaultImage,
    link,
    styles: {
      styleContainer,
      styleImageShow,
      styleContainDescription,
      styleContainTitle,
      styleViewed,
      styleTitle,
      styleDescription,
      styleDate
    },
    classNames: {
      classNameViewed,
      classNameDescription,
      classNameImage
    }
  } = itemComponentProps
  const imageProgram = _get(data, 'images', false) ? { uri: data.images[0] } : defaultImage
  const params = {
    _id: data._id,
    type: data.type === 'media' ? 'VOD' : 'LIVE',
    title: data.title,
    omitTitle: true
  }
  const createDate = DateTimeFromMoment(data.creationDate, { key: 'createDate' }).createDate
  return (
    <Link
      link={link}
      params={params}
      Component={'Button'}
      style={styleContainer}>
      <Image
        className={classNameImage}
        resizeMode={'contain'}
        style={styleImageShow}
        source={imageProgram} />
      <View style={styleContainDescription}>
        <View style={styleContainTitle}>
          {!data.viewed && <View className={classNameViewed} style={styleViewed} />}
          <Text
            maxLength={25}
            numberOfLines={1}
            text={data.title}
            style={styleTitle} />
        </View>
        <Text
          className={classNameDescription}
          maxLength={25}
          numberOfLines={1}
          text={data.description}
          style={styleDescription} />
        <Text
          className={classNameDescription}
          maxLength={20}
          numberOfLines={1}
          text={createDate}
          style={styleDate} />

      </View>
    </Link>
  )
}

NotificationShow.propTypes = {
  data: PropTypes.object,
  itemComponentProps: PropTypes.object
}

export default NotificationShow
