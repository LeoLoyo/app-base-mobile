import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { List, View } from '../../..'
import { ListItemDay } from '.'

class ListDays extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    onPress: PropTypes.func,
    daySelected: PropTypes.string,
    listProps: PropTypes.object,
    wrapperProps: PropTypes.object
  }

  static defaultProps = {
    onPress: () => {},
    listProps: {},
    wrapperProps: {}
  }

  renderItem = ({item, index}) => {
    const { listProps: { itemProps = {} } } = this.props
    return item._id ? (
      <ListItemDay
        item={item}
        {...itemProps}
        onPress={this.props.onPress}
        actived={this.props.daySelected === item._id}/>
    ) : null
  }

  render () {
    const { listProps, wrapperProps } = this.props
    return (
      <View {...wrapperProps}>
        <List
          data={this.props.data}
          {...listProps}
          optionalProps={{
            renderItem: this.renderItem,
            contentContainerStyle: [
              stylesDefault.contentContainerStyle,
              listProps.contentContainerStyle
            ],
            showsHorizontalScrollIndicator: false,
            showsVerticalScrollIndicator: false
          }}
          horizontal

        />
      </View>
    )
  }
}

const stylesDefault = StyleSheet.create({
  contentContainerStyle: {
    backgroundColor: 'white'
  }
})

export default ListDays
