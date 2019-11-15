import React from 'react'
import PropTypes from 'prop-types'
import {get} from 'lodash'
import * as handlers from './utils/http'
import withConfig from './withConfig'

export default function (WrappedComponent) {
  class Component extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        loading: false,
        response: null,
        finalUrl: ''
      }
    }
    _replace (url, params) {
      const expression = /\/:[a-z]*/gi
      return String(url).replace(expression, (match) => {
        const key = String(match).substring(2)
        return `/${String(params[key] || match).split('-')[0]}`
      })
    }

    async componentDidMount () {
      const {params = {}, url, handler, config, responseName} = this.props

      if (typeof handlers[handler] === 'function') {
        try {
          this.setState({loading: true}, async () => {
            const finalUrl = this._replace(url, params)
            const response = await handlers[handler](finalUrl,
              {'x-client-id': config.auth.integratorClientID || config.auth.clientID})
            this.setState({loading: false, finalUrl, response: get(response, responseName, {})})
          })
        } catch (error) {
          this.setState({loading: false})
          console.error(error)
        }
      }
    }
    render () {
      const {loading, response, finalUrl} = this.state
      return (
        <WrappedComponent {...this.props} loading={loading} data={response} finalUrl={finalUrl}/>
      )
    }
  }

  /**
   * Props
   */
  Component.propTypes = {
    navigation: PropTypes.object,
    error: PropTypes.oneOfType([
      PropTypes.object
    ]),
    params: PropTypes.object,
    url: PropTypes.string,
    handler: PropTypes.string,
    config: PropTypes.object,
    responseName: PropTypes.string
  }

  return withConfig(Component)
}
