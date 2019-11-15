import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import _isBoolean from 'lodash/isBoolean'
import _isEmpty from 'lodash/isEmpty'

import withQuery from '../../../core/withQuery'
import { getSchedulesQuery } from '../../graph'
import ListSchedules from './ListSchedules'
import BaseCategories from '../Schedules/BaseCategories'
import ScheduleActions from '../Schedules/ScheduleActions'
import { Placeholder } from './ItemComponentDefault'
import firebase from 'react-native-firebase'

class IncomingSchedules extends React.Component {
  static getQuery ({ variables, query = getSchedulesQuery }) {
    return ({ query, variables })
  }

  componentDidMount () {
    this.getSchedules()
  }

  getSchedules = () => {
    const scheduleCurrentRef = firebase.database().ref('schedules')
    scheduleCurrentRef.on('value', (snapshot) => { this.props.refetch() })
  }

  render () {
    const { baseCategoryProps, data, loading } = this.props
    if (!_isBoolean(loading)) return null
    if (loading || !data.getSchedules) {
      return <Placeholder/>
    }
    return (
      <BaseCategories {...baseCategoryProps} id={data.getSchedules}>
        {({ baseCategories }) => (<ScheduleActions
          data={data.getSchedules || []}
          baseCategories={baseCategories}
          actionsMessage={{
            eventNotScheduled: '%event_not_scheduled%',
            eventStanby: '%event_stanby%',
            eventScheduled: '%event_scheduled%',
            eventNotPurchased: '%event_not_purchased%',
            btnGoToWeb: '%btn_go_to_web%',
            btnSaveYes: '%btn_save_yes%',
            btnSaveNo: '%btn_save_no%',
            btnCancel: '%btn_cancel%',
            btnAgree: '%btn_agree%',
            authRequiredMessage: '%auth_required_message%'
          }}
        >
          {({ schedules = [], onPress = () => {} }) => {
            return (<Fragment>
              { !_isEmpty(schedules) && this.props.children }
              <ListSchedules
                listProps={this.props.listProps}
                data={schedules}
                onPress={onPress}/>
            </Fragment>)
          }}
        </ScheduleActions>)
        }
      </BaseCategories>
    )
  }
}

IncomingSchedules.propTypes = {
  baseCategoryProps: PropTypes.object,
  data: PropTypes.object,
  query: PropTypes.string,
  loading: PropTypes.bool,
  variables: PropTypes.shape({
    filters: PropTypes.arrayOf(PropTypes.object),
    days: PropTypes.number
  }),
  listProps: PropTypes.object,
  children: PropTypes.any,
  refetch: PropTypes.func
}

export default withQuery(IncomingSchedules)
