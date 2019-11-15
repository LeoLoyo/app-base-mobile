import React, {cloneElement} from 'react'
import PropTypes from 'prop-types'
import memorize from 'memoize-one'

import _isString from 'lodash/isString'
import _set from 'lodash/set'
import _isUndefined from 'lodash/isUndefined'
import _merge from 'lodash/merge'
import _overSome from 'lodash/overSome'
import _each from 'lodash/each'
import _isArray from 'lodash/isArray'
import _get from 'lodash/get'

import IconThemeButton from './IconThemeButton'
import Button from './Button'
import Input from './Input'
import TextInput from './TextInput'
import DateInput from './DateInput'
import StateAwareList from './StateAwareList'
import Picker from './Picker'
import CheckBox from './CheckBox'
import ModalInput from '../views/ModalInput'
import CountrySelector from '../views/CountrySelector'
import Slider from './Slider'
import KeyboardAwareView from './KeyboardAwareView'
import validationUtils from '../../core/utils/validations'
import withStorage from '../../core/withStorage'

const emptyError = []

class Form extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    onSubmit: PropTypes.func,
    onError: PropTypes.func,
    loading: PropTypes.bool,
    shouldResize: PropTypes.bool,
    storage: PropTypes.object
  }

  static defaultProps = {
    onError: () => {},
    onSubmit: () => {},
    shouldResize: true
  }

  preValidationErrorHolder = {}
  references = {}
  omitted = {}
  memorizers = {}

  constructor (props) {
    super(props)
    this.state = {
      loading: props.loading,
      storage: props.storage,
      validate: false,
      values: {}
    }
  }

  componentDidMount (props) {
    const updatedState = {
      values: this._getInitialFormState(props)
    }

    // setting focus refs
    Object.keys(this.references).forEach((name, index, array) => {
      if (index > 0) {
        const prevName = array[index - 1]
        updatedState.values[prevName].returnKeyType = 'next'
        updatedState.values[prevName].onSubmitEditing = () =>
          this.references[name] && typeof this.references[name].focus === 'function'
            ? this.references[name].focus()
            : console.warn(`There is no reference for ${name}`)
      }
    })

    this.setState(updatedState)
  }

  _getInitialFormState = (props = this.props) => {
    let values = {}
    const {storage} = this.props
    React.Children.toArray(props.children).forEach(child => {
      if (!React.isValidElement(child)) return
      if (!this._isFormComponent(child)) {
        values = {...values, ...this._getInitialFormState(child.props)}
        return
      }

      const {name, shouldRemember = false} = child.props
      values[name] = {shouldRemember}
      values[name].element = child
      if (this._isDateInput(child)) {
        values[name].errors = emptyError
        values[name].value = this._getCurrentTextValue(child)
        values[name].onDateChange = this._combinedOnChangeDateFactory(child)
        this._setPreValidationErrorHolder(name, this._validate(child, values[name].value))
      }

      if (this._isCheckBox(child)) {
        values[name].value = this._getCheckboxValue(child)
        values[name].onClick = this._combinedOnChangeCheckboxFactory(child)
        values[name].updateFromStorage = this._combinedOnChangeCheckboxFactory(child)
        this._setPreValidationErrorHolder(name, this._validate(child, values[name].value))
      }

      if (this._isList(child)) {
        values[name].errors = emptyError
        values[name].onItemSelected = this._onItemClick(child)
        values[name].value = this._getPickervalue(child)
        this._setPreValidationErrorHolder(name, this._validate(child, values[name].value))
      }

      if (this._isPicker(child)) {
        values[name].errors = emptyError
        values[name].value = this._getPickervalue(child)
        values[name].onOptionSelected = this._onItemClick(child)
        this._setPreValidationErrorHolder(name, this._validate(child, values[name].value))
      }

      if (this._isSlider(child)) {
        values[name].errors = emptyError
        values[name].value = this._getPickervalue(child)
        values[name].onValueChange = this._combinedOnChangeSliderValueFactory(child)
        this._setPreValidationErrorHolder(name, this._validate(child, values[name].value))
      }

      if (this._isModalInput(child)) {
        values[name].value = this._getPickervalue(child)
        values[name].onOptionSelected = this._onItemClick(child)
        values[name].onHideChange = this._onHideChange(name)
        values[name].onShowChange = this._onShowChange(name)
        this._setPreValidationErrorHolder(name, this._validate(child, values[name].value))
      }

      if (this._isCountrySelector(child)) {
        values[name].value = this._getPickervalue(child)
        values[name].onOptionSelected = this._onItemClick(child)
        values[name].onHideChange = this._onHideChange(name)
        values[name].onShowChange = this._onShowChange(name)
        this._setPreValidationErrorHolder(name, this._validate(child, values[name].value))
      }

      if (this._isInput(child)) {
        this.references[name] = null
        values[name].editable = !this.props.loading
        values[name].errors = emptyError
        values[name].value = this._getCurrentTextValue(child)
        values[name].onChangeText = this._combinedOnChangeTextFactory(child)
        values[name].elementRef = (ref) => (this.references[name] = ref)
        values[name].returnKeyType = 'go'
        values[name].onSubmitEditing = this.submit
        values[name].onHideChange = this._onHideChange(name)
        values[name].onShowChange = this._onShowChange(name)
        this._setPreValidationErrorHolder(name, this._validate(child, values[name].value))
      }

      if (this._isSubmitButton(child)) {
        values[name].onPress = this._combineSubmitButtonOnPressFactory(child)
        values[name].loading = this.props.loading
        values[name].disabled = this.props.loading
      }

      if (this._isResetButton(child)) {
        values[name].onPress = this._combineResetButtonOnPressFactory(child)
      }

      if (shouldRemember && storage && storage[name]) values[name].value = storage[name]
    })

    return values
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (prevState.loading === nextProps.loading) return null
    return {
      loading: nextProps.loading,
      values: Object.keys(prevState.values).reduce((acc, name) => {
        acc[name] = {
          ...prevState.values[name],
          loading: nextProps.loading,
          disabled: nextProps.loading,
          editable: !nextProps.loading
        }
        return acc
      }, {})
    }
  }

  /**
   * maps input values
   * @param {Node} children react component children
   * @returns {object} results
   */
  _getResults = (children) => Object.keys(this.state.values).reduce((acc, key) => {
    if (this.state.values[key].value !== undefined && this._shouldIncludeResult(key)) {
      acc[key] = _isString(this.state.values[key].value)
        ? String(this.state.values[key].value).trim()
        : this.state.values[key].value
    }
    return acc
  }, {})

  _onHideChange = (key) => (value) => _set(this.omitted, `${key}.hide`, value)
  _onShowChange = (key) => (value) => _set(this.omitted, `${key}.show`, value)
  _shouldIncludeResult = (key) => {
    const hide = _get(this.omitted, `${key}.hide`, undefined)
    const show = _get(this.omitted, `${key}.show`, undefined)
    let result = true
    if (!_isUndefined(hide)) result = !hide
    else if (!_isUndefined(show)) result = show
    return result
  }

  /**
   * test inputs for errors and dispatches onError or onSubmit events
   * @returns {*} nothing
   */
  submit = () => {
    const {children, onSubmit, onError} = this.props
    if (!this.state.validate) this._setValidateState()
    const errorHolder = this.state.validate ? this.state.values : this.preValidationErrorHolder
    const errorList = this._getErrors(errorHolder)
    if (Object.keys(errorList).length > 0) return onError(errorList)
    const results = this._getResults(children)
    this._saveData(results)
    onSubmit(results, children)
  }

  _saveData = (data) => {
    const {storage} = this.state
    const {remember} = data
    const toRemember = Object.keys(data).reduce((acc, key) => {
      remember && _get(this.state, `values.${key}.shouldRemember`) && (acc[key] = data[key])
      !remember && typeof _get(storage, key) !== 'undefined' && (acc[key] = null)
      return acc
    }, {})
    Promise.resolve(_get(this.props, 'storageSave')(toRemember))
  }

  _setValidateState = () => this.setState((prevState) => ({
    ...prevState,
    validate: true,
    values: _merge({}, prevState.values, this.preValidationErrorHolder)
  }))

  /**
   * validates input
   * @param {Node} child react component child
   * @param {string} value current input value
   * @returns {Array} errors
   */
  _validate = (child, value) => {
    let {validations = []} = child.props
    let childErrors = []

    const {values = {}} = (this.state || {})
    const results = Object.keys(values).reduce((acc, key) => {
      if (values[key].hasOwnProperty('value')) {
        acc[key] = values[key].value
      }
      return acc
    }, {})

    validations.forEach((validation) => {
      let hasError = false
      if (validation.includes(':')) {
        const [type, condition] = validation.split(':')
        hasError = validationUtils[type](value, condition, results)
      } else {
        hasError = validationUtils[validation](value)
      }
      if (hasError) childErrors.push(validation)
    })
    return childErrors.length === 0 ? emptyError : childErrors
  }

  _setPreValidationErrorHolder = (name, errors) => {
    return _set(this.preValidationErrorHolder, `${name}.errors`, errors)
  }
  _getErrors = (errorHolder) => Object.keys(errorHolder).reduce((acc, key) => {
    // //console.log('errors should be included', key, this._shouldIncludeResult(key))
    if (this._shouldIncludeResult(key)) { // revisar aca
      const errors = errorHolder[key].errors
      if (Array.isArray(errors) && errors.length > 0) acc[key] = errors
    }
    return acc
  }, {})

  /**
   * combines all possible input value sources
   * @param {Node} child react component child
   * @returns {String} input current value
   */
  _getCurrentTextValue = (child) => {
    const {storage} = this.props
    const {
      name,
      defaultValue,
      shouldRemember,
      value = storage && shouldRemember ? storage[name] : undefined} = child.props
    let val = ''
    typeof defaultValue !== 'undefined' && (val = defaultValue)
    typeof _get(this.state, `values.${name}.value`, undefined) !== 'undefined' && (val = this.state.values[name].value)
    typeof value !== 'undefined' && (val = value)
    return val
  }

  _getCheckboxValue = (child) => {
    const {storage} = this.props
    const {
      name,
      defaultValue,
      shouldRemember,
      value = storage && shouldRemember ? storage[name] : undefined} = child.props
    let val = false
    typeof defaultValue !== 'undefined' && (val = defaultValue)
    typeof _get(this.state, `values.${name}.value`, undefined) !== 'undefined' && (val = this.state.values[name].value)
    typeof value !== 'undefined' && (val = value)
    return val
  }

  _getPickervalue = (child) => {
    const {storage} = this.props
    const {
      name,
      defaultValue,
      shouldRemember,
      value = storage && shouldRemember ? storage[name] : undefined} = child.props
    let val = ''
    typeof defaultValue !== 'undefined' && (val = defaultValue)
    typeof _get(this.state, `values.${name}.value`, undefined) !== 'undefined' && (val = this.state.values[name].value)
    typeof value !== 'undefined' && (val = value)
    return val
  }

  _isSubmitButton = (child) => ~[IconThemeButton, Button].indexOf(child.type) && child.props.type === 'submit'
  _isResetButton = (child) => ~[IconThemeButton, Button].indexOf(child.type) && child.props.type === 'reset'
  _isInput = (child) => child.type === Input || child.type === TextInput || child.props.type === 'input'
  _isDateInput = (child) => child.type === DateInput || child.props.type === 'date-input'
  _isList = (child) => child.type === StateAwareList || child.props.type === 'input-list'
  _isPicker = (child) => child.type === Picker
  _isCheckBox = (child) => child.type === CheckBox
  _isModalInput = (child) => child.type === ModalInput
  _isCountrySelector = (child) => child.type === CountrySelector
  _isSlider = (child) => child.type === Slider || child.props.type === 'slider'
  _isFormComponent = _overSome([
    this._isInput, this._isDateInput, this._isCheckBox,
    this._isList, this._isPicker, this._isSubmitButton,
    this._isResetButton, this._isModalInput, this._isCountrySelector,
    this._isSlider
  ])
  _mapComponentProps = (child) => this._isFormComponent(child)
    ? cloneElement(child, this.state.values[child.props.name])
    : child
  _combineSubmitButtonOnPressFactory = (child) => (e) => {
    const {onPress = () => {}} = child.props
    this.submit()
    onPress(e)
  }

  _combineResetButtonOnPressFactory = (child) => (e) => {
    const {onPress = () => {}, resetFields} = child.props
    this._clean(resetFields)
    onPress(e)
  }

  /**
   * child state handling (TextInput)
   */
  _combinedOnChangeTextFactory = (child) => (e) => {
    const {name, onChangeText = () => {}} = child.props
    if (name) {
      let errors = this._validate(child, e)
      if (!this.state.validate) {
        this._setPreValidationErrorHolder(name, errors)
        errors = emptyError
      }
      this.setState((prevState) => ({
        values: {
          ...prevState.values,
          [name]: {
            ...prevState.values[name],
            value: e,
            errors
          }
        }
      }))
    }
    onChangeText(e)
  }

  /**
   * child state handling (DateInput)
   */

  _combinedOnChangeDateFactory = (child) => (date) => {
    const {name, onDateChange = () => {}} = child.props
    if (name) {
      let errors = this._validate(child, date)
      if (!this.state.validate) {
        this._setPreValidationErrorHolder(name, errors)
        errors = emptyError
      }

      this.setState((prevState) => ({
        values: {
          ...prevState.values,
          [name]: {
            ...prevState.values[name],
            value: date,
            errors
          }
        }
      }), () => {
        //
      })
    }
    onDateChange(date)
  }

  /**
   * child state handling (Slider)
   */

  _combinedOnChangeSliderValueFactory = (child) => (value) => {
    const {name, onValueChange = () => {}} = child.props
    if (name) {
      let errors = this._validate(child, value)
      if (!this.state.validate) {
        this._setPreValidationErrorHolder(name, errors)
        errors = emptyError
      }

      this.setState((prevState) => ({
        values: {
          ...prevState.values,
          [name]: {
            ...prevState.values[name],
            value,
            errors
          }
        }
      }))
    }
    onValueChange(value)
  }

  /**
   * child state handling (Checkbox)
   */
  _combinedOnChangeCheckboxFactory = (child) => (value) => {
    const {name, onClick = () => {}} = child.props
    let errors = []

    if (name) {
      this.setState((prevState) => ({
        values: {
          ...prevState.values,
          [name]: {
            ...prevState.values[name],
            value,
            errors
          }
        }
      }))
    }
    onClick(value)
  }

  _onItemClick = (child) => (value) => {
    const {name} = child.props
    let errors = this._validate(child, value)
    if (!this.state.validate) {
      this._setPreValidationErrorHolder(name, errors)
      errors = emptyError
    }

    if (name) {
      this.setState((prevState) => ({
        values: {
          ...prevState.values,
          [name]: {
            ...prevState.values[name],
            value,
            errors
          }
        }
      }))
    }
  }

  _clean = (fields = Object.keys(_get(this.state, 'values', {}))) => {
    _each(fields, (field) => {
      const value = _get(this.state, `values.${field}.defaultValue`, '')
      const element = _get(this.state, `values.${field}.element`)
      if (!element) return
      let errors = this._validate(element, value)
      this._setPreValidationErrorHolder(field, errors)
      this.setState((prevState) => ({
        values: {
          ...prevState.values,
          [field]: {
            ...prevState.values[field],
            value,
            errors: errors
          }
        }
      }))
    })
  }

  _decidersFromFormValues = (decider) => decider.map(conditioner => {
    return {
      ...conditioner,
      if: conditioner.if.map(condition => {
        return {
          ...condition,
          field: _get(this.state.values, `${condition.field}.value`, condition.field)
        }
      })
    }
  })

  _mapComponentDeciders = (child) => {
    if (this._isFormComponent(child)) {
      let {hide, show} = child.props
      if (_isArray(hide)) child = cloneElement(child, {hide: this._decidersFromFormValues(hide)})
      if (_isArray(show)) child = cloneElement(child, {show: this._decidersFromFormValues(show)})
    }

    return child
  }

  _mapComponentFilters = (child) => {
    if (this._isFormComponent(child)) {
      let {filter} = child.props
      if (_isArray(filter)) {
        const newProps = filter.reduce((acc, currentFilter) => {
          const {key, by, field} = currentFilter
          const data = _get({...child.props, ...acc}, key, undefined)
          if (_isArray(data)) {
            const formElement = _get(this.state.values, `${field}.value`, field)
            if (!this.memorizers[child.props.name]) {
              this.memorizers[child.props.name] = memorize((data, by, element) => data
                .filter((elem) => _get(elem, by, undefined) === element))
            }
            acc[key] = this.memorizers[child.props.name](data, by, formElement)
          }
          return acc
        }, {})
        child = cloneElement(child, newProps)
      }
    }

    return child
  }

  /**
   * Searches inputs, edit some of their props and renders them
   * @param {Node} children react component children
   * @returns {Node} react components
   */
  renderChildren = (children) => {
    return React.Children.map(children, child => {
      if (!React.isValidElement(child)) {
        return child
      }

      child = this._mapComponentProps(child)
      child = this._mapComponentDeciders(child)
      child = this._mapComponentFilters(child)
      if (child.props.children) return cloneElement(child, {children: this.renderChildren(child.props.children)})
      return child
    })
  }

  render () {
    const {children, shouldResize, ...props} = this.props
    return shouldResize ? (
      <KeyboardAwareView {...props}>
        {this.renderChildren(children)}
      </KeyboardAwareView>
    ) : this.renderChildren(children)
  }
}

export default withStorage(Form)
