import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'react-native'
import { CustomComponentProvider } from '../../../../core/withCustomComponent'
import _isEqual from 'lodash/isEqual'
import _get from 'lodash/get'
/**
 * EmptyComponent
 */

class Empty extends React.Component {
  _getDataProps = ({ data } = {}) => data

  shouldComponentUpdate (nextProps) {
    const currentDataProps = this._getDataProps(this.props)
    const nextDataProps = this._getDataProps(nextProps)
    return !_isEqual(currentDataProps, nextDataProps)
  }
  render () {
    return (
      <CustomComponentProvider {...this.props} components={['EmptyComponent']}>
        {({ EmptyComponent }) => {
          if (EmptyComponent) { return <EmptyComponent {...this.props} /> }
          this.props.navigation && this.props.navigation.goBack()
          if (this.props.msgEmpty) {
            if (this.props.type === 'VOD') Alert.alert('', this.props.msgEmpty, [{ text: 'OK', style: 'OK' }])
            const msgWithOutLive = `${this.props.msgEmpty} en ${_get(this.props, 'data.getLives[0].name', 'Live')}`
            Alert.alert('', msgWithOutLive, [{text: 'OK', style: 'OK'}])
            return null
          }
        }}
      </CustomComponentProvider>
    )
  }
}

Empty.displayName = 'EmtptyComponent'

Empty.propTypes = {
  navigation: PropTypes.object,
  msgEmpty: PropTypes.string,
  type: PropTypes.string,
  EmptyComponent: PropTypes.string
}

export default Empty
