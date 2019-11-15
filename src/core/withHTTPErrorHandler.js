import React from 'react'
import PropTypes from 'prop-types'
import withNavigation from './withNavigation'
import {clearAccessToken, clearProfileId} from './Auth'

export default function (WrappedComponent) {
  class Component extends React.Component {
    async componentDidUpdate () {
      const {error, client} = this.props
      if (error && error.networkError) {
        if (error.networkError.statusCode === 401) {
          await clearAccessToken()
          await clearProfileId()
          client.resetStore()
          this.props.navigation.navigate('Auth')
        }

        if (error.networkError.statusCode === 400) {

        }
      }
    }
    render () {
      return (
        <WrappedComponent {...this.props} />
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
    client: PropTypes.object
  }

  return withNavigation(Component)
}
