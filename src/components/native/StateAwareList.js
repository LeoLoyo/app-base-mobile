import React from 'react'
import PropTypes from 'prop-types'
import _get from 'lodash/get'
import List from '../views/List'
class Component extends React.Component {
  static displayName = 'StateAwareList'
  state = {
    current: -1
  }

  listRef = null

  static getDerivedStateFromProps (nextProps, prevState) {
    return {
      ...prevState,
      current: nextProps.defaultValue && prevState.current < 0
        ? nextProps.data.findIndex((item) => _get(item, nextProps.path) === nextProps.defaultValue) : prevState.current
    }
  }

  _onItemSelected = (e, {value = '', index = -1, ...rest}) => {
    this.setState({current: this.props.data.findIndex((item, index) => _get(item, this.props.path) === value)}, () => {
      if (typeof this.props.onItemSelected === 'function') {
        this.props.onItemSelected(value)
      }
    })
  }

  shouldComponentUpdate (nextProps, nextState) {
    return this.state.current !== nextState.current
  }

  _isActive = (current = this.state.current) => (index) => {
    return index === current
  }

  render () {
    const {current} = this.state
    return (
      <List
        {...this.props}
        innerRef={(listRef) => (this.listRef = listRef)}
        itemProps={{
          ...this.props.itemProps,
          onItemSelected: this._onItemSelected,
          isActive: this._isActive(current),
          currentActive: current,
          validateItemFocus: true
        }}
      />
    )
  }
}

Component.propTypes = {
  className: PropTypes.string,
  itemProps: PropTypes.object,
  components: PropTypes.array,
  defaultValue: PropTypes.any,
  loading: PropTypes.bool,
  data: PropTypes.array,
  queryValue: PropTypes.string,
  children: PropTypes.node,
  responseName: PropTypes.string,
  onItemSelected: PropTypes.func,
  path: PropTypes.string
}

Component.defaultProps = {
  path: 'image'
}

export default Component
