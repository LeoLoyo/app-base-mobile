import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { RNMediastreamAds } from 'react-native-mediastream-ads'

export default class AdMediastream extends PureComponent {
  state = {
    styleAds: {
      width: 0,
      height: 0
    },
    value: false
  }

  _onAdLoaded = ({ value }) => this.setState({ value })

  _onAdFailedToLoad = ({ value }) => this.setState({ value })

  _onAdClosed = ({ value }) => this.setState({ value })

  render () {
    const { config, style } = this.props
    return (<RNMediastreamAds
      onAdLoaded={this._onAdLoaded}
      onAdFailedToLoad={this._onAdFailedToLoad}
      onAdClosed={this._onAdClosed}
      style={this.state.value ? style : this.state.styleAds}
      config={config} />)
  }
}

AdMediastream.propTypes = {
  config: PropTypes.any,
  style: PropTypes.any
}
