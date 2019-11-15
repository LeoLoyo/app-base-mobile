import React from 'react'
import { FlatList } from 'react-native'
import PropTypes from 'prop-types'
import { CustomComponentProvider } from '../../../core/withCustomComponent'

class NativeBaseListSwipeable extends React.Component {
  _renderRow = ({ item }) => {
    return (
      <CustomComponentProvider {...this.props} components={['ComponentItemRow']}>
        {({ ComponentItemRow }) => {
          return ComponentItemRow ? <ComponentItemRow {...item} /> : null
        }}
      </CustomComponentProvider>
    )
  }
  render () {
    return (
      <FlatList
        {...this.props}
        renderItem={this._renderRow}
      />
    )
  }
}

NativeBaseListSwipeable.propTypes = {
  data: PropTypes.any
}

export default NativeBaseListSwipeable
