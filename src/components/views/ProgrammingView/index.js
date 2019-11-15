import React from 'react'
import PropTypes from 'prop-types'
import _isBoolean from 'lodash/isBoolean'
import _find from 'lodash/find'
import moment from 'moment'
import _head from 'lodash/head'
import _get from 'lodash/get'

import withQuery from '../../../core/withQuery'

import View from '../../native/View'
import Loading from '../../native/Loading'

import { getSchedulesByDays } from '../../graph'
import { ListDays, ListMediaItem, MultipleTabSignal } from './Components'
import { ScrollView } from '../..'
import BaseCategories from '../Schedules/BaseCategories'
import ScheduleActions from '../Schedules/ScheduleActions'

class ProgrammingView extends React.Component {
    static propTypes = {
      baseCategoryProps: PropTypes.object,
      loading: PropTypes.bool,
      data: PropTypes.object,
      groups: PropTypes.array,
      refetch: PropTypes.func,
      wrapperScreen: PropTypes.object,
      loadingProps: PropTypes.object,
      listDaysProps: PropTypes.object,
      listMediasProps: PropTypes.object,
      multipleTabSignalProps: PropTypes.object
    }

    static getQuery (props = {}) {
      return {
        query: props.query || getSchedulesByDays,
        variables: {
          utc: moment().utcOffset(),
          ...props.variables
        }
      }
    }

    static getDerivedStateFromProps (nextProps, prevState) {
      if (nextProps.data && nextProps.data.getSchedulesByDay) {
        if (!prevState.daySelected) {
          const firstElement = _head(nextProps.data.getSchedulesByDay)
          return ({
            daySelected: firstElement._id,
            schedules: firstElement.schedules
          })
        }
        return ({
          schedules: _get(_find(nextProps.data.getSchedulesByDay,
            ['_id', prevState.daySelected]), 'schedules', prevState.schedules)
        })
      }
      return prevState
    }

    state = {
      daySelected: null,
      schedules: []

    }

    _onPressDayItem = (item) => {
      return item._id && this.setState(() => ({
        daySelected: item._id,
        schedules: _find(_get(this.props, 'data.getSchedulesByDay', []),
          ['_id', item._id]).schedules
      }))
    }

    _getDataDates = () => {
      return _get(this.props, 'data.getSchedulesByDay', []).map(({schedules, ...more}) => (more))
    }

    _filterSchedulesByArgument = (filter) => {
      const output = _get(this.state, 'schedules', [])
      if (!filter) return output
      return output.filter(schedule => (_get(filter, 'value', false) === _get(schedule, filter.path, false)))
    }

    render () {
      const { loading, data, wrapperScreen, refetch, groups = [], multipleTabSignalProps = {}, baseCategoryProps } = this.props

      if (!_isBoolean(loading)) return null
      if (loading || !data.getSchedulesByDay) {
        return (
          <View className="flex-1 justify-content-center align-items-center">
            <Loading {...this.props.loadingProps}/>
          </View>
        )
      }
      return (
        <React.Fragment>
          <ListDays
            {...this.props.listDaysProps}
            data={this._getDataDates()}
            onPress={this._onPressDayItem}
            daySelected={this.state.daySelected}/>
          <MultipleTabSignal groups={groups} {...multipleTabSignalProps}>
            {
              ({filter}) => {
                const schedules = this._filterSchedulesByArgument(filter)
                return (<ScrollView
                  { ...wrapperScreen }
                  refreshControl
                  _onRefresh={refetch}>
                  <BaseCategories {...baseCategoryProps} _id={this.state.daySelected} id={schedules}>
                    {({ baseCategories }) => (<ScheduleActions
                      data={schedules}
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
                      }}>
                      {({ schedules = [], onPress = () => {} }) => (<ListMediaItem
                        {...this.props.listMediasProps}
                        data={schedules}
                        onPress={onPress}/>)}
                    </ScheduleActions>)
                    }
                  </BaseCategories>
                </ScrollView >)
              }
            }
          </MultipleTabSignal>
        </React.Fragment>
      )
    }
}

export default withQuery(ProgrammingView)
