import React from 'react'
import PropTypes from 'prop-types'
import _get from 'lodash/get'
import { Linking, Alert } from 'react-native'
import { isAuthenticated } from '../../../../core/Auth'
import withConfig from '../../../../core/withConfig'
import withTranslation from '../../../../core/withTranslation'
import withNavigation from '../../../../core/withNavigation'
const buildMatch = (categories, schedules, onlyMatch) => {
  return schedules.reduce((prev, curr) => {
    const Schedule = Object.assign({}, curr, {
      match: {
        'rival-1': curr.customJson['rival-1'] ? categories[curr.customJson['rival-1']] : {},
        'rival-2': curr.customJson['rival-2'] ? categories[curr.customJson['rival-2']] : {}
      }
    })

    if ((!categories[curr.customJson['rival-1']] || !categories[curr.customJson['rival-2']]) && onlyMatch) {
      return [...prev]
    }

    if (!categories[curr.customJson['rival-1']] && !categories[curr.customJson['rival-2']]) delete Schedule.match

    return [...prev, Schedule]
  }, [])
}

class ScheduleActions extends React.Component {
  static propTypes = {
    mutation: PropTypes.object,
    actionsMessage: PropTypes.object,
    config: PropTypes.object,
    navigation: PropTypes.object,
    data: PropTypes.array,
    baseCategories: PropTypes.object.isRequired,
    onlyMatch: PropTypes.bool,
    children: PropTypes.any
  }

  static defaultProps = {
    onlyMatch: false,
    baseCategories: {},
    actionsMessage: {}
  }

  _onPress = async ({ _id, scheduled, purchased, current, link = 'Player', live = {} }, actionMutation) => {
    const { actionsMessage } = this.props
    const isAuth = await isAuthenticated()
    const isPurchased = live.purchased === 1 || purchased === 1 ? 1 : purchased

    if (!isAuth) {
      return this._dispatchAlert(_get(actionsMessage, 'authRequiredMessage'), [{ text: 'OK', style: 'OK' }], true)
    }
    if (isPurchased === 1) {
      if (current) return this.props.navigation && this.props.navigation.navigate(link, { _id: live._id })

      if (scheduled) {
        return this._dispatchAlert(
          _get(actionsMessage, 'eventScheduled'),
          [{ text: _get(actionsMessage, 'btnSaveNo'), style: 'destructive' },
            { text: _get(actionsMessage, 'btnSaveYes'), onPress: () => this._dispatchMutation(_id, actionMutation) }
          ], true)
      }
      return this._dispatchAlert(
        _get(actionsMessage, 'eventNotScheduled'),
        [{ text: _get(actionsMessage, 'btnCancel'), style: 'destructive' },
          { text: _get(actionsMessage, 'btnAgree'), onPress: () => this._dispatchMutation(_id, actionMutation) }
        ], true)
    } else if (purchased === -1) {
      return this._dispatchAlert(
        _get(actionsMessage, 'eventNotPurchased'),
        [{ text: _get(actionsMessage, 'btnAgree'), style: 'ok' }
          // { text: _get(actionsMessage, 'btnGoToWeb'), onPress: this._goToWeb }
        ], true)
    }
    return this._dispatchAlert(_get(actionsMessage, 'eventStanby'), [], true)
  }

  _dispatchAlert = (msg, buttons, cancelable = false) => {
    return Alert.alert('', msg, buttons, { cancelable })
  }

  _dispatchMutation = async (id, actionMutation) => {
    try {
      if (!id) {
        console.error('id schedule is required')
        return null
      }
      if (actionMutation) actionMutation(id)
    } catch (error) {
      console.error('getSchedules Schedule')
    }
  }

  _goToWeb = () => {
    const { config: { general: { web: url } } } = this.props
    if (url) {
      return Linking.openURL(url)
    }
  }

  render () {
    return this.props.children({
      onPress: this._onPress,
      schedules: buildMatch(
        this.props.baseCategories,
        this.props.data,
        this.props.onlyMatch)
    })
  }
}

export default withNavigation(withTranslation(withConfig(ScheduleActions), [
  'actionsMessage.authRequiredMessage',
  'actionsMessage.eventScheduled',
  'actionsMessage.btnSaveNo',
  'actionsMessage.btnSaveYes',
  'actionsMessage.eventNotScheduled',
  'actionsMessage.btnAgree',
  'actionsMessage.eventNotPurchased',
  'actionsMessage.btnCancel',
  'actionsMessage.btnGoToWeb',
  'actionsMessage.eventStanby'
]))
