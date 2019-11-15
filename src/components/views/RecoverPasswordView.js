import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import qs from 'qs'
import * as COMPONENTS from '../../components'
import {withNavigation} from 'react-navigation'
import withConfig from '../../core/withConfig'
import withToast from '../../core/withToast'

class Component extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.state = {
      loading: false
    }
  }
  onSubmit (values) {
    try {
      this.setState({loading: true}, () => {
        axios.post(this.props.config.auth.recoverPasswordURL,
          qs.stringify({
            ...values, // values coming from the form fields
            client_id: this.props.config.auth.clientID
          }
          ), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'x-client-id': this.props.config.auth.clientID
            }
          }).then(({data}) => {
          this.setState({loading: false}, () => {
            this.props.toast.info('%toast_forgot_password_request_success%')
            this.props.navigation.goBack()
          })
        })
          .catch((err) => {
            this.setState({loading: false}, () => {
              console.error(err)
              this.props.toast.error('%toast_invalid_email%')
            })
          })
      })
    } catch (error) {
      this.setState({loading: false})
    }
  }

  render () {
    const {className, ...props} = this.props
    return (
      <COMPONENTS.Form
        className={className}
        onSubmit={this.onSubmit}
        loading={this.state.loading}
        {...props}/>
    )
  }
}

Component.propTypes = {
  className: PropTypes.string,
  imageProps: PropTypes.object,
  navigation: PropTypes.object,
  titleProps: PropTypes.object,
  config: PropTypes.shape({
    auth: PropTypes.shape({
      recoverPasswordURL: PropTypes.string.isRequired,
      clientID: PropTypes.string.isRequired,
      viewOnRecoverPasswordSuccess: PropTypes.string.isRequired
    })
  }),
  toast: PropTypes.object
}

export default withNavigation(withConfig(withToast(Component)))
