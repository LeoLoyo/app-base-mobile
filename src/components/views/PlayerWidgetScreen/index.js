import React from 'react'
import PropTypes from 'prop-types'

import { LiveView, VodView } from './Components'
import withTranslation from '../../../core/withTranslation'

class PlayerScreen extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['LIVE', 'VOD']).isRequired
  }

  _renderLive = () => <LiveView { ...this.props } />

  _renderVod = () => <VodView { ...this.props } />

  _renderPlayer = (type) => {
    if (type === 'LIVE') {
      return this._renderLive()
    }
    if (type === 'VOD') {
      return this._renderVod()
    }
    console.error('Type is required and it must be LIVE OR VOD ')
    return null
  }

  render () {
    return this._renderPlayer(this.props.type)
  }
}

export default withTranslation(PlayerScreen,
  ['msgNotPurchased', 'msgEmpty', 'sessionNetworkTitle', 'sessionNetworkMsg', 'msgGeoRestriction'])
