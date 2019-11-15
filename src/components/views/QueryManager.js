import React from 'react'
import withNavigation from '../../core/withNavigation'
import withCustomComponent from '../../core/withCustomComponent'
import PropTypes from 'prop-types'
import {ApolloConsumer} from 'react-apollo'

class QueryManager extends React.Component {
  render () {
    const {Component} = this.props
    if (!Component) return null
    return (
      <ApolloConsumer>
        {this.props.children}
      </ApolloConsumer>
    )
  }
}

QueryManager.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  Component: PropTypes.func
}

export default withNavigation(withCustomComponent(QueryManager, ['Component']))
