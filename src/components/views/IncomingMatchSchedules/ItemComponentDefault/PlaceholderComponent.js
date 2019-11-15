import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Shine
} from 'rn-placeholder'

const PlaceholderComponent = ({style}) => (
  <View style={[styles.container, style.container]}>
    <Placeholder
      Animation={Shine}>
      <View style={[styles.containerTitle, style.containerTitle]}>
        <PlaceholderLine width={50} />
        <PlaceholderMedia isRound size={22} />
      </View>
      <View style={[styles.containerContent, style.containerContent]}>
        <PlaceholderMedia style={[styles.box, style]} />
        <PlaceholderMedia style={[styles.box, style]} />
      </View>
    </Placeholder>
  </View>
)

PlaceholderComponent.propTypes = {
  style: PropTypes.object
}

PlaceholderComponent.defaultProps = {
  style: {}
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%'
  },
  containerTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    padding: 5
  },
  containerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  box: {
    width: 220,
    height: 100,
    marginHorizontal: 5
  }
})

export default PlaceholderComponent
