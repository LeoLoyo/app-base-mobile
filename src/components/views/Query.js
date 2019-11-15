import React from 'react'
import _get from 'lodash/get'
import PropTypes from 'prop-types'
import withQuery from './../../core/withQuery'
import Loading from '../native/Loading'
import PropsManager from '../native/PropsManager'
import {CustomComponentProvider} from '../../core/withCustomComponent'

class QueryWrapper extends React.PureComponent {
  render () {
    const {data, defaultResponse = {}, ...props} = this.props
    return (
      <CustomComponentProvider {...props} components={['LoaderComponent']}>
        {({LoaderComponent = Loading}) => {
          /**
           * Render Component Loading
           */
          if (this.props.loading) return <LoaderComponent />
          /**
           * Render Children with Response
           */
          return (
            <PropsManager {...props} {..._get(this.props, this.props.responseName, defaultResponse)}>
              {this.props.children}
            </PropsManager>
          )
        }}
      </CustomComponentProvider>
    )
  }
}

QueryWrapper.propTypes = {
  className: PropTypes.string,
  components: PropTypes.array,
  loading: PropTypes.bool,
  data: PropTypes.object,
  queryValue: PropTypes.string,
  children: PropTypes.node,
  responseName: PropTypes.string.isRequired,
  LoaderComponent: PropTypes.string,
  defaultResponse: PropTypes.any,
  pollInterval: PropTypes.any
}

export default withQuery(QueryWrapper)
