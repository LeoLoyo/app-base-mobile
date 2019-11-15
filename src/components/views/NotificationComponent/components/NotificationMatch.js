import React from 'react'
import PropTypes from 'prop-types'
import _get from 'lodash/get'
import { View, Image, Text, Link } from '../../../../components'
import { DateTimeFromMoment } from '../../../handlers/props-manager'

const NotificationMatch = ({
  data,
  itemComponentProps
}) => {
  const {
    defaultImageTeam,
    link,
    styles: {
      styleContainer,
      styleContainImage,
      styleImageMatch,
      styleTextVS,
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
  const teamOne = _get(data, 'images[0]', false) ? { uri: data.images[0] } : defaultImageTeam
  const teamTwo = _get(data, 'images[1]', false) ? { uri: data.images[1] } : defaultImageTeam
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
      <View style={styleContainImage} className={classNameImage}>
        <Image
          style={styleImageMatch}
          source={teamOne}/>
        <Text text={'VS'} style={styleTextVS} />
        <Image
          style={styleImageMatch}
          source={teamTwo}/>
      </View>
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

NotificationMatch.propTypes = {
  data: PropTypes.object,
  itemComponentProps: PropTypes.object
}

export default NotificationMatch
