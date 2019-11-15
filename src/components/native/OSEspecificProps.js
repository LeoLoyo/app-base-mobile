import React from 'react'
import PropTypes from 'prop-types'
import {
  Platform
} from 'react-native'
import {
  get
} from 'lodash'
import {PropsManager} from '../'

class OSEspecificProps extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  _getOSprops = () => {
    const speceficProps = get(this.props, Platform.OS, {})
    return {
      ...this.props,
      ...speceficProps
    }
  }

  render () {
    return (
      <PropsManager {...this._getOSprops()}>
        {this.props.children}
      </PropsManager>
    )
  }
}

export default OSEspecificProps
