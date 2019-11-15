import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { View, Text } from '../..'

function EmptyListPurchased (props) {
  const { styles } = props

  return (
    <View style={Object.assign({}, styleDefault.container, styles.container)}>
      <Text
        className="text-color-primary"
        style={Object.assign({}, styleDefault.title, styles.title)}
        text="%content_with_out_purchased%"
      />
    </View>
  )
}

EmptyListPurchased.propTypes = {
  styles: PropTypes.object
}

EmptyListPurchased.defaultProps = {
  styles: {}
}
EmptyListPurchased.displayName = 'EmptyListPurchased'

const styleDefault = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    textAlign: 'center',
    fontSize: 22
  }
})

export default React.memo(EmptyListPurchased)
