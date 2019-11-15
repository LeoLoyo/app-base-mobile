import React from 'react'
import PropTypes from 'prop-types'
import { size, map, has, each, find, difference, get, isArray, reduce } from 'lodash'
import * as COMPONENTS from '../../components'
import validations from '../../core/utils/validations'

const validate = (rules, field, extra) => {
  return reduce(rules, (acc, rule) => {
    if (has(validations, rule)) {
      acc.push(validations[rule](field))
    }
    return acc
  }, []).filter((rule) => rule)
}

export default class Component extends React.Component {
  constructor (props) {
    super(props)

    let values = {}
    let optionals = []
    each(props.elements.map((element) => {
      if (element.name) {
        values[element.name] = '' // eslint-disable-line react/no-direct-mutation-state
      }
      if (element.optional) {
        optionals.push(element.name)
      }
    }))

    this.state = {
      optionals,
      ...values
    }
    this.optionals = optionals
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.focusNextElem = this.focusNextElement.bind(this)
    this.isValidForm = this.isValidForm.bind(this)
    this.inputRefs = {}
  }

  componentDidMount () {
    if (typeof this.props.initializeForm === 'function') {
      const data = this.props.initializeForm()
      each(this.props.elements, (element, key) => {
        const value = element.type === 'number' ? parseInt(get(data, element.name)) : get(data, element.name)
        const options = get(element, 'props.options', {})
        this.handleChange(element.name, value, isArray(options) ? get(options, `${value}.options`) : options)
      })
    }
  }

  handleChange (name, value, options) {
    let newState = {[name]: value}
    if (options) {
      if (has(options, 'toggleOptionals')) {
        newState.optionals = difference(options.toggleOptionals, this.state.optionals)
      }

      if (has(options, 'removeOptionals')) {
        newState.optionals = this.optionals
      }
    }
    this.setState(newState)

    return value
  }

  handleSubmit () {
    if (typeof this.props.onSubmit === 'function' && this.isValidForm()) {
      return this.props.onSubmit(this.state)
    }
    return null
  }

  focusNextElement (element) {
    if (has(this.inputRefs, element)) {
      this.inputRefs[element].focus()
    }
  }

  isValidForm () {
    const errors = map(this.props.elements, (element, key) => {
      return validate(element.props.rules, this.state[element.name])
    })
    return !size([].concat.apply([], errors))
  }
  render () {
    const {elements} = this.props
    return (
      <COMPONENTS.View className={this.props.className}>
        {
          elements.map((element, i) => {
            const FormElement = COMPONENTS[element.component]
            if ((typeof FormElement === 'function') && element.name) {
              const props = element.props || {}
              const isLastInput = i === (size(elements) - 1)
              return (
                <FormElement
                  key={i}
                  {...props}
                  shouldRender={!find(this.state.optionals, (item) => item === element.name)}
                  name={element.name}
                  value={this.state[element.name]}
                  elementRef = {(ref) => { this.inputRefs[element.name] = ref } }
                  onSubmitEditing={() => isLastInput ? this.handleSubmit() : this.focusNextElem(elements[i + 1].name) }
                  onChange={(input, options) => this.handleChange(element.name, input[element.name], options)}
                  onChangeText={(input) => this.handleChange(element.name, input[element.name], {})}
                  error={validate(props.rules, this.state[element.name])}
                />
              )
            }
            return null
          })
        }
        <COMPONENTS.Button
          disabled={!this.isValidForm()}
          loading={this.props.loading}
          onPress={this.handleSubmit}
          {...this.props.submitProps} />
      </COMPONENTS.View>
    )
  }
}

Component.propTypes = {
  className: PropTypes.string,
  elements: PropTypes.array,
  initializeForm: PropTypes.func,
  onSubmit: PropTypes.func,
  submitProps: PropTypes.object,
  loading: PropTypes.bool,
  TitleComponent: PropTypes.object
}

Component.defaultProps = {
  elements: [],
  submitProps: {},
  loading: false
}
