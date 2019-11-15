import React from 'react'
import withQuery from './../../core/withQuery'
import withHTTPErrorHandler from './../../core/withHTTPErrorHandler'
import List from './List'

class Component extends React.Component {
  render () {
    return (
      <List {...this.props} />
    )
  }
}

export default withQuery(withHTTPErrorHandler(Component))
