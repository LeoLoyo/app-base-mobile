import React from 'react'
import PropTypes from 'prop-types'
import KeepAwake from 'react-native-keep-awake'
import _get from 'lodash/get'
import _merge from 'lodash/merge'
import { MediastreamPlayer, MediastreamPlayerModules } from 'react-native-mediastream-player'
import View from './View'
import Loading from './Loading'

import withConfig from './../../core/withConfig'
import withQuery from './../../core/withQuery'
import withOrientation from './../../core/withOrientation'
import { getFromStorage } from '../../core/Auth'

class Component extends React.PureComponent {
  state = {
    readyToPlay: false, // WIP
    loadComplete: false,
    error: false
  }

  static getQuery (props) {
    return {
      query: props.query || `query getLive($id: String!) { 
        getLives(filter:{field:"_id", is:"=", value: $id}) {
          _id name purchased accessToken 
        }
      }`,
      policy: 'network-only',
      variables: {
        id: props.id
      }
    }
  }

  async componentDidMount () {
    const customerId = await getFromStorage('auth_customer_id')
    this.setState(() => ({ loadComplete: true, customerId }))
  }
  _onError = (e) => this.props.onError(e)

  onReady = () => !this.state.readyToPlay && this.setState(() => ({ readyToPlay: true }))

  componentWillUnmount () {
    try {
      MediastreamPlayerModules.dismissMediastreamPlayer()
    } catch (error) {
      console.error('Player componentWillUnmount Error: ', error)
    }
  }

  _errorRender = () => {
    MediastreamPlayerModules.dismissMediastreamPlayer()
    this.setState(() => ({error: true}))
    return null
  }

  render () {
    const { config, error, data, id, style, className, loadingProps, loading, children, ...props } = this.props
    const { containerStyle, playerStyle } = styles
    const containerStyles = _merge({}, containerStyle, style)
    const _readyToRender = !!(this.state.loadComplete && !loading && _get(data, 'getLives.0._id', id))

    if (error) return this._errorRender()
    return (
      <View style={containerStyles} className={this.props.className}>
        {
          _readyToRender && !this.state.error
            ? (
              <MediastreamPlayer
                {...props}
                key='playerLive'
                style={playerStyle}
                live
                id={_get(data, 'getLives.0._id', id)}
                environment={_get(config, 'player.environment', 'production')}
                accountID={_get(config, 'player.account')}
                customerID={this.state.customerId}
                accessToken={_get(data, 'getLives.0.accessToken')}

                // methods
                onReady={this.onReady}
                onError={this._onError}
                onUnmount={MediastreamPlayerModules.dismissMediastreamPlayer}
              />
            )
            : <Loading {...loadingProps} />
        }
        <KeepAwake />
      </View>
    )
  }
}

Component.propTypes = {
  // playerProps
  accountId: PropTypes.string,
  id: PropTypes.string.isRequired,
  showControls: PropTypes.bool,

  className: PropTypes.string,
  children: PropTypes.any,
  config: PropTypes.object,
  data: PropTypes.object,
  Config: PropTypes.object,
  environment: PropTypes.string,
  style: PropTypes.object,

  onReady: PropTypes.func,
  readyToPlay: PropTypes.bool,
  onError: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.any,
  loadingProps: PropTypes.object
}

Component.defaultProps = {
  onReady: () => {},
  onError: () => {},
  style: {},
  loadingProps: {}
}

const styles = {
  containerStyle: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  playerStyle: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000'
  }
}

export default withConfig(withOrientation(withQuery(Component)))
