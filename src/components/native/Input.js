import React from 'react'
import PropTypes from 'prop-types'
import has from 'lodash/has'
import size from 'lodash/size'
import get from 'lodash/get'
import isUndefined from 'lodash/isUndefined'
import moment from 'moment'
import View from './View'
import Text from './Text'
import TextInput from './TextInput'
import Flatlist from './Flatlist'
import DateInput from './DateInput'
import SliderControl from '../views/SliderControl'
import ActionSheet from '../frameworks/native-base/ActionSheet'
import ActionSheetGenders from '../native/ActionSheetGenders'
import withCondition from '../../core/withCondition'

class Input extends React.PureComponent {
  constructor (props) {
    super(props)
    this.input = null
    this.state = {
      touched: false,
      valid: false
    }
    this.onChangeText = this.onChangeText.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  renderRequired () {
    const {required} = this.props
    return <Text className={ required.className }>{ required.text }</Text>
  }

  renderError () {
    const {error, required} = this.props
    return <Text className={ required.className }>{ error.pop() }</Text>
  }

  renderLabel (validations) {
    const {error, required, labelWrapper, label, labelText} = this.props
    return (
      <View className={ labelWrapper.className }>
        { label && <Text { ...label } text={ labelText }/> }
        { size(error) && this.state.touched ? this.renderError() : required && this.renderRequired() }
      </View>
    )
  }

  renderElement (type, props) {
    if (has(props, 'shouldRender') && !props.shouldRender) {
      return null
    }

    if (has(props, 'carousel')) {
      return (
        <Flatlist { ...props.carousel } { ...props } onChange={ this.onChange }/>
      )
    }

    if (get(props, 'renderComponent') === 'DateInput') {
      return (
        <DateInput
          value={ props.value ? new Date(moment(props.value).format()) : new Date() }
          name={ props.name }
          onChange={ this.onChangeText }
          { ...props }
        />
      )
    }

    if (get(props, 'renderComponent') === 'NativeActionSheet') {
      return <ActionSheet
        { ...props }
        onChange={ this.onChangeText }
      />
    }

    if (get(props, 'renderComponent') === 'ActionSheetGenders') {
      return <ActionSheetGenders
        { ...props }
        onChange={ this.onChangeText }
      />
    }

    if (has(props, 'slider')) {
      return (
        <SliderControl
          value={ props.value ? parseInt(props.value) : 0 }
          name={ props.name }
          onChange={ this.onChange }
          { ...props.slider }
        />
      )
    }

    return (
      <TextInput { ...props } />
    )
  }

  onChange (value) {
    this.props.onChange(value)
    if (!this.state.touched) {
      this.setState({touched: true})
    }
  }

  onChangeText (value) {
    this.props.onChangeText(value)
    if (!this.state.touched) {
      this.setState({touched: true})
    }
  }

  render () {
    const {help = false, type, labelWrapper, wrapperClassName, wrapperStyle, hide, show, ...props} = this.props

    let displayInput = true
    if (!isUndefined(hide)) displayInput = !hide
    else if (!isUndefined(show)) displayInput = show
    return displayInput && (
      <View className={ wrapperClassName } style={ wrapperStyle }>
        { labelWrapper && this.renderLabel() }
        { this.renderElement(type, props) }
        { help && this.renderHelp() }
      </View>
    )
  }
}

/**
 * Props
 */
Input.propTypes = {
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  elementRef: PropTypes.func,
  error: PropTypes.array,
  help: PropTypes.bool,
  input: PropTypes.object,
  label: PropTypes.object,
  labelText: PropTypes.string,
  labelWrapper: PropTypes.object,
  onChange: PropTypes.func,
  onChangeText: PropTypes.func,
  _setContext: PropTypes.func,
  setContext: PropTypes.func,
  required: PropTypes.object,
  type: PropTypes.string,
  wrapperClassName: PropTypes.string,
  wrapperStyle: PropTypes.object,
  hide: PropTypes.bool,
  show: PropTypes.bool
}

export default withCondition(Input, ['hide', 'show'], [false, false])
