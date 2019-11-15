import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _merge from 'lodash/merge'
import _has from 'lodash/has'
import _get from 'lodash/get'
import _omit from 'lodash/omit'
import _isFunction from 'lodash/isFunction'
import View from '../../native/View'
import Text from '../../native/Text'
import Image from '../../native/CachedImage'
import Button from '../../native/Button'
import List from '../../views/List'
import { CustomComponentProvider } from '../../../core/withCustomComponent'

const sizeThumb = {
  width: 130,
  height: 90

}
const ItemComponentDefault = props => {
  const isActive = _get(props, 'index') === _get(props, 'active')
  const presetImage = _get(props, 'presetImage', null) ? `?${_get(props, 'presetImage', '')}` : ''
  const source = _get(props, 'image', false) ? _get(props, 'image') + presetImage : _get(props, 'imageDefault')
  const className = isActive
    ? `bg-info border-radius-3 position-relative border-3 border-color-info bg-active border-color-active`
    : `bg-transparent border-radius-3 position-relative border-3 border-color-transparent`
  return (
    <Button onPress={() => _isFunction(_get(props, 'onPress'))
      ? _get(props, 'onPress')(_omit(props, ['onPress']))
      : null}
    className={``}
    style={{
      shadowColor: '#BBBBBB',
      shadowRadius: 2,
      shadowOffset: {
        width: 1,
        height: 1
      },
      shadowOpacity: 0.8
    }}
    activeOpacity={1}>
      <View
        className={className}
        style={{
          width: 130,
          height: 90,
          overflow: 'hidden'
        }}>
        <Image className='w-100 h-100 bg-transparent border-radius-3'
          style={{ ...sizeThumb, overflow: 'hidden' }}
          source={{ uri: source }}
        />
        <View
          className='absolute-fill border-radius-3'
          style={{ ...sizeThumb, backgroundColor: 'black', zIndex: 2, opacity: 0.4 }} />

        <View
          className='position-absolute text-aling-center w-100'
          style={{ bottom: 8, left: 0, zIndex: 4 }}>
          <Text
            className='text-color-white text-align-center'
            style={{ fontSize: 14 }}
            text={_get(props, 'text', '')} />
        </View>
      </View>
    </Button>
  )
}

const defaultProps = {
  containerProps: {
    className: 'w-100 bg-white'
  },
  listProps: {
    horizontal: true,
    itemProps: {
      className: 'text-color-danger'
    }
  }
}

const DefaultListCategories = (props) => {
  const { containerProps, listProps, itemProps, ...otherProps } = _merge({}, defaultProps, props)

  let dynamicListProps = {}

  if (!_has(listProps, 'ItemComponent')) {
    dynamicListProps = {
      optionalProps: {
        ..._get(listProps, 'optionalProps', {}),
        renderItem: function renderItem (otherProps) {
          return <ItemComponentDefault
            index={_get(otherProps, 'index')}
            {...itemProps}
            {..._get(otherProps, 'item', {})} />
        }
      }
    }
  } else { dynamicListProps = _merge({}, listProps, { itemProps }) }

  return (
    <View {...containerProps}>
      <List {...listProps} {...otherProps} {...dynamicListProps} />
    </View>
  )
}

DefaultListCategories.propTypes = {
  containerProps: PropTypes.object
}

class ListCategoriesExplorer extends Component {
  render () {
    const { CategoryComponent, ...props } = this.props
    const component = { CategoryComponent }
    return (
      <CustomComponentProvider {...component} components={['CategoryComponent']}>
        {
          ({ CategoryComponent }) => {
            return (
              CategoryComponent
                ? (<CategoryComponent {...props} />)
                : (<DefaultListCategories {...props} />)
            )
          }
        }
      </CustomComponentProvider>
    )
  }
}

ListCategoriesExplorer.propTypes = {
  CategoryComponent: PropTypes.string
}
ListCategoriesExplorer.defaultProps = {}

export default ListCategoriesExplorer
