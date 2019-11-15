import React from 'react'
import PropTypes from 'prop-types'
import {get, merge} from 'lodash'
import qs from 'qs'
import withConfig from '../../core/withConfig'
import withToast from '../../core/withToast'
import { withNavigation } from 'react-navigation'
import {$post} from '../../core/SignupService'
import * as COMPONENTS from '../../components'
import {setAccessToken} from '../../core/Auth'

class Component extends React.Component {
  state = {}

  componentDidMount () {
    const integrator = get(this.props, 'navigation.state.params.integrator')
    if (integrator) {
      this.setState({integrator})
    }
  }
  handleFormSubmit = (values) => {
    const payload = this.state.integrator ? merge({}, values, {integrator: this.state.integrator}) : values
    this.setState({loading: true}, () => {
      $post(
        this.props.config.auth.authSignupURL,
        qs.stringify(payload),
        {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-client-id': this.props.config.auth.clientID
        }
      )
        .then(({data}) => {
          this.setState({loading: false}, () => {
            setAccessToken(data).then(() => {
              this.props.navigation.navigate(this.props.config.auth.viewOnLoginSuccess)
            })
          })
        })
        .catch((err) => {
          this.setState({loading: false}, () => {
            console.error(err)
          })
        })
    })
  }

  render () {
    return (
      <COMPONENTS.View className={this.props.className}>
        {React.Children.map(this.props.children, (child) => React.cloneElement(child, {
          onSubmit: (values) => this.handleFormSubmit(values)
        }))}
      </COMPONENTS.View>
    )
  }
}

Component.propTypes = {
  className: PropTypes.string,
  config: PropTypes.object,
  children: PropTypes.array,
  form: PropTypes.object,
  input: PropTypes.object,
  toast: PropTypes.object,
  navigation: PropTypes.object
}

export default withNavigation(withConfig(withToast(Component)))
