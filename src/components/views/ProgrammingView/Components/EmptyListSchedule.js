import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Text, View } from '../../..'

function EmptyListSchedule (props) {
  const { styles } = props

  return (
    <View style={Object.assign({}, styleDefault.container, styles.container)}>
      <Text
        className="text-color-primary"
        style={Object.assign({}, styleDefault.title, styles.title)}
        text="%content_with_out_medias%"
      />
    </View>
  )
}

EmptyListSchedule.propTypes = {
  styles: PropTypes.object
}

EmptyListSchedule.defaultProps = {
  styles: {}
}
EmptyListSchedule.displayName = 'EmptyListSchedule'

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

export default React.memo(EmptyListSchedule)
