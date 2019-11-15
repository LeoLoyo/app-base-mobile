
/**
 * Libraries
 */
import React from 'react'
import PropTypes from 'prop-types'
import {get, filter} from 'lodash'
/**
 * Main component
 *
 */
export default function (WrappedComponent, filterProps) {
  /**
   * Main component
   */
  class Component extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        query: ''
      }
      this.filterProps = {
        onChangeText: this.onChangeText
      }
    }

    onChangeText = (input) => {
      this.setState({query: input})
    }

    _getProps = () => {
      const {filterProps} = this.props
      const {query} = this.state
      const data = get(this.props, filterProps.field, [])
      const newProps = {
        [filterProps.key]: {
          ...this.filterProps,
          ...this.props[filterProps.key]
        },
        [filterProps.field]: query.length ? filter(data, (item) => get(item, filterProps.match, '').match(query)) : data
      }
      return newProps
    }

    render () {
      return <WrappedComponent {...this.props} {...this._getProps()} />
    }
  }

  /**
   * Props
   */
  Component.propTypes = {
    filterProps: PropTypes.object
  }

  Component.defaultProps = {
    filterProps: {
      key: 'filterProps',
      field: 'filterData'
    }
  }

  return Component
}
