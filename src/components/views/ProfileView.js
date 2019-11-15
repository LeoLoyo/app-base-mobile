import React from 'react'
import PropTypes from 'prop-types'
import {get, has} from 'lodash'
import withQuery from '../../core/withQuery'
import withTimeLimit from '../../core/withTimeLimit'
import * as COMPONENTS from '../../components'

class Component extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ready: false
    }

    this.getData = this.getData.bind(this)
  }
  static getQuery (props) {
    return {
      query: `query { getProfile { _id, name, photo, birthday, custom } }`
    }
  }

  componentDidUpdate () {
    const data = this.getData()
    if (!this.state.ready && has(data, '_id')) {
      this.setState({ready: true}, () => {
        if (this.props.enableTimeLimit) {
          this.props.timeLimitSettings.start(get(data, 'custom', {}))
        }
      })
    }
  }

  getData () {
    const {custom, ...data} = get(this.props, 'data.getProfile', {})
    try {
      return {
        custom: JSON.parse(custom),
        ...data
      }
    } catch (error) {
      return data
    }
  }

  render () {
    return this.props.loading
      ? <COMPONENTS.Loading />
      : React.Children.map(this.props.children, child => React.cloneElement(child, { data: this.getData() }))
  }
}

Component.propTypes = {
  enableTimeLimit: PropTypes.bool,
  children: PropTypes.array,
  loading: PropTypes.bool,
  timeLimitSettings: PropTypes.object
}

export default withTimeLimit(withQuery(Component))
