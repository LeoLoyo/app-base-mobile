import React from 'react'
import PropTypes from 'prop-types'
import { FlatList, View, StyleSheet } from 'react-native'

import withMutation from '../../../../core/withMutation'
import withToast from '../../../../core/withToast'
import { CustomComponentProvider } from '../../../../core/withCustomComponent'

import { mutationScheduleProfile } from '../../../graph'
import MediaItem from '../../MediaItem'
import { EmptyListSchedule } from '.'

class ListMediaItem extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    daySelected: PropTypes.string,
    loading: PropTypes.bool,
    mutation: PropTypes.object,
    styles: PropTypes.object,
    emptyListProps: PropTypes.object,
    itemProps: PropTypes.shape({
      imageDefault: PropTypes.object.isRequired // Image defaul to Schedule Match
    }),
    onPress: PropTypes.func.isRequired
  };

  static defaultProps = {
    styles: {}
  };

  static getMutation () {
    return {
      mutation: mutationScheduleProfile
    }
  }

  _keyExtractor = item => item._id;

  _renderItem = ({ item, index }) => {
    const props = this.props.itemProps || {}
    return (
      <CustomComponentProvider {...props} components={['MediaItem']}>
        {({ MediaItem: MediaItemCustom }) => {
          if (MediaItemCustom) {
            return <MediaItemCustom {...props} data={item} indexCollection={++index} onPress={this._onPress} />
          }
          return <MediaItem {...props} data={item} indexCollection={++index} onPress={this._onPress}/>
        }}
      </CustomComponentProvider>
    )
  }

  _renderSeparator = () => {
    const { styles } = this.props
    return <View style={[stylesDefault.separationStyle, styles.separationStyle]} />
  }

  _renderEmptyComponent = () => <EmptyListSchedule {...this.props.emptyListProps}/>

  _onPress = async (data) => {
    this.props.onPress && this.props.onPress(data)
  }

  render () {
    const { styles } = this.props
    return (
      <FlatList
        data={this.props.data}
        keyExtractor={this._keyExtractor}
        ItemSeparatorComponent={this._renderSeparator}
        renderItem={this._renderItem}
        contentContainerStyle={[
          stylesDefault.contentContainerStyle,
          styles.contentContainerStyle
        ]}
        ListEmptyComponent={this._renderEmptyComponent}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    )
  }
}

const stylesDefault = StyleSheet.create({
  contentContainerStyle: {
    backgroundColor: 'white',
    padding: 27
  },
  separationStyle: {
    margin: 10
  }
})

export default withToast(withMutation(ListMediaItem))
