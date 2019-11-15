import React from 'react'
import PropTypes from 'prop-types'
import List from '../views/List'
import get from 'lodash/get'
class Component extends React.Component {
  static displayName = 'ListScroll'
  state = {
    current: -1
  }

  listRef = null

  getCurrentIndex = () => {
    const {current, data, path} = this.props
    return (data || []).findIndex((item) => get(item, path) === current)
  }

  componentDidUpdate () {
    const {offset} = this.props
    const currentIndex = this.getCurrentIndex()
    if (this.listRef && currentIndex > 0) {
      this.listRef.scrollToIndex({ animated: true, index: currentIndex, viewOffset: offset })
    }
  }

  render () {
    const {path, optionalProps, ...props} = this.props
    return (
      <List {...props} optionalProps={{...optionalProps}} innerRef={(listRef) => (this.listRef = listRef)}/>
    )
  }
}

Component.propTypes = {
  className: PropTypes.string,
  itemProps: PropTypes.object,
  optionalProps: PropTypes.object,
  offset: PropTypes.number,
  components: PropTypes.array,
  loading: PropTypes.bool,
  data: PropTypes.array,
  queryValue: PropTypes.string,
  children: PropTypes.node,
  responseName: PropTypes.string,
  onItemSelected: PropTypes.func,
  path: PropTypes.string,
  current: PropTypes.number
}

Component.defaultProps = {
  path: '_id',
  offset: -20
}

export default Component
