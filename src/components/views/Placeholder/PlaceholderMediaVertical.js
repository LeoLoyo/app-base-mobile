import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Shine
} from 'rn-placeholder'

const PlaceholderMediaVertical = ({ style }) => (
  <View style={[styles.container, style.container]}>
    <Placeholder
      Animation={Shine}>
      {[...Array(3).keys()].map((item) => (
        <View style={{ width: '100%', height: '29%', marginBottom: 70 }} key={item}>
          <PlaceholderMedia style={[styles.media, style.media]} />
          <View style={[styles.description, style.description]}>
            <PlaceholderLine width={70} />
            <PlaceholderLine width={60} />
            <PlaceholderLine width={40} />
          </View>
        </View>
      ))}
    </Placeholder>
  </View>
)

PlaceholderMediaVertical.propTypes = {
  style: PropTypes.object
}

PlaceholderMediaVertical.defaultProps = {
  style: {}
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 10
  },
  media: {
    width: '100%',
    height: '90%'
  },
  description: {
    marginVertical: 10,
    paddingStart: 5
  }
})

export default PlaceholderMediaVertical
