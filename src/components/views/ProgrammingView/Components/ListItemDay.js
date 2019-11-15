import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { Text, View } from '../../../'

function ListItemDay (props) {
  const { styles, onPress, actived, item } = props
  const classNameView = actived ? 'bg-primary bg-listday-primary' : 'bg-secondary bg-listday-secondary'
  const classNameText = actived ? 'text-color-secondary' : 'text-color-primary'
  return (
    <TouchableOpacity style={[styleDefault.wrapper, styles.wrapper]} onPress={() => onPress(item)}>
      <View className={classNameView} style={Object.assign({}, styleDefault.container, styles.container)}>
        <Text className={classNameText}
          style={ Object.assign({}, styleDefault.subTitle, styles.subTitle, actived && styles.activeSubTitle) }
          text={moment(item._id, 'YYYY-MM-DD').locale('es').format('MMM')}/>
        <Text
          className={classNameText}
          style={ Object.assign({}, styleDefault.title, styles.title, actived && styles.activeTitle) }
          text={moment(item._id, 'YYYY-MM-DD').format('DD')}/>
        <Text className={classNameText}
          style={ Object.assign({}, styleDefault.subTitle, styles.subTitle, actived && styles.activeSubTitle) }
          text={moment(item._id, 'YYYY-MM-DD').locale('es').format('ddd')}/>
      </View>
    </TouchableOpacity>
  )
}

ListItemDay.propTypes = {
  item: PropTypes.object.isRequired,
  onPress: PropTypes.func,
  styles: PropTypes.object,
  actived: PropTypes.bool
}

ListItemDay.defaultProps = {
  onPress: () => {},
  styles: {},
  actived: false
}
ListItemDay.displayName = 'ListItemDay'

const styleDefault = StyleSheet.create({
  container: {
    width: 73,
    height: 79,
    borderBottomWidth: 0,
    shadowColor: '#869DA1',
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowOpacity: 1,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  subTitle: {
    textAlign: 'center',
    fontSize: 16
  },
  title: {
    textAlign: 'center',
    fontSize: 22
  },
  wrapper: {
    padding: 3
  }
})

export default React.memo(ListItemDay)
