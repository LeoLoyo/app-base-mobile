import React from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import _isBoolean from 'lodash/isBoolean'

import PlayerComponent from './Player'
import WidgetComponent from './Widget'
import WidgetComponentModal from './WidgetModal'
import ButtonHeaderRightComponent from './ButtonHeaderRightComponent'
import EmptyComponent from './Empty'
import NotPurchasedComponent from './NotPurchased'

import Loading from '../../../native/Loading'
import View from '../../../native/View'
import { GetMedia } from '../queries'
import withQuery from '../../../../core/withQuery'
import { isPurchased, isMatch } from '../common'

const propTypesDefault = {
  data: PropTypes.object,
  loading: PropTypes.bool,
  widgetProps: PropTypes.object,
  msgEmpty: PropTypes.string
}

export default withQuery(class VodView extends React.PureComponent {
  constructor (props) {
    super(props)
    this.widgetModalRef = React.createRef('widgetModal')
  }
  static propTypes = propTypesDefault

  static getQuery (props) {
    return { query: GetMedia,
      variables: { ...props.variables }
    }
  }

  _verifyPurchased = () => {
    const { data: { getMedia }, widgetProps, ...otherProps } = this.props

    if (_isEmpty(getMedia)) return <EmptyComponent {...this.props} />

    if (isPurchased(getMedia)) {
      const _isMatch = isMatch(getMedia)
      const propsPlayer = _isMatch ? ({
        orientation: 'portrait',
        orientationOnMount: 'lockToPortrait',
        ButtonHeaderRightComponent: <ButtonHeaderRightComponent widgetModalRef={this.widgetModalRef}/>
      }) : ({
        orientation: 'landscape',
        orientationOnMount: 'lockToLandscape'
      })

      return (
        <View className="w-100 h-100">
          <PlayerComponent {...propsPlayer} {...otherProps} id={getMedia._id} type={getMedia.__typename}>
            {_isMatch && <WidgetComponentModal {...getMedia} {...widgetProps} widgetModalRef={this.widgetModalRef}/>}
          </PlayerComponent>
          {_isMatch && <WidgetComponent {...getMedia} {...widgetProps}/>}
        </View>
      )
    }

    return <NotPurchasedComponent {...this.props} />
  }

  render () {
    const { loading } = this.props
    if (!_isBoolean(loading)) return null
    if (loading) return <Loading className="flex-1 justify-content-center align-items-center"/>
    return this._verifyPurchased()
  }
})
