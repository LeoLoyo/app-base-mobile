
/**
 * Libraries
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import {get, merge} from 'lodash'

/**
 * Main component
 *
 */
export default function (WrappedComponent) {
  /**
   * Main component
   */
  class Component extends React.Component {
    constructor (props) {
      super(props)
      this.mutation = null
      this.refetchQueries = []
      if (typeof WrappedComponent.getMutation === 'function') {
        const { mutation, refetchQueries } = WrappedComponent.getMutation(props)
        this.mutation = mutation
        this.refetchQueries = refetchQueries
      } else if (props.mutation) {
        this.mutation = props.mutation.query
        this.variables = merge({}, get(props, 'navigation.state.params', {}),
          props.mutation.variables, this.variables || {})

        if (props.mutation.refetchQueries) {
          this.refetchQueries = props.mutation.refetchQueries
        }
      }
    }

    render () {
      if (this.mutation) {
        return (
          <Mutation mutation={gql`${this.mutation}`}>
            {
              (action, { data, error, loading }) => {
                return <WrappedComponent {...this.props} mutation={{
                  action: action,
                  data: data,
                  error: error,
                  loading: loading,
                  refetchQueries: this.refetchQueries }} />
              }
            }
          </Mutation>
        )
      }
      return <WrappedComponent {...this.props} />
    }
  }

  /**
   * Props
   */
  Component.propTypes = {
    mutation: PropTypes.object
  }

  Component.getMutation = WrappedComponent.getMutation

  return Component
}
