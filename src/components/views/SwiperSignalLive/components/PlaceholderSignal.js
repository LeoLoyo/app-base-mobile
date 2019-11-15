import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import {
  Placeholder,
  PlaceholderMedia,
  Loader
} from 'rn-placeholder'

const PlaceholderSignal = ({ style }) => (
  <View style={[styles.container, style.container]}>
    <Placeholder
      Animation={Loader}>
      <PlaceholderMedia style={[styles.box, style.box]} />
    </Placeholder>
  </View>
)

PlaceholderSignal.propTypes = {
  style: PropTypes.object
}

PlaceholderSignal.defaultProps = {
  style: {}
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1.3
  },
  box: {
    width: '100%',
    height: '100%'
  }
})

export default PlaceholderSignal
