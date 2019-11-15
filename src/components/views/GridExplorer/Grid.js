import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import _merge from 'lodash/merge'
import _has from 'lodash/has'
import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import View from '../../native/View'
import Image from '../../native/CachedImage'
import Link from '../../native/Link'
import List from '../../views/List'
import { CustomComponentProvider } from '../../../core/withCustomComponent'
import withQuery from './../../../core/withQuery'

const { width } = Dimensions.get('window')

const ItemComponentDefault = props => {
  const linkProps = {
    link: _get(props, 'link'),
    activeOpacity: _get(props, 'activeOpacity'),
    params: {
      ...props
    }
  }

  const presetImage = _get(props, 'presetImage', null) ? `?${_get(props, 'presetImage', '')}` : ''
  return (
    <Link
      {...linkProps}
      Component='Button'
      style={{
        width: width * 0.48,
        shadowColor: '#BBBBBB',
        shadowRadius: 2,
        shadowOffset: {
          width: 1,
          height: 1
        },
        shadowOpacity: 0.8,
        backgroundColor: 'danger',
        aspectRatio: 1
      }}>
      <View className="w-100"
        style={{
          paddingVertical: 4,
          paddingHorizontal: 5,
          overflow: 'hidden',
          aspectRadio: 1
        }}
      >
        <Image
          className="w-100 h-100 border-radius-2 bg-transparent"
          source={{
            uri: _get(props, _get(props, 'imagePath')) + presetImage || _get(props, 'thumbnails.default.url')
          }}
          style={{
            shadowColor: '#BBBBBB',
            shadowRadius: 2,
            shadowOffset: {
              width: 1,
              height: 1
            },
            shadowOpacity: 0.8,
            overflow: 'hidden'
          }}
        />
        {_get(props, 'viewed', false) && (<View
          className="position-absolute bg-info"
          style={{
            width: '7rem',
            height: '7rem',
            borderRadius: 50,
            right: 0,
            top: '1rem'
          }}
        />)}
      </View>
    </Link>
  )
}

const defaultProps = {
  containerProps: {
    className: 'w-100 h-100 bg-primary flex-1 justify-content-center align-items-center'
  },
  listProps: {
    horizontal: false,
    itemProps: {}
  }
}

const DefaultGridData = props => {
  const dataTmp = _get(props, 'data.getShowsPaginated.data')
  const { containerProps, listProps, itemProps, ...otherProps } = _merge({}, defaultProps, props)
  let dynamicListProps = {}
  if (!_has(listProps, 'ItemComponent')) {
    dynamicListProps = _merge({}, listProps, {
      optionalProps: {
        renderItem: function renderItem (otherProps) {
          return (
            <ItemComponentDefault
              index={_get(otherProps, 'index')}
              data={dataTmp}
              {...itemProps}
              {..._get(otherProps, 'item', {})}
            />
          )
        }
      }
    })
  } else {
    dynamicListProps = _merge({}, listProps, { itemProps })
  }
  const { responseName, data: fullResponse = {} } = otherProps
  const data = _get(otherProps, responseName, [])

  return (<View {...containerProps}>
    <List {...listProps} {...otherProps} {...dynamicListProps} {...fullResponse} data={data}/>
  </View>)
}

DefaultGridData.propTypes = {}

class GridDataExplorer extends Component {
  render () {
    const { GridComponent, LoaderComponent, NoDataComponent, ...props } = this.props
    const dataTmp = _get(props, 'data.getShowsPaginated.data')
    const component = { GridComponent, LoaderComponent, NoDataComponent }
    return (
      <CustomComponentProvider {...component}
        components={['GridComponent', 'LoaderComponent', 'NoDataComponent']}>
        {({ GridComponent, LoaderComponent, NoDataComponent }) => {
          if (_get(props, 'loading')) {
            return <LoaderComponent/>
          }
          if (_isEmpty(dataTmp) && !_get(props, 'loading')) {
            return <NoDataComponent/>
          }

          return GridComponent ? (
            <GridComponent {...props} />
          ) : (
            <DefaultGridData {...props} />
          )
        }}
      </CustomComponentProvider>
    )
  }
}

GridDataExplorer.propTypes = {
  GridComponent: PropTypes.string,
  LoaderComponent: PropTypes.string,
  NoDataComponent: PropTypes.string,
  loading: PropTypes.any
}
GridDataExplorer.defaultProps = {
  LoaderComponent: 'View',
  NoDataComponent: 'View',
  loading: true
}

export default withQuery(GridDataExplorer)
