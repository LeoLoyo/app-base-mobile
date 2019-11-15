import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import withConfig from '../../core/withConfig'
import { CheckSessionContext, subcribeSession } from '../../core/CheckSession'
import withNavigation from '../../core/withNavigation'
import withMutation from '../../core/withMutation'
import { withApollo } from 'react-apollo'
import Form from '../native/Form'
import defaults from 'lodash/defaults'
import includes from 'lodash/includes'
import flatten from 'lodash/flatten'
import { ErrorHandlers, SuccessHandlers, MessageHandlers, PreHandlers, PostSuccessHandlers } from '../handlers/form'

class FormView extends React.Component {
  static propTypes = {
    setContext: PropTypes.object,
    successHandler: PropTypes.string,
    successMessageHandler: PropTypes.string,
    errorHandler: PropTypes.string,
    errorMessageHandler: PropTypes.string,
    children: PropTypes.node,
    config: PropTypes.object,
    extra: PropTypes.object,
    duration: PropTypes.any,
    toastClassName: PropTypes.string,
    navigateTo: PropTypes.func,
    name: PropTypes.string.isRequired,
    mutation: PropTypes.object,
    refetchQueries: PropTypes.array,
    resetOnSuccess: PropTypes.array,
    preHandler: PropTypes.string,
    exceptions: PropTypes.array,
    isInputPayload: PropTypes.bool,
    pagination: PropTypes.any,
    _setContext: PropTypes.any,
    successMessage: PropTypes.string,
    postSuccessHandler: PropTypes.string,
    errorMessage: PropTypes.string,
    linkOnSuccess: PropTypes.string,
    isBackButton: PropTypes.bool,
    navigation: PropTypes.object,
    includeFormDatainLinkParams: PropTypes.string,
    client: PropTypes.object,
    refecthAll: PropTypes.bool
  }

  static defaultProps = {
    refecthAll: false,
    extra: {},
    exception: [],
    pagination: {
      page: 1,
      limit: 20
    },
    isInputPayload: false
  }

  static contextType = CheckSessionContext

  state = {
    loading: false,
    success: false
  }

  form = null

  onSubmit = async (rawData) => {
    this.setState(() => ({ loading: true }))
    const submitHandler = SuccessHandlers[this.props.successHandler]
    const preHandler = PreHandlers[this.props.preHandler]
    let response = null
    let payload = {}

    let data = Object.keys(rawData).reduce((acc, key) => {
      if (!includes(this.props.exceptions, key)) {
        acc[key] = rawData[key]
      }
      return acc
    }, {})

    if (preHandler) {
      data = preHandler(this.props.config, Object.assign({}, data, this.props.extra || {}), this.props)
    } else if (this.props.preHandler) {
      console.warn(`${preHandler} not found`)
    }

    if (submitHandler) {
      try {
        response = await Promise.resolve(submitHandler(this.props.config, data, this.props.extra, this.props))
        this.setState(() => ({ success: true }))
      } catch (error) {
        this.onError(error, 'external')
      }
    } else if (this.props.successHandler === 'FormWithMutation') {
      try {
        const rawPayload = Object.assign({}, data, this.props.extra || {})
        payload = {
          variables: this.props.isInputPayload ? {
            input: rawPayload,
            ...rawPayload
          } : rawPayload
        }

        if (this.props.mutation.refetchQueries) {
          payload = Object.assign({}, payload, {
            refetchQueries: flatten([this.props.mutation.refetchQueries]).map((query) => ({
              query: gql`${query}`,
              variables: {
                ...payload.variables,
                ...this.props.pagination
              }
            }))
          })
        }
        response = await this.props.mutation.action(payload)
        this.setState(() => ({ success: true }))
      } catch (error) {
        this.setState(() => ({ loading: false }))
        return this.onError(error, 'external')
      }
    } else {
      console.warn(`a handler with the name of ${this.props.successHandler} in`, { SuccessHandlers })
    }

    this.setState(
      () => ({ loading: false }),
      () => this.state.success && this.onSuccess(response, Object.assign({}, data, this.props.extra || {}))
    )
  }

  onSuccess = async (response, data) => {
    subcribeSession(this.context)
    const { successMessage = '' } = this.props
    if (this.props.successMessageHandler) {
      const messageHandler = MessageHandlers[this.props.successMessageHandler]
      if (typeof messageHandler === 'function') {
        await Promise.resolve(messageHandler(defaults({ message: successMessage }, response)))
      } else {
        console.warn(`a handler with the name of ${this.props.successMessageHandler} in`,
          { MessageHandlers })
      }
    }

    if (this.props.postSuccessHandler) {
      try {
        const postSuccessHandler = PostSuccessHandlers[this.props.postSuccessHandler]
        if (typeof postSuccessHandler === 'function') {
          await Promise.resolve(postSuccessHandler(this.props.config, { ...data, response },
            this.props.extra, this.props))
        } else {
          console.warn(`a handler with the name of ${this.props.postSuccessHandler}`)
        }
      } catch (error) {
        console.error('error', error)
        return this.onError(error, 'external')
      }
    }

    if (this.props.setContext) {
      this.props._setContext({ ...this.props.setContext, ...data })
    }

    if (this.props.resetOnSuccess) {
      this.form._clean(this.props.resetOnSuccess)
    }

    if ((this.props.linkOnSuccess || this.props.isBackButton) && response) {
      const { client: apollo, refecthAll } = this.props
      refecthAll && apollo.reFetchObservableQueries()
      this.props.isBackButton ? this.props.navigation.goBack() : this.props.navigation
        .navigate(this.props.includeFormDatainLinkParams
          ? { response, form: data }
          : this.props.linkOnSuccess)
    }
  }

  onError = async (error, type = 'local') => {
    const { duration = 0, toastClassName = '', name } = this.props
    if (this.props.errorMessageHandler) {
      const { errorMessage = '' } = this.props
      const messageHandler = MessageHandlers[this.props.errorMessageHandler]
      if (typeof messageHandler === 'function') {
        await Promise.resolve(messageHandler(defaults({ message: errorMessage }, error)))
      } else {
        console.warn(`a handler with the name of ${this.props.errorMessageHandler} in`, { MessageHandlers })
      }
    }

    const errorHandler = ErrorHandlers[this.props.errorHandler]
    if (errorHandler) {
      errorHandler(type, type === 'local' ? name : error, error, duration, toastClassName)
    }
  }

  render () {
    return (
      <Form
        innerRef={(form) => (this.form = form)} {...this.props}
        loading={this.state.loading}
        onSubmit={this.onSubmit}
        onError={this.onError}>
        {this.props.children}
      </Form>
    )
  }
}

export default withConfig(withNavigation(withMutation(withApollo(FormView), 'linkOnSuccess')))
