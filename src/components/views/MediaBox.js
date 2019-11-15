import React from 'react'
import {get} from 'lodash'
import PropTypes from 'prop-types'
import Text from '../native/Text'
import CachedImage from '../native/CachedImage'
import Link from '../native/Link'
import View from '../native/View'
import FavoriteButton from './FavoriteButton'
import TouchableOpacity from '../native/TouchableOpacity'

class Component extends React.Component {
  renderContent (params) {
    const {imageProps, titleProps, includeTitle, includeFavoriteButton} = this.props
    const {resizeMode, className, activeClassName} = imageProps
    const isActive = this.isActive(get(this.props, '_id'))
    const components = [
      <CachedImage
        key={`image-${params._id}`}
        source={{uri: get(this.props, 'thumbnails.default.url', {})}}
        resizeMode={resizeMode}
        className={isActive && activeClassName ? `${className} ${activeClassName}` : className } />
    ]

    if (includeTitle) {
      components.push(
        <View key={`title-${params._id}`} className={titleProps.containerClassName}>
          <Text {...titleProps}>
            {(get(this.props, 'title'))}
          </Text>
        </View>
      )
    }

    if (includeFavoriteButton) {
      components.push(
        <FavoriteButton key={`fv-${params._id}`}
          isFavorite={get(this.props, 'favorite')}
          media={get(this.props, '_id')}
          className='favorite-button-inactive'
          activeClassName='favorite-button' />
      )
    }
    return components
  }

  isActive (id) {
    const {isActive} = this.props

    if (typeof isActive === 'function') {
      return this.props.isActive(id)
    }
    return false
  }

  resolveParams () {
    const params = {
      _id: get(this.props, '_id'),
      parentId: get(this.props, 'parentId'),
      ...this.props.overrideParams,
      isActive: this.isActive(get(this.props, '_id'))
    }

    return params
  }

  onPress (params) {
    this.props.onPress(params, () => {
      if (typeof this.props.parentOnPress === 'function') {
        this.props.parentOnPress(this.props.index)
      }
    })
  }

  renderItem () {
    const {className, ...props} = this.props
    const params = this.resolveParams()
    const isActive = this.isActive(get(this.props, '_id'))
    const classNames = (isActive && this.props.activeClassName)
      ? `${this.props.className} ${this.props.activeClassName}` : this.props.className
    if (this.props.link) { // if the media box has a link attached
      return (
        <Link {...this.props} className={className} params={params} >
          {this.renderContent(params)}
        </Link>
      )
    } else if (typeof this.props.onPress === 'function') { // if the media box has a custom action attached
      return (
        <TouchableOpacity {...props} className={classNames} onPress={() => this.onPress(params) } >
          {this.renderContent(params)}
        </TouchableOpacity>
      )
    }
    return (
      <View className={className} >
        {this.renderContent(params)}
      </View>
    )
  }

  render () {
    return this.renderItem()
  }
}

Component.defaultProps = {
  includeTitle: false,
  includeFavoriteButton: false
}

Component.propTypes = {
  activeClassName: PropTypes.string,
  className: PropTypes.string,
  imageProps: PropTypes.object,
  isActive: PropTypes.func,
  index: PropTypes.number,
  params: PropTypes.object,
  link: PropTypes.string,
  titleProps: PropTypes.object,
  includeTitle: PropTypes.bool,
  includeFavoriteButton: PropTypes.bool,
  onPress: PropTypes.func,
  overrideParams: PropTypes.object,
  parentOnPress: PropTypes.func
}

export default Component
