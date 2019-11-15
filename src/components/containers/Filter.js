import React from 'react'
import {get, filter, merge} from 'lodash'
import PropTypes from 'prop-types'
import memoize from 'memoize-one'
// https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization

const filterFn = (el, query) => (el || '').toLowerCase().indexOf(query.toLowerCase())

class Filter extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      query: ''
    }
    this.filterFn = {
      onChangeText: this.onChangeText
    }
  }

    onChangeText = (input) => {
      this.setState({query: input})
    }

    // Re-run the filter whenever the list array or filter text changes:
    filterUtil = memoize(
      (data, filterProps, query) => filter(data, (item) => filterFn(get(item, filterProps.match), query) > -1)
    );

    _getProps = () => {
      const {data, ...props} = this.props
      const {query} = this.state

      const newProps = merge({}, {
        field: 'data',
        match: 'label'
      }, props)

      return {
        [newProps.field]: this.filterUtil(data, newProps, query)
      }
    }

    render () {
      return React.Children.map(this.props.children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {...this._getProps(), ...this.filterFn})
        }
        return child
      })
    }
}

Filter.propTypes = {
  children: PropTypes.any,
  data: PropTypes.array,
  filterProps: PropTypes.object
}

Filter.defaultProps = {
  data: [],
  filterProps: {}
}

export default Filter
