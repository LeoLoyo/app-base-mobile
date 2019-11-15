import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'react-native'
import { isAuthenticated } from '../../../../core/Auth'
import { CustomComponentProvider } from '../../../../core/withCustomComponent'
import withTranslation from '../../../../core/withTranslation'
import _isEqual from 'lodash/isEqual'

class NotPurchased extends React.Component {
  _getDataProps = ({ data } = {}) => data

  shouldComponentUpdate (nextProps) {
    const currentDataProps = this._getDataProps(this.props)
    const nextDataProps = this._getDataProps(nextProps)
    return !_isEqual(currentDataProps, nextDataProps)
  }

  _isAuthenticated = async () => {
    const isAuth = await isAuthenticated()
    if (!isAuth && this.props.authRequiredMessage) {
      Alert.alert('', this.props.authRequiredMessage, [{ text: 'OK', style: 'OK' }])
    } else {
      this.props.msgNotPurchased && Alert.alert('', this.props.msgNotPurchased, [{ text: 'OK', style: 'OK' }])
    }
  }
  render () {
    return (
      <CustomComponentProvider {...this.props} components={['NotPurchasedComponent']}>
        {({ NotPurchasedComponent }) => {
          if (NotPurchasedComponent) { return <NotPurchasedComponent {...this.props} /> }
          this.props.navigation && this.props.navigation.goBack()
          this._isAuthenticated()
          return null
        }}
      </CustomComponentProvider>
    )
  }
}

NotPurchased.displayName = 'NotPurchasedComponent'

NotPurchased.propTypes = {
  navigation: PropTypes.object,
  msgNotPurchased: PropTypes.string,
  NotPurchasedComponent: PropTypes.string,
  authRequiredMessage: PropTypes.string
}

export default withTranslation(NotPurchased, ['authRequiredMessage'])
