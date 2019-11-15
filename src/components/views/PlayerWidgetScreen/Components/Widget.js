import React from 'react'
import PropTypes from 'prop-types'
import withConfig from '../../../../core/withConfig'
import WebView from '../../../native/WebView'
import View from '../../../native/View'

function Widget (props) {
  const { wrapperProps, webViewProps, opta = {}, live = false } = props
  const { general: { web, prefixWidget = '' } } = props.config
  const competition = `competition=${opta.competition}`
  const season = `season=${opta.season}`
  const match = `match=${opta.match_id}`
  const base = `${web}${prefixWidget}`
  const uri = encodeURI(`${base}?${competition}&${season}&${match}&team=${opta.team || []}&live="${live}"`)

  return (
    <View {...wrapperProps} >
      <WebView {...webViewProps} uri={uri}/>
    </View>
  )
}

Widget.propTypes = {
  config: PropTypes.object,
  wrapperProps: PropTypes.object,
  WidgetFailComponent: PropTypes.string,
  webViewProps: PropTypes.object,
  opta: PropTypes.object,
  live: PropTypes.bool
}

Widget.defaultProps = {
  wrapperProps: {
    className: 'bg-white w-100 h-100'
  },
  webViewProps: {
    className: 'flex-1'
  }
}
export default withConfig(Widget)
