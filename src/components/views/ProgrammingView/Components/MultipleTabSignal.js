import React, {useState} from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import _isArray from 'lodash/isArray'

import {TouchableOpacity} from 'react-native'

import View from '../../../native/View'
import Text from '../../../native/Text'

function TabSignal ({ item, selected, onPress, buttonItem, textStylesItem }) {
  return (
    <TouchableOpacity
      style={{
        borderBottomWidth: selected ? buttonItem.borderWidth : 0,
        borderBottomColor: selected ? buttonItem.color : 'white',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
      }}
      onPress={onPress}
    >
      <Text
        text={item.name}
        style={textStylesItem}/>
    </TouchableOpacity>
  )
}

TabSignal.propTypes = {
  item: PropTypes.object,
  selected: PropTypes.bool,
  onPress: PropTypes.func,
  textStylesItem: PropTypes.object,
  buttonItem: PropTypes.object
}

TabSignal.defaultProps = {
  item: {},
  selected: false,
  onPress: () => null,
  textStylesItem: {
    fontFamily: 'PassionOne-Regular',
    fontSize: 18,
    color: 'black'
  },
  buttonItem: {
    borderWidth: 4,
    color: '#DCDCDC'
  }
}

export default function MultipleTabSignal (props) {
  if (_isEmpty(props.groups) && !_isArray(props.groups)) return props.children
  const [tabSelected, setTab] = useState(props.groups[0])
  return (<React.Fragment>
    <View
      style={{
        margin: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#869DA1',
        shadowOffset: {
          width: 1,
          height: 1
        },
        shadowOpacity: 0.5,
        elevation: 3
      }}>
      {
        props.groups
          .map((tab, key) => <TabSignal {...props.tabItemsProps}
            key={key}
            item={tab}
            selected={tabSelected.name === tab.name}
            onPress={() => setTab(tab)}
          />)}
    </View>
    {props.children({ filter: tabSelected })}
  </React.Fragment>)
}

MultipleTabSignal.propTypes = {
  groups: PropTypes.any,
  children: PropTypes.any,
  tabItemsProps: PropTypes.object
}
MultipleTabSignal.defaultProps = {
  groups: []
}
