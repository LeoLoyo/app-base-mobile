import React from 'react'
import _get from 'lodash/get'
import PropTypes from 'prop-types'
import withQuery from '../../core/withQuery'
import PropsManager from '../native/PropsManager'
import { CustomComponentProvider } from '../../core/withCustomComponent'
import Reloadable from '../../core/Reloadable'
class Component extends React.PureComponent {
  static displayName = 'SearchQueryView';

  render () {
    const { responseName, defaultResponse = [], ...props } = this.props
    const data = _get(this.props, `data.${responseName}`, defaultResponse)
    const hasContent = _get(data, 'length') || _get(data, 'data.length')

    return (
      <CustomComponentProvider {...props} components={['LoaderComponent', 'NoDataComponent']} >
        {({ LoaderComponent, NoDataComponent }) => {
          if (this.props.loading) {
            return LoaderComponent && <LoaderComponent {...this.props.loadingProps}/>
          }
          if (!this.props.skip && !hasContent && !this.props.loading) {
            return NoDataComponent && <NoDataComponent error={props.error} refetch={props.refetch}/>
          }

          return (
            <PropsManager {...props} data={data}>
              {this.props.children}
            </PropsManager>
          )
        }}
      </CustomComponentProvider>
    )
  }
}

Component.propTypes = {
  className: PropTypes.string,
  components: PropTypes.array,
  loading: PropTypes.bool,
  loadingProps: PropTypes.object,
  data: PropTypes.object,
  queryValue: PropTypes.string,
  children: PropTypes.node,
  responseName: PropTypes.string.isRequired,
  LoaderComponent: PropTypes.string,
  NoDataComponent: PropTypes.string,
  defaultResponse: PropTypes.any,
  skip: PropTypes.bool
}
Component.defaultProps = {
  LoaderComponent: 'Loading',
  NoDataComponent: 'View',
  loadingProps: {}
}

export default Reloadable(withQuery(Component), 'variables.query')
