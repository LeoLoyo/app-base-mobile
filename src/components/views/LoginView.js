import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import qs from 'qs'
import {has, get} from 'lodash'
import * as COMPONENTS from '../../components'
import {withNavigation} from 'react-navigation'
import withConfig from '../../core/withConfig'
import withToast from '../../core/withToast'
import {setAccessToken} from '../../core/Auth'

class Component extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.state = {
      loading: false
    }
  }
  onSubmit (values) {
    const handleError = ({response}) => {
      this.setState({loading: false}, () => {
        if (has(response, 'data.error.message') && has(response, 'data.error.code')) {
          handleRequest({limit_code: get(response, 'data.error.code')})
          // this.props.toast.error(`%toast_${response.data.error.message}%`)
        } else {
          this.props.toast.error('%toast_invalid_credentials%')
        }
      })
    }

    const handleSuccess = ({data}) => {
      this.setState({loading: false}, () => {
        setAccessToken(data).then(() => {
          this.props.navigation.navigate(this.props.config.auth.viewOnLoginSuccess)
        })
      })
    }

    const handleRequest = (extra = {}) => {
      this.setState({loading: true}, () => {
        axios.post(this.props.config.auth.getTokenURL,
          qs.stringify({
            ...values, // values coming from the form fields
            ...extra,
            'grant_type': 'password'
          }
          ), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'x-client-id': this.props.config.auth.clientID
            }
          })
          .then(handleSuccess)
          .catch(handleError)
      })
    }

    handleRequest()
  }

  render () {
    const {className, titleProps, imageProps, ...props} = this.props
    return (
      <COMPONENTS.KeyboardAwareView>
        <COMPONENTS.View {...titleProps}>
          <COMPONENTS.Image {...imageProps}/>
        </COMPONENTS.View>
        <COMPONENTS.Form
          className={className}
          onSubmit={this.onSubmit}
          loading={this.state.loading}
          {...props}/>
      </COMPONENTS.KeyboardAwareView>
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
      getTokenURL: PropTypes.string.isRequired,
      clientID: PropTypes.string.isRequired,
      viewOnLoginSuccess: PropTypes.string.isRequired
    })
  }),
  toast: PropTypes.object
}

export default withNavigation(withConfig(withToast(Component)))
