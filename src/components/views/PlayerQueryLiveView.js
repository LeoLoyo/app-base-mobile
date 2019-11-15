
import React from 'react'
import PropTypes from 'prop-types'
import _get from 'lodash/get'

import withConfig from '../../core/withConfig'
import withQuery from '../../core/withQuery'
import { getFromMultipleStorage } from '../../core/Auth'
import MSPlayerSkin from './MSPlayerSkin'
import moment from 'moment'

class PlayerQueryLiveView extends React.PureComponent {
  state = {
    loadComplete: false,
    error: false
  }

  static getQuery (props) {
    return {
      query: props.query || `query getLive($id: String!) {
        getLives(filter:{field:"_id", is:"=", value: $id}) {
          _id
          name
          purchased
          accessToken
          dvr
          schedules(filters: { field: "current", is: "=" }) {
            _id
            date_start
            date_end
            dvr
            geo_restriction {
              restricted
              data {
                _id
              }
            }
          }
        }
      }`,
      policy: 'network-only',
      variables: {
        id: props.id
      }
    }
  }
  async componentDidMount () {
    const {
      auth_customer_id: customerId,
      session_id: sessionId
    } = await getFromMultipleStorage(['auth_customer_id', 'session_id'])
    this.setState(() => ({ loadComplete: true, customerId, sessionId }))
  }

  _buildConfigCast = (data) => {
    const {id, config} = this.props
    const env = _get(config, 'player.environment', 'production')
    const _id = _get(data, 'getLives.0._id', id)
    const accessToken = _get(data, 'getLives.0.accessToken', false)
    const params = accessToken ? `?access_token=${accessToken}` : ''
    const urlPrefix = env === 'dev' ? `https://dev.mdstrm.com/video` : `https://mdstrm.com/video`

    return {
      mediaUrl: `${urlPrefix}/${_id}.m3u8${params}`,
      imageUrl: _get(data, 'getLives.0.thumbnails.default.url', ''), // add default image
      title: _get(data, 'getLives.0.name'),
      subtitle: _get(data, 'getLives.0.description'),
      contentType: 'video/mp4' // todo send this from props
    }
  }

  _getDiffDuration = (start, end) => parseInt(moment.duration(moment(end).diff(start)).asSeconds())

  render () {
    const { sessionId } = this.state
    const { config, data, id, styleWrapperPlayer, classNameWrapper,
      loadingProps, loading, children, ...otherProps } = this.props
    const hasDvr = _get(data, 'getLives.0.dvr', false) && _get(data, 'getLives.0.schedules.0.dvr', false)
    const _readyToRender = !!(this.state.loadComplete && !loading && _get(data, 'getLives.0._id', id))
    const start = _get(data, 'getLives.0.schedules.0.date_start')
    const end = _get(data, 'getLives.0.schedules.0.date_end')
    const geoRestriction = _get(data, 'getLives.0.schedules.0.geo_restriction', {})
    const initialStateDvr = {}
    const windowDvr = this._getDiffDuration(start, end)

    if (hasDvr) {
      const startSchedule = moment(start)
      const scheduleOffSet = (startWatching = moment()) => this._getDiffDuration(startSchedule, startWatching)

      initialStateDvr.windowDvr = windowDvr
      initialStateDvr.scheduleOffSet = scheduleOffSet
    }

    const {
      orientationOnMount,
      orientationOnUnmount,
      navigation: { goBack },
      inFullScreenCallBack,
      propsPlayerSkin,
      sessionNetworkTitle,
      sessionNetworkMsg,
      msgGeoRestriction,
      ButtonHeaderRightComponent = null
    } = otherProps
    return _readyToRender
      ? (
        <MSPlayerSkin
          {...propsPlayerSkin}
          geoRestriction={geoRestriction}
          config={config}
          sessionNetworkTitle={sessionNetworkTitle}
          sessionNetworkMsg={sessionNetworkMsg}
          msgGeoRestriction={msgGeoRestriction}
          ButtonHeaderRightComponent={ButtonHeaderRightComponent}
          configCast={this._buildConfigCast(data)}
          configPlayer={{
            id: _get(data, 'getLives.0._id'),
            name: _get(data, 'getLives.0.name'),
            live: true,
            environment: _get(config, 'player.environment', 'production'),
            accountID: _get(config, 'player.account'),
            customerID: this.state.customerId,
            accessToken: _get(data, 'getLives.0.accessToken'),
            distributorId: _get(config, 'player.distributorId'),
            appName: _get(config, 'player.appName'),
            appVersion: _get(config, 'player.appVersion'),
            autoPlay: true,
            dvr: hasDvr,
            windowDvr
          }}
          sessionId={sessionId}
          onGoBackPress={goBack}
          inFullScreenCallBack={inFullScreenCallBack}
          orientationOnMount={orientationOnMount}
          orientationOnUnmount={orientationOnUnmount}
          currentSchedule={_get(data, 'getLives.0.schedules.0')}
          initialStateDvr={initialStateDvr}
        >{children}</MSPlayerSkin>
      )
      : null
  }
}

PlayerQueryLiveView.propTypes = {
  config: PropTypes.object,
  children: PropTypes.any,
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  data: PropTypes.object,
  loadingProps: PropTypes.object,
  classNameWrapper: PropTypes.string,
  styleWrapperPlayer: PropTypes.any
}

PlayerQueryLiveView.defaultProps = {}

export default withConfig(withQuery(PlayerQueryLiveView))
