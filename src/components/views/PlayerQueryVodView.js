
import React from 'react'
import PropTypes from 'prop-types'
import _get from 'lodash/get'

import withConfig from '../../core/withConfig'
import withQuery from '../../core/withQuery'
import { getFromMultipleStorage } from '../../core/Auth'
import MSPlayerSkin from './MSPlayerSkin'
import View from '../native/View'

class PlayerQueryVodView extends React.PureComponent {
  state = {
    loadComplete: false,
    error: false
  }

  static getQuery (props) {
    return {
      policy: 'network-only',
      query: `query getMedia($id: String!, $maxUse: Int = 20) { 
        getMedia(_id: $id) { 
          _id
          title
          accessToken(maxUse: $maxUse)
          favorite
          opta
          description
          thumbnails {
            default {
              url
            }
          }
          duration 
        } 
      }`,
      variables: {
        id: props.id
      }
    }
  }

  async componentDidMount () {
    const { auth_customer_id: customerId,
      session_id: sessionId } = await getFromMultipleStorage(['auth_customer_id', 'session_id'])
    this.setState(() => ({ loadComplete: true, customerId, sessionId }))
  }

  _buildConfigCast = (data) => {
    const {id, config} = this.props
    const env = _get(config, 'player.environment', 'production')
    const _id = _get(data, 'getMedia._id', id)
    const accessToken = _get(data, 'getMedia.accessToken', false)
    const params = accessToken ? `?access_token=${accessToken}` : ''
    const urlPrefix = env === 'dev' ? `https://dev.mdstrm.com/video` : `https://mdstrm.com/video`

    return {
      mediaUrl: `${urlPrefix}/${_id}.m3u8${params}`,
      imageUrl: _get(data, 'getMedia.thumbnails.default.url', ''), // add default image
      title: _get(data, 'getMedia.title'),
      subtitle: _get(data, 'getMedia.description'),
      contentType: 'video/mp4' // todo send this from props
    }
  }

  render () {
    const { config, data, id, styleWrapperPlayer, classNameWrapper, loadingProps, loading, ...otherProps } = this.props
    const _readyToRender = !!(this.state.loadComplete && !loading && _get(data, 'getMedia._id', id))
    const matchData = _get(data, 'getMedia.opta', {})
    const {
      orientationOnMount,
      orientationOnUnmount,
      navigation: { goBack },
      inFullScreenCallBack,
      propsPlayerSkin,
      sessionNetworkTitle,
      sessionNetworkMsg,
      ButtonHeaderRightComponent = null
    } = otherProps

    return (
      _readyToRender
        ? (
          <MSPlayerSkin
            config={config}
            sessionNetworkTitle={sessionNetworkTitle}
            sessionNetworkMsg={sessionNetworkMsg}
            matchData={matchData}
            {...propsPlayerSkin}
            ButtonHeaderRightComponent={ButtonHeaderRightComponent}
            configPlayer={{
              id: _get(data, 'getMedia._id'),
              name: _get(data, 'getMedia.title'),
              environment: _get(config, 'player.environment', 'production'),
              accountID: _get(config, 'player.account'),
              customerID: this.state.customerId,
              accessToken: _get(data, 'getMedia.accessToken'),
              distributorId: _get(config, 'player.distributorId'),
              appName: _get(config, 'player.appName'),
              appVersion: _get(config, 'player.appVersion'),
              autoPlay: true
            }}
            sessionId={this.state.sessionId}
            onGoBackPress={goBack}
            inFullScreenCallBack={inFullScreenCallBack}
            orientationOnMount={orientationOnMount}
            orientationOnUnmount={orientationOnUnmount}
          >{this.props.children}</MSPlayerSkin>
        )
        : <View className={classNameWrapper} />
    )
  }
}

PlayerQueryVodView.propTypes = {
  config: PropTypes.object,
  children: PropTypes.any,
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  data: PropTypes.object,
  loadingProps: PropTypes.object,
  classNameWrapper: PropTypes.string,
  styleWrapperPlayer: PropTypes.any
}

PlayerQueryVodView.defaultProps = {}

export default withConfig(withQuery(PlayerQueryVodView))
