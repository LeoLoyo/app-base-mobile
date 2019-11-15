import React from 'react'
import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import PropTypes from 'prop-types'
import qs from 'qs'
import withConfig from '../../core/withConfig'
import withToast from '../../core/withToast'
import withCustomComponent from '../../core/withCustomComponent'
import {$get, $post} from '../../core/SignupService'
import Loading from '../native/Loading'
import Picker from '../native/Picker'
import NavigatorService from '../../core/NavigatorService'

class IntegratorQuerier extends React.Component {
  constructor (props) {
    super(props)
    this.handleFirsStep = this.handleFirsStep.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }
  state = {
    selected: 'none',
    loading: false,
    options: [],
    step: 0,
    form: {
      integrator: {},
      steps: [],
      currentStep: 0
    }
  }
  componentDidMount () {
    const {config, valuePath, labelPath} = this.props
    if (config.auth.getIntegratorsURL && config.auth.clientID && config.integrators) {
      this.setState({loading: true})
      $get(
        config.auth.getIntegratorsURL,
        {'x-client-id': config.auth.integratorClientID || config.auth.clientID}
      )
        .then(({data}) => this.setState({
          loading: false,
          options: (data || [])
            .map(({name, ...item}) => Object.assign({}, (config.integrators || [])
              .find((item) => name === item.value), item)
            )
            .filter((item) => item)
            .map((item, index) => ({label: get(item, valuePath), value: `${get(item, labelPath)}-${index}`, raw: item}))
        }, () => {
          if (!size(this.state.options)) { this.props.toast.error(`%toast_no_integrator_list_error%`) }
        }))
        .catch((err) => {
          this.setState({loading: false})
          console.error(err)
        })
    }
  }

  handleFirsStep (selected) {
    if (selected) {
      const integrator = this.state.options.find(({value}) => selected === value)

      const inputs = ({type, name, label, regex, required}) => ({
        ...this.props.input,
        name,
        props: {
          ...this.props.input.props,
          label: {
            ...this.props.input.props.label,
            text: label
          }
        }
      })

      const steps = get(integrator, `formSteps`, [])
      this.setState({
        selected: selected,
        step: 1,
        form: {
          integrator: integrator,
          steps: map(steps, ({fields, action}) => ({
            fields: (fields || []).map(inputs),
            action
          })),
          currentStep: 0
        }
      })
    }
  }

  handleFormSubmit (values) {
    const {form, selected} = this.state
    const {action} = get(form.steps, form.currentStep)
    if (form.currentStep !== size(form.steps)) {
      this.setState({loading: true}, () => {
        $post(
          `${this.props.config.auth.getIntegratorsURL}${selected}`,
          qs.stringify({
            action,
            ...values
          }),
          {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-client-id': this.props.config.auth.clientID
          }
        )
          .then(({data, status}) => {
            this.setState({loading: false}, () => {
              if (data && data.data.access) {
                return NavigatorService.navigate(this.props.authSuccessView,
                  {integrator: data.data.integratorId})
              }

              this.props.toast.error(`%toast_${selected}_no_access%`)
            })
          })
          .catch((err) => {
            this.setState({loading: false}, () => {
              this
                .props
                .toast
                .error(`%toast_${selected}_${(err.response.data.error || '').toLowerCase()}%`)
            })
          })
      })
    }
  }

  render () {
    const {LoaderComponent = Loading, OptionsComponent = Picker, children, ...props} = this.props
    if (this.state.loading) return <LoaderComponent />
    if (this.state.options || this.props.force) {
      return <OptionsComponent {...props}
        isForced={this.props.force} options={this.state.options}/>
    }
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, props)
      }
      return child
    })
  }
}

IntegratorQuerier.propTypes = {
  authSuccessView: PropTypes.string,
  config: PropTypes.object,
  children: PropTypes.any,
  form: PropTypes.object,
  force: PropTypes.bool,
  input: PropTypes.object,
  picker: PropTypes.object,
  LoaderComponent: PropTypes.func,
  OptionsComponent: PropTypes.object,
  toast: PropTypes.object,
  valuePath: PropTypes.any,
  labelPath: PropTypes.any
}

export default withCustomComponent(withConfig(withToast(IntegratorQuerier)),
  ['LoaderComponent', 'NoDataComponent', 'OptionsComponent'])
