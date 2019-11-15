import React from 'react'
import PropTypes from 'prop-types'
import Player from 'react-native-mediastream-player'
import {Dimensions} from 'react-native'
import {get} from 'lodash'
import * as COMPONENTS from '../../components'
import LoadingComponent from '../native/Loading'
import withQuery from './../../core/withQuery'
import withConfig from './../../core/withConfig'
import Reloadable from './../../core/Reloadable'
const {width, height} = Dimensions.get('window')

class Component extends React.PureComponent {
  static getQuery (props) {
    return {
      query: `query($id: String!) { getMedia(_id: $id) { _id, accessToken } }`,
      variables: {
        id: get(props, 'current', '')
      }
    }
  }

  state = {
    readyToPlay: false
  }

  onReady = () => {
    this.setState({readyToPlay: true})
  }

  componentWillUnmount () {
    Player.releasePlayer()
  }

  render () {
    const {config, data, ...props} = this.props
    return (
      <COMPONENTS.View className={this.props.className}>
        {this.props.loading || !this.state.readyToPlay ? <LoadingComponent/> : null }
        {!this.props.loading && <Player
          {...props}
          key='player'
          onReady={this.onReady}
          style={this.state.readyToPlay ? {flex: 1, aspectRatio: (16 / 9)} : {flex: 0}}
          environment={get(config, 'player.environment', 'production')}
          accountID={get(config, 'player.account')}
          id={get(data, 'getMedia._id')}
          accessToken={get(data, 'getMedia.accessToken')}
        />}
      </COMPONENTS.View>
    )
  }
}

Component.propTypes = {
  accountId: PropTypes.string,
  className: PropTypes.string,
  config: PropTypes.object,
  environment: PropTypes.string,
  data: PropTypes.shape({
    getMedia: PropTypes.shape({
      _id: PropTypes.string,
      accessToken: PropTypes.string
    })
  }),
  id: PropTypes.string,
  loading: PropTypes.bool,
  onReady: PropTypes.func,
  readyToPlay: PropTypes.bool,
  style: PropTypes.object,
  showControls: PropTypes.bool
}

Component.defaultProps = {
  onReady: () => null,
  style: {height: height, width: width},
  policy: 'network-only'
}

export default withConfig(Reloadable(withQuery(Component, LoadingComponent)))
