import React from 'react'
import {View} from 'react-native'
import {each} from 'lodash'
import PropTypes from 'prop-types'
import withStyle from '../../core/withStyle'
import * as HANDLERS from '../handlers/general'
class Component extends React.Component {
  static displayName = 'SettingsView'
  componentDidMount () {
    const {data, handlers} = this.props
    each(handlers || [], async (handler) => {
      if (HANDLERS[handler]) {
        await Promise.resolve(HANDLERS[handler](data))
      }
    })
  }
  render () {
    return (
      <View {...this.props}>{this.props.children}</View>
    )
  }
}

Component.propTypes = {
  data: PropTypes.object,
  handlers: PropTypes.array,
  children: PropTypes.any
}

export default withStyle(Component)
