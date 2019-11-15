import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import _head from 'lodash/head'
import _isBoolean from 'lodash/isBoolean'
import _isEmpty from 'lodash/isEmpty'
import { Container, List } from 'native-base'

import { getPurchases } from '../../graph'
import { ScrollView, View, Text, Image, Loading } from '../..'
import withQuery from '../../../core/withQuery'
import EmptyListPurchased from './EmptyListPurchased'

class PaymentsView extends React.Component {
  static propTypes = {
    refetch: PropTypes.func,
    wrapperScreen: PropTypes.object,
    data: PropTypes.object,
    loading: PropTypes.bool,
    loadingProps: PropTypes.object,
    emptyListProps: PropTypes.object,
    assets: PropTypes.shape({
      Visa: PropTypes.string,
      America: PropTypes.string,
      Master: PropTypes.string
    })
  }

  static getQuery (props = {}) {
    return {
      query: props.query || getPurchases,
      variables: props.variables
    }
  }

  _renderGateway = (payment = {}) => {
    if (payment.status === 'PENDING') {
      return (<Text
        className="w-45 text-color-dark text-align-center text-label-item-list"
        text={'%payment_label_pending%'}/>)
    }
    if (payment.gateway === 'coupon') {
      return (<Text
        className="w-45 text-color-dark text-align-center text-label-item-list"
        text={'%payment_label_coupon%'}/>)
    }
    if (payment.card && this.props.assets) {
      return (
        <View
          className="w-45 flex-row justify-content-center align-items-center"
        >
          { ['visa', 'america', 'master', 'dinner'].includes(payment.card.type) && (
            <View className="justify-content-center align-items-center"style={{ width: 40, height: 25 }}>
              {this.props.assets[payment.card.type] && <Image source={{uri: this.props.assets[payment.card.type]}}/>}
            </View>
          )
          }
          <Text
            className="text-color-dark text-align-center text-label-item-list"
            text={` **** ${payment.card.lasts4 || '****'}`}/>
        </View>)
    }
  }

  _renderItem = (item, key) => {
    const payment = _head(item.payments) || {}
    return (
      <View
        key={key}
        className={`w-100`}
        style={{ height: 53, paddingHorizontal: 10 }}>
        <View
          className={`
            h-100 flex-row 
          justify-content-space-between 
          align-items-center ${key % 2 === 0 ? `bg-white` : `bg-ligth_gray`}`}>
          <Text
            className="w-25 text-color-dark text-align-center text-label-item-list"
            text={moment(item.date_from).format('DD/MM/YYYY')}/>
          {this._renderGateway(payment)}
          <Text
            className="w-30 text-color-dark text-align-center text-label-item-list"
            text={`${item.currency_data.symbol} ${item.amount} ${item.currency_data.name}`}/>
        </View>
      </View>
    )
  }

  _renderEmptyComponent = () => <EmptyListPurchased {...this.props.emptyListProps}/>

  render () {
    const { refetch, wrapperScreen, data, loading } = this.props
    if (!_isBoolean(loading)) return null
    if (loading || !data.getPurchases) {
      return (
        <View className="flex-1 justify-content-center align-items-center">
          <Loading {...this.props.loadingProps}/>
        </View>
      )
    }
    if (_isEmpty(data.getPurchases)) return this._renderEmptyComponent()
    return (
      <Container>
        <List>
          <View
            style={{ height: 53 }}
            className={`
                w-100 flex-row 
                justify-content-space-between 
                align-items-center 
                border-bottom-1 border-color-bottom-secondary`}>
            <Text
              className="w-25 text-color-primary text-align-center text-label-header"
              text="%payment_label_date%"/>
            <Text
              className="w-45 text-color-primary text-align-center text-label-header"
              text="%payment_label_method%"/>
            <Text
              className="w-30 text-color-primary text-align-center text-label-header"
              text="%payment_label_total%"/>
          </View>
          <ScrollView
            { ...wrapperScreen }
            refreshControl
            _onRefresh={refetch}>
            { (data.getPurchases || []).map(this._renderItem) }
          </ScrollView>
        </List>
      </Container>
    )
  }
}

export default withQuery(PaymentsView)
