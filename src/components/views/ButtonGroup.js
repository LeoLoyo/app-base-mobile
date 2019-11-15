import React from 'react'
import PropTypes from 'prop-types'
import merge from 'lodash/merge'
import has from 'lodash/has'
import Image from '../native/CachedImage'
import Button from '../native/Button'
import Text from '../native/Text'
import View from '../native/View'

class Component extends React.Component {
  state = {
    value: -1
  }

  handlePress = (value, options) => {
    const {name} = this.props
    this.setState({selected: value}, () => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange({[name]: value}, options)
      }

      if (typeof this.props.onToggle === 'function') {
        this.props.onToggle()
      }
    })
  }

  renderButton = (button, key) => {
    const {imageProps, textProps, source, text, ...props} = button
    return (
      <Button key={key} {...props}>
        {imageProps && <Image source={source} {...imageProps} />}
        {textProps && <Text text={text} {...textProps} />}
      </Button>
    )
  }

  renderTitle () {
    return has(this.props, 'title') &&
      <Text className={this.props.title.className} >
        {this.props.title.text}
      </Text>
  }

  render () {
    const {className, extraClassName, button, options} = this.props
    return (
      <View className={className}>
        {this.renderTitle()}
        <View className={extraClassName}>
          {(options || []).map((option, index) =>
            this.renderButton(merge({}, button, option, {
              index,
              isActive: index === this.props.value,
              onPress: () => this.handlePress(index, option.options || {})
            }), index))}
        </View>
      </View>
    )
  }
}

Component.propTypes = {
  button: PropTypes.object,
  className: PropTypes.string,
  extraClassName: PropTypes.string,
  children: PropTypes.any,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onToggle: PropTypes.func,
  options: PropTypes.array,
  text: PropTypes.string,
  title: PropTypes.shape({
    className: PropTypes.string,
    text: PropTypes.string
  }),
  value: PropTypes.string
}

Component.defaultProps = {}

export default Component
