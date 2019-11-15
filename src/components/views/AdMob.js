import React from 'react'
import firebase from 'react-native-firebase'
import PropTypes from 'prop-types'
import { View } from 'react-native'

class AdMob extends React.Component {
  render () {
    const { unitId, size } = this.props
    const Banner = firebase.admob.Banner
    const AdRequest = firebase.admob.AdRequest
    const request = new AdRequest()
    request.addKeyword('foobar')
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', paddingVertical: 5}}>
        <Banner
          size={size}
          unitId={unitId}
          request={request.build()}
        />
      </View>
    )
  }
}

AdMob.propTypes = {
  unitId: PropTypes.string,
  size: PropTypes.string
}

AdMob.defaultProps = {
  unitId: 'ca-app-pub-3940256099942544/2934735716',
  size: 'LARGE_BANNER'
}

export default AdMob
