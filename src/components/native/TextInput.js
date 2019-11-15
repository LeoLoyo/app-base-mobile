import React from 'react'
import {TextInput as NativeTextInput, Platform} from 'react-native'
import PropTypes from 'prop-types'
import withStyle from '../../core/withStyle'
import withTranslation from '../../core/withTranslation'
import withFocus from '../../core/withFocus'
import withCondition from '../../core/withCondition'
import {View, IconThemeButton, Text} from './../../components'
import {isUndefined, get, defaultsDeep} from 'lodash'

class TextInput extends React.PureComponent {
  static defaultProps = {
    errors: [],
    maxLength: 50,
    toggleClearButton: false,
    bottomContainerStyle: {}
  }

  state = {
    dirty: false,
    blur: false,
    focus: false,
    secureTextEntry: this.props.secureTextEntry
  }

  _elementRef = null

  _ref = (ref) => {
    if (!this.elementRef) {
      this.elementRef = ref
    }

    if (typeof this.props.elementRef === 'function') {
      return this.props.elementRef(ref)
    }
  }

  renderFooter (style) {
    const {value, maxLength, showMaxLengthInfo, bottomContainerStyle} = this.props
    return showMaxLengthInfo && (
      <View style={bottomContainerStyle}>
        {showMaxLengthInfo && <Text text={`${(value || '').length}/${maxLength}`} />}
      </View>
    )
  }

  onFocus = () => {
    this.props.toggleFocus()
    if (typeof this.props.onFocus === 'function') {
      this.props.onFocus()
    }
  }

  _onChange = ({nativeEvent: {text: value = null}}) => {
    if (this.props.setContext) {
      value && this.props._setContext({[this.props.setContext]: value})
    }
  }

  _toggleSecureTextEntry () {
    this.setState({secureTextEntry: !this.state.secureTextEntry})
  }

  render () {
    const {
      toggleFocus,
      elementRef,
      value,
      containerStyle,
      style,
      errorStyle,
      name = 'input',
      editable = true,
      errors,
      hide,
      show,
      showClearButton,
      showEyeButton,
      containerClassName,
      closeButtonProps,
      eyeButtonProps,
      ...props
    } = this.props

    const inputStyles = [
      style,
      (errors || []).length > 0 && !this.state.dirty > 0 && errorStyle
    ]
    const contentContainerStyle = containerStyle || {width: style.width}

    const _closeButtonProps = defaultsDeep({}, closeButtonProps, {
      style: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        paddingRight: '1rem',
        justifyContent: 'center',
        alignItems: 'center'
      },
      iconStyle: {
        color: 'white',
        fontSize: '7rem'
      }
    })

    const _eyeButtonProps = defaultsDeep({}, eyeButtonProps, {
      style: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        paddingRight: '1rem',
        justifyContent: 'center',
        alignItems: 'center'
      }
    })

    const osProps = get(props, Platform.OS, {})

    let displayInput = true
    if (!isUndefined(hide)) displayInput = !hide
    else if (!isUndefined(show)) displayInput = show
    return displayInput && (
      <View className={containerClassName} style={contentContainerStyle}>
        <NativeTextInput
          key={`input-${name}`}
          {...props}
          editable={editable}
          onChange={this._onChange}
          secureTextEntry={this.state.secureTextEntry}
          onFocus={this.onFocus}
          onBlur={toggleFocus}
          ref={(ref) => this._ref(ref)}
          style={inputStyles}
          value={value}

          {...osProps}
        />
        { !!value && showClearButton &&
          <IconThemeButton
            key={`input-close-button-${name}`}
            onPress={() => {
              this.elementRef.clear()
              if (_closeButtonProps.resetSearch && this.props._setContext) {
                this.props._setContext({ query: '', skip: true })
              }
            }}
            {..._closeButtonProps}
          /> }

        { !!value && showEyeButton &&
          <IconThemeButton
            key={`input-eye-button-${name}`}
            onPress={() => this._toggleSecureTextEntry()}
            icon={this.state.secureTextEntry ? eyeButtonProps.icon : eyeButtonProps.iconOff}
            iconStyle={eyeButtonProps.iconStyle}
            style={_eyeButtonProps.style}
          /> }
        { this.renderFooter({width: style.width}) }
      </View>
    )
  }
}

/**
 * Props
 */
TextInput.propTypes = {
  bottomContainerStyle: PropTypes.object,
  containerClassName: PropTypes.string,
  closeButtonProps: PropTypes.object,
  name: PropTypes.string,
  maxLength: PropTypes.number,
  elementRef: PropTypes.func,
  eyeButtonProps: PropTypes.object,
  toggleFocus: PropTypes.func,
  containerStyle: PropTypes.object,
  onChange: PropTypes.func,
  onChangeText: PropTypes.func,
  errors: PropTypes.array,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  errorStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  startFocused: PropTypes.bool,
  editable: PropTypes.bool,
  value: PropTypes.string,
  show: PropTypes.bool,
  hide: PropTypes.bool,
  showClearButton: PropTypes.bool,
  showEyeButton: PropTypes.bool,
  showMaxLengthInfo: PropTypes.bool,
  setContext: PropTypes.object,
  secureTextEntry: PropTypes.bool,
  _setContext: PropTypes.func,
  onFocus: PropTypes.func
}

TextInput.defaultProps = {
  secureTextEntry: false,
  eyeButtonProps: {
    icon: 'visibility',
    iconOff: 'visibility-off',
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      paddingRight: '1rem',
      justifyContent: 'center',
      alignItems: 'center'
    },
    iconStyle: {
      color: 'black',
      fontSize: '7rem'
    }
  },
  closeButtonProps: {}
}

export default withTranslation(
  withStyle(withCondition(withFocus(
    TextInput
  ), ['hide', 'show'], [false, false]
  ), ['style', 'errorStyle']
  ), ['placeholder']
)
