import React from 'react'
import { Picker as NativeBasePicker, Icon } from 'native-base'
import { Picker } from 'react-native'
import PropTypes from 'prop-types'
import withStyle from '../../core/withStyle'
import withTranslation from '../../core/withTranslation'
import withFocus from '../../core/withFocus'

class Component extends React.Component {
  _onOptionSelected = (value, pos) => {
    if (typeof this.props.onOptionSelected === 'function') {
      this.props.onOptionSelected(value, pos)
    }

    if (this.props.setContext && typeof this.props._setContext === 'function') {
      this.props._setContext({
        [this.props.setContext]: {
          value,
          item: (this.props.options || []).find((_, index) => index === pos),
          pos
        }
      })
    }
  }

  render () {
    const { nativeBase, defaultOption, defaultValue, value, options = [], iconProps, ...props } = this.props
    let ComponentPicker = Picker
    if (nativeBase) ComponentPicker = NativeBasePicker
    const values = defaultOption ? [defaultOption, ...options] : options
    return (
      <ComponentPicker
        {...props}
        iosIcon={<Icon name="arrow-down" />}
        style={{ width: undefined }}
        selectedValue={value || defaultValue}
        onValueChange={this._onOptionSelected}
      >
        {(values).map(({label, value}) => <ComponentPicker.Item key={value} label={label} value={value} />)}
      </ComponentPicker>
    )
  }
}

Component.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  onOptionSelected: PropTypes.func,
  options: PropTypes.array,
  errors: PropTypes.array,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  errorStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  setContext: PropTypes.any,
  _setContext: PropTypes.func,
  nativeBase: PropTypes.bool,
  iconProps: PropTypes.object,
  defaultOption: PropTypes.object
}

Component.defaultProps = {
  options: [],
  style: {height: 30, width: 250},
  iconProps: {},
  nativeBase: false,
  defaultOption: [{
    label: 'Seleccione',
    value: null
  }]
}

export default withFocus(withStyle(
  withTranslation(Component, ['placeholder']),
  ['style', 'errorStyle']
))
