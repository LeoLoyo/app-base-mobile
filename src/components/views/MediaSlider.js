import React from 'react'
import PropTypes from 'prop-types'
import {withNavigation} from 'react-navigation'
import {get, size} from 'lodash'
import withQuery from './../../core/withQuery'
import List from './List'
import LoadingComponent from '../native/Loading'

class Component extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isLoaded: false
    }
    this.loadData = this.loadData.bind(this)
  }
  static getQuery (props) {
    const { navigation: router } = props
    const params = get(router, 'state.params', {})
    const query = get(params, 'query', `query($id: String!) { 
      getPlaylist(_id: $id) { 
        _id, name, description, medias{ _id, favorite, title, thumbnails{ default { url } } }  
      } 
    }`)
    const id = (params.parentId || params._id) || ''
    return {
      query,
      variables: {
        id: id
      }
    }
  }

  componentDidMount () {
    if (!this.state.isLoaded) {
      this.loadData()
    }
  }

  componentDidUpdate () {
    if (!this.state.isLoaded) {
      this.loadData()
    }
  }

  loadData () {
    const {navigation} = this.props
    const responseName = get(navigation, 'state.params.responseName', 'data.getPlaylist.medias')
    const data = get(this.props, responseName, [])
    if (this.props.parentProps && typeof this.props.parentProps.loadData === 'function' && size(data)) {
      this.setState({isLoaded: true}, () => {
        this.props.parentProps.loadData(data)
      })
    }
  }

  render () {
    const { navigation: router } = this.props
    const parentId = router.state.params ? (router.state.params.parentId || router.state.params._id) || '' : null
    const title = get(router, 'state.params.title', get(this.props, 'data.getPlaylist.name'))
    const responseName = get(router, 'state.params.responseName', 'data.getPlaylist.medias')
    return (
      <List
        parentProps={{parentId}}
        title={title}
        responseName={responseName}
        {...this.props}
      />
    )
  }
}

Component.propTypes = {
  navigation: PropTypes.object,
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  parentProps: PropTypes.shape({
    loadData: PropTypes.func
  })
}

export default withNavigation(withQuery(Component, LoadingComponent))
