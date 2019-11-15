import React from 'react'
import _isEmpty from 'lodash/isEmpty'
import _isBoolean from 'lodash/isBoolean'
import _head from 'lodash/head'
import _get from 'lodash/get'

import PlayerComponent from './Player'
import WidgetComponent from './Widget'
import WidgetComponentModal from './WidgetModal'
import ButtonHeaderRightComponent from './ButtonHeaderRightComponent'
import EmptyComponent from './Empty'
import NotPurchasedComponent from './NotPurchased'
import FirebaseSchedule from '../../FirebaseSchedule'

import Loading from '../../../native/Loading'
import View from '../../../native/View'
import { GetLive } from '../queries'
import withQuery from '../../../../core/withQuery'
import { isMatch, isPurchased, propTypesDefault } from '../common'

export default withQuery(class LiveView extends React.PureComponent {
  static propTypes = propTypesDefault

  static getQuery = (props = {}) => {
    return {
      query: GetLive,
      variables: { ...props.variables },
      policy: 'network-only'
    }
  }
  constructor (props) {
    super(props)
    this.widgetModalRef = React.createRef('widgetModal')
  }
  _verifyPurchased = () => {
    const { data: { getLives }, widgetProps, refetch, ...otherProps } = this.props
    const Live = _head(getLives) || {}
    const currentSchdule = _head(Live.schedules) || {}

    if (_isEmpty(getLives) || _isEmpty(currentSchdule)) return <EmptyComponent {...this.props} />

    if (isPurchased(getLives)) {
      const _isMatch = isMatch(currentSchdule)
      const propsPlayer = _isMatch ? ({
        orientation: 'portrait',
        orientationOnMount: 'lockToPortrait',
        ButtonHeaderRightComponent: <ButtonHeaderRightComponent widgetModalRef={this.widgetModalRef}/>
      }) : ({
        orientation: 'landscape',
        orientationOnMount: 'lockToLandscape'
      })
      const scheduleId = _get(this.props, 'data.getLives[0].schedules[0]._id', null)
      return (
        <FirebaseSchedule scheduleId={scheduleId} refetch={refetch}>
          <View className="w-100 h-100">
            <PlayerComponent {...propsPlayer} {...otherProps} id={Live._id} type={Live.__typename} >
              {_isMatch && <WidgetComponentModal
                {...currentSchdule}
                {...widgetProps} live
                widgetModalRef={this.widgetModalRef}/>}
            </PlayerComponent>
            {_isMatch && <WidgetComponent {...currentSchdule} {...widgetProps} live/>}
          </View>
        </FirebaseSchedule>
      )
    }

    return <NotPurchasedComponent {...this.props} />
  }

  render () {
    const { loading } = this.props
    if (!_isBoolean(loading)) return null
    if (loading) return <Loading className="flex-1 justify-content-center align-items-center" />
    return this._verifyPurchased()
  }
})
