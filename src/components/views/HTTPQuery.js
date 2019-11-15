import React from 'react'
import PropTypes from 'prop-types'
import withHTTPQuery from './../../core/withHTTPQuery'
import Loading from '../native/Loading'
import View from '../native/View'
import withCustomComponent from '../../core/withCustomComponent'

function HTTPQuery ({loading, LoaderComponent = Loading, ContentComponent = View, ...props}) {
  return loading ? (<LoaderComponent />) : <ContentComponent {...props} />
}

HTTPQuery.displayName = 'HTTPQueryView'

HTTPQuery.propTypes = {
  className: PropTypes.string,
  components: PropTypes.array,
  loading: PropTypes.bool,
  data: PropTypes.object,
  queryValue: PropTypes.string,
  children: PropTypes.node,
  responseName: PropTypes.string.isRequired,
  LoaderComponent: PropTypes.func,
  ContentComponent: PropTypes.func,
  defaultResponse: PropTypes.any
}

export default withCustomComponent(withHTTPQuery(HTTPQuery), ['LoaderComponent', 'NoDataComponent', 'ContentComponent'])
