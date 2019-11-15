import React from 'react'
import PropTypes from 'prop-types'
import {isArray, get, includes, isObject} from 'lodash'
import withCustomComponent from '../../core/withCustomComponent'

class Mapper extends React.Component {
  static propTypes = {
    ContainerComponent: PropTypes.func,
    ItemComponent: PropTypes.func,
    SeparatorComponent: PropTypes.func,
    data: PropTypes.array,
    filter: PropTypes.array,
    filterPath: PropTypes.string,
    itemProps: PropTypes.object,
    separatorProps: PropTypes.object,
    extraItemProps: PropTypes.object
  }
  static defaultProps = {
    data: [],
    itemProps: {},
    separatorProps: {},
    extraItemProps: {}
  }

  render () {
    let {
      data,
      ContainerComponent,
      ItemComponent,
      SeparatorComponent,
      separatorProps,
      itemProps,
      extraItemProps,
      filter,
      filterPath,
      ...props
    } = this.props
    if (!ItemComponent) return null
    if (!isArray(data)) return null
    if (get(data, 'length', 0) === 0) return null

    if (isArray(filter) && filter.length > 0) {
      data = data.filter(item => !includes(filter, get(item, filterPath, undefined)))
    }

    const itemMap = data.reduce((acc, item, index, arr) => {
      const itemObj = isObject(item) ? item : {_id: item, text: item, value: item}
      item = <ItemComponent
        key={itemObj._id || itemObj.id || index}
        indexCollection={index} {...itemObj}
        {...itemProps}
        {...extraItemProps}/>
      return (index === arr.length - 1 || !SeparatorComponent)
        ? [...acc, item]
        : [...acc, item, <SeparatorComponent key={index} indexCollection={index} {...separatorProps}/>]
    }, [])

    if (!ContainerComponent) return itemMap

    return (
      <ContainerComponent {...props}>
        {itemMap}
      </ContainerComponent>
    )
  }
}

export default withCustomComponent(Mapper, ['ContainerComponent', 'ItemComponent', 'SeparatorComponent'])
