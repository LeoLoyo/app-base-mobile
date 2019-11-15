import React from 'react'
import {get} from 'lodash'
import PropTypes from 'prop-types'
import withQuery from './../../core/withQuery'
import withNavigation from './../../core/withNavigation'
import * as COMPONENTS from './../../components'
import ComponentBuilder from './../../core/Wrapper'
class Component extends React.PureComponent {
  constructor (props) {
    super(props)
    this.initialize = this.initialize.bind(this)
    this._listeners = {
      initialize: this.initialize
    }
  }

  static getQuery (props) {
    const { navigation: router, query } = props
    const params = get(router, 'state.params', {})
    const id = (params.parentId || params._id || '')
    return {
      query,
      variables: {
        id: id
      }
    }
  }

  initialize () {
    return get(this.props.data, this.props.queryValue, '')
  }

  renderSection (key, component, parentProps) {
    const Component = get(COMPONENTS, component.name)
    if (typeof Component === 'function') {
      return (
        <ComponentBuilder
          key={key}
          component={component}
          {...this._listeners}
        />
      )
    }
    return null
  }

  render () {
    return !this.props.loading ? (
      <COMPONENTS.View className={this.props.className} {...this.props}>
        {(this.props.components || []).map((item, key) => this.renderSection(key, item, this.props.data))}
      </COMPONENTS.View>
    ) : <COMPONENTS.Loading />
  }
}

Component.propTypes = {
  className: PropTypes.string,
  components: PropTypes.array,
  loading: PropTypes.bool,
  data: PropTypes.object,
  queryValue: PropTypes.string
}

export default withNavigation(withQuery(Component))
