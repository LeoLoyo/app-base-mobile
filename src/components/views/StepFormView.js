import React from 'react'
import PropTypes from 'prop-types'
import {size} from 'lodash'
import withConfig from '../../core/withConfig'
import withToast from '../../core/withToast'
import * as COMPONENTS from '../../components'

class Component extends React.Component {
  constructor (props) {
    super(props)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }
  state = {
    loading: false,
    step: 0
  }

  componentDidMount () {
    this.setState({
      fields: (this.props.steps || [])
        .map((steps) => (steps.elements || []).map(({name}) => ({key: name, value: null})))
    })
  }
  renderElements () {
    const {name, elements} = this.props.steps[this.state.step]
    return {
      name,
      elements
    }
  }

  handleFormSubmit (values) {
    if (this.state.step < (size(this.props.steps) - 1)) {
      this.setState({step: this.state.step + 1}, () => {

      })
    } else if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(values)
    }
  }

  formProps () {
    const {elements} = this.renderElements()
    const {form} = this.props
    return {
      ...form,
      loading: this.state.loading,
      elements: elements,
      submitProps: {
        ...form.submitProps,
        text: this.state.step < (size(this.props.steps) - 1) ? '%wizard_btn_continue%' : '%wizard_btn_submit%'
      }
    }
  }

  handleStep (direction) {
    if (direction === 'prev') {
      this.setState({step: this.state.step - 1})
    }
  }

  render () {
    const {className, title, titleWrapper, backButton, formWrapper} = this.props
    const {name} = this.renderElements()
    return (
      <COMPONENTS.View className={className} backButton={backButton}>
        <COMPONENTS.View {...titleWrapper}>
          <COMPONENTS.Text text={name} {...title}/>
          {this.state.step ? <COMPONENTS.IconButton {...backButton} onPress={() => this.handleStep('prev')}/> : null}
        </COMPONENTS.View>
        <COMPONENTS.View {...formWrapper}>
          <COMPONENTS.FormView {...this.formProps()} onSubmit={(values) => this.handleFormSubmit(values)}/>
        </COMPONENTS.View>
      </COMPONENTS.View>
    )
  }
}

Component.propTypes = {
  backButton: PropTypes.object,
  nextButton: PropTypes.object,
  className: PropTypes.string,
  config: PropTypes.object,
  form: PropTypes.object,
  formWrapper: PropTypes.object,
  input: PropTypes.object,
  onSubmit: PropTypes.func,
  title: PropTypes.string,
  titleWrapper: PropTypes.string,
  toast: PropTypes.object,
  steps: PropTypes.array
}

export default withConfig(withToast(Component))
