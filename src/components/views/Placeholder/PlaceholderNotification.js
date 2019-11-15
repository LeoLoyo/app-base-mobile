import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Shine
} from 'rn-placeholder'

const PlaceholderNotification = ({ style }) => (
  <View style={[styles.container, style.container]}>
    <Placeholder
      Animation={Shine}>
      {[...Array(7).keys()].map((item) => (
        <View key={item} style={{ width: '100%', flexDirection: 'row', height: '16%' }}>
          <PlaceholderMedia style={[styles.media, style.media]} />
          <View style={[styles.description, style.description]}>
            <PlaceholderLine width={70} />
            <PlaceholderLine width={80} />
            <PlaceholderLine width={40} />
          </View>
        </View>
      ))}
    </Placeholder>
  </View>
)

PlaceholderNotification.propTypes = {
  style: PropTypes.object
}

PlaceholderNotification.defaultProps = {
  style: {}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 18
  },
  media: {
    width: '33%',
    height: '64%'
  },
  description: {
    paddingStart: 20,
    paddingTop: 5,
    width: '67%'
  }
})

export default PlaceholderNotification
