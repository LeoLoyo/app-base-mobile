/**
 * Libraries
 */
import React from 'react'
import PropTypes from 'prop-types'
import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import set from 'lodash/set'
import each from 'lodash/each'
import merge from 'lodash/merge'
import withNavigation from './withNavigation'
import Reloadable from './Reloadable'
/**
 * Main component
 *
 */
export default function (WrappedComponent) {
  /**
   * Main component
   */
  class Component extends React.Component {
    static defaultProps = {
      variables: {},
      paginated: false,
      pollInterval: 0
    }

    endReached = false
    data = {}

    constructor (props) {
      super(props)
      this.query = null
      this.variables = null
      this.policy = null
      this.loading = 0
      this.otherProps = {}
      if (props.pollInterval) {
        this.pollInterval = props.pollInterval
      }
      this.createQuery(props)
    }

    componentDidUpdate () {
      this.loading += 1
    }

    shouldComponentUpdate () {
      return this.loading % 4 === 0
    }

    createQuery (props) {
      if (typeof WrappedComponent.getQuery === 'function') {
        const query = WrappedComponent.getQuery(props)
        if (typeof query === 'object') {
          this.query = query.query
          this.variables = query.variables
          this.policy = this.policy || query.policy
          this.pollInterval = props.pollInterval || 0
        } else if (typeof query === 'string') {
          this.query = query
        }
      } else if (props.query) {
        this.query = props.query
        this.variables = merge({}, props.variables, this.variables || {})
      }
    }

    refetch = (refetchHelper, vars = {}) => {
      merge(this.variables, vars)
      refetchHelper(this.variables)
    }

    fetchMore = (fetchMoreHelper) => {
      if (!this.props.update) return
      if (!get(this.variables, 'limit', undefined)) return
      if (!get(this.variables, 'page', undefined)) return
      if (this.props.update.every((path) => get(this.data, path, [])
        .length < this.variables.limit)) return
      set(this.variables, 'page', get(this.variables, 'page', 0) + 1)
      try {
        fetchMoreHelper({
          variables: {
            page: get(this.variables, 'page', 0)
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (isEmpty(prev)) prev = this.data
            if (!fetchMoreResult) return prev
            const {update = []} = this.props
            const newData = {}
            try {
              this.endReached = update.every((path) => get(fetchMoreResult, path, [])
                .length < this.variables.limit)
              each(update, (path) => {
                set(newData, path, [
                  ...get(prev, path, []),
                  ...get(fetchMoreResult, path, [])
                ])
              })
              return merge({}, prev, newData)
            } catch (e) {
              this.endReached = true
              return prev
            }
          }
        })
      } catch (e) {
        console.error(e)
      }
    }

    render () {
      if (this.query) {
        return (
          <Query
            query={gql`${this.query}`}
            variables={this.variables}
            fetchPolicy={this.policy || this.props.policy || 'cache-first'}
            skip={this.props.skip || false }
            pollInterval = {this.props.pollInterval || 0}
            notifyOnNetworkStatusChange
          >
            {
              ({ client, data, error, refetch, fetchMore, networkStatus }) => {
                if (isEmpty(data)) data = this.data
                this.data = data
                const fetchingMore = networkStatus === 2 || networkStatus === 3
                const loading = this.props.skip ? false : networkStatus === 1 || networkStatus === 4
                return <WrappedComponent
                  {...this.props}
                  data={data}
                  error={error}
                  loading={loading}
                  client={client}
                  fetchingMore={fetchingMore}
                  networkStatus={networkStatus}
                  refetch={(refetchVars) => this.refetch(refetch, refetchVars)}
                  fetchMore={(...vars) => this.fetchMore(fetchMore, ...vars)}
                />
              }
            }
          </Query>
        )
      }
      return <WrappedComponent {...this.props} />
    }
  }

  /**
   * Props
   */
  Component.propTypes = {
    query: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    variables: PropTypes.object,
    policy: PropTypes.string,
    withParams: PropTypes.bool,
    paginated: PropTypes.bool,
    update: PropTypes.arrayOf(PropTypes.string),
    skip: PropTypes.bool,
    pollInterval: PropTypes.number
  }

  return withNavigation(Reloadable(Component,
    ['id', '_id', 'navigation.state.params.id', 'navigation.state.params._id']))
}
