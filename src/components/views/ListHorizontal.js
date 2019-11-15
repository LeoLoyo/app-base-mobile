import React from 'react'
import PropTypes from 'prop-types'
import { FlatList, View, Dimensions, Platform } from 'react-native'

import { CustomComponentProvider } from '../../core/withCustomComponent'

const { height, width } = Dimensions.get('window')

const screenAspecRatio = height / width

class Component extends React.Component {
    keyExtractor = (item, index) => String(item._id || item.id || index)

    renderItem = ({ item, index }) => {
      const props = {
        ...item,
        index,
        ...this.props.itemProps
      }
      return (
        <CustomComponentProvider {...this.props} components={['ItemComponent']} >
          {({ ItemComponent }) => (<ItemComponent
            readableIndex={index + 1}
            key={item.id || item._id || index}
            {...props} />)}
        </CustomComponentProvider>
      )
    }
  _renderTeamItemContainer = ({ index, item, children }) => {
    return (
      <View style={{ left: -(index * 25) }}>
        {children}
      </View>
    )
  }

  getDevices = (aspecRatio) => {
    return Platform.select({
      ios: () => aspecRatio > 1.6 ? 103.5 : 112,
      android: () => {
        if (aspecRatio > 1.6) {
          return 104
        } else if (aspecRatio > 1.4) {
          return 107
        } else {
          return 110
        }
      }
    })()
  }

  render () {
    const { data } = this.props
    let getStyleTeam = function (zTeams = 10, logoSize = 70) {
      const size = logoSize
      const quater = (size * 0.25)
      const threequater = (size * 0.75)
      const width = (zTeams * threequater) + (quater * 2)
      return {width}
    }
    return (
      <FlatList
        horizontal={true}
        CellRendererComponent={this._renderTeamItemContainer}
        contentContainerStyle={getStyleTeam(data.length, this.getDevices(screenAspecRatio))}
        data={data}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        {...this.props.optionalProps}
      />
    )
  }
}

Component.propTypes = {
  contentContainerStyle: PropTypes.object,
  data: PropTypes.any,
  ItemComponent: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  itemProps: PropTypes.object,
  optionalProps: PropTypes.object
}

Component.defaultProps = {
  scrollEnabled: false,
  itemProps: {},
  optionalProps: {
    removeClippedSubviews: false,
    showsHorizontalScrollIndicator: false
  }
}

export default Component
