import React from 'react'
import {Text} from 'react-native'
import PropTypes from 'prop-types'
import _isArray from 'lodash/isArray'
import withStyle from '../../core/withStyle'
import withTranslation from '../../core/withTranslation'
import withFocus from '../../core/withFocus'
class Component extends React.Component {
  state = {
    text: null
  }
  componentDidMount () {
    if (typeof this.props.initialize === 'function') {
      this.setState({text: this.props.initialize()})
    }
  }

  _onPress = () => {
    if (typeof this.props.onPress === 'function') {
      this.props.onPress()
    }
  }

  _transformOperations = (operations, value) => {
    const tranformers = {
      'lowercase': (value) => String(value).toLowerCase()
    }
    const result = (operations || []).reduce((acc, current, index) => {
      if (tranformers[current]) {
        acc = tranformers[current](acc)
      }
      return acc
    }, String(value))
    return result
  }
  render () {
    const {text, uppercase, children, textTransForm = [], onPress, ...props} = this.props
    const content = text || children || this.state.text

    if (_isArray(content)) {
      return (
        <Text {...props}>
          {content}
        </Text>
      )
    }

    return (
      !!content && (
        <Text {...props}>
          { (uppercase && content
            ? this._transformOperations(textTransForm, String(content.toUpperCase()))
            : this._transformOperations(textTransForm, String(content)))
          }
        </Text>
      )
    )
  }
}

Component.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  queryValue: PropTypes.string,
  text: PropTypes.any,
  initialize: PropTypes.func,
  textTransForm: PropTypes.array,
  uppercase: PropTypes.bool,
  onPress: PropTypes.func
}

Component.defaultProps = {
  className: 'text-color-white'
}

export default withTranslation(withFocus(withStyle(Component)))
