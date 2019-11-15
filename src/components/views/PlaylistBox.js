import React from 'react'
import PropTypes from 'prop-types'
import {get} from 'lodash'
import Text from '../native/Text'
import CachedImage from '../native/CachedImage'
import Link from '../native/Link'
import View from '../native/View'

class Component extends React.Component {
  parseCustomAtributtes (custom) {
    try {
      const customAtributes = JSON.parse(custom)
      return customAtributes
    } catch (error) {
      return {}
    }
  }

  render () {
    const {_id, custom, className, imageProps, titleProps, ...props} = this.props
    const customAtributes = this.parseCustomAtributtes(custom)
    return (
      <Link
        className={className}
        onPressIn={this.handleFocus}
        onPressOut={this.handleBlur}
        params={{parentId: _id}}
        {...props}
      >
        <CachedImage
          source={{uri: get(customAtributes, 'cover-mobile'), parse: true}}
          {...imageProps}
        />
        <View className="flex-1 justify-content-center align-items-center">
          <Text {...titleProps}>
            {get(this.props, 'name')}
          </Text>
        </View>
      </Link>
    )
  }
}

Component.propTypes = {
  custom: PropTypes.string,
  className: PropTypes.string,
  imageProps: PropTypes.object,
  titleProps: PropTypes.object,
  _id: PropTypes.string
}

Component.defaultProps = {
  custom: '{}'
}

export default Component
