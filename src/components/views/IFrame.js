import React from 'react'
import { WebView } from 'react-native'
import withStyle from '../../core/withStyle'
class IFrame extends React.Component {
  render () {
    return (
      <WebView
        onLoadEnd={(e) => e}
        onError={(e) => console.error('error', e)}
        {...this.props}
      />

    )
  }
}

export default withStyle(IFrame)
