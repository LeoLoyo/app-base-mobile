import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Shine

} from 'rn-placeholder'

const PlaceholderMediaHorizontal = ({ style }) => (
  <View style={[styles.container, style.container]}>
    <Placeholder
      Animation={Shine}>
      <View style={[styles.titleContainer, style.titleContainer]}>
        <PlaceholderLine width={40} height={15} />
        <PlaceholderMedia isRound size={22} />
      </View>
      <View style={[styles.contain, style.contain]}>
        <View style={[styles.mediaContainer, styles.mediaContainer]}>
          <PlaceholderMedia style={[styles.media, style.media]} />
          <View style={[styles.description, style.description]}>
            <PlaceholderLine width={70} />
            <PlaceholderLine width={60} />
          </View>
        </View>
        <View style={[styles.mediaContainer, styles.mediaContainer]}>
          <PlaceholderMedia style={[styles.media, style.media]} />
          <View style={[styles.description, style.description]}>
            <PlaceholderLine width={70} />
            <PlaceholderLine width={60} />
          </View>
        </View>
      </View>
    </Placeholder>
  </View>
)

PlaceholderMediaHorizontal.propTypes = {
  style: PropTypes.object
}

PlaceholderMediaHorizontal.defaultProps = {
  style: {}
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 10
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingVertical: 5
  },
  contain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%'
  },
  mediaContainer: {
    width: '80%',
    aspectRatio: 2
  },
  media: {
    width: '95%',
    height: '100%',
    marginRight: 2
  },
  description: {
    marginTop: 10,
    paddingStart: 5
  }
})

export default PlaceholderMediaHorizontal
