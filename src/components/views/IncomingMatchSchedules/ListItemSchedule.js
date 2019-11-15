import React from 'react'
import PropTypes from 'prop-types'
import _merge from 'lodash/merge'
import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import Button from './../../native/Button'
import View from './../../native/View'
import itemPropsDefault from './default'
import { Opponent, ScheduleInfo, DescriptionSchedules } from './ItemComponentDefault'
import { Text, Image, LinearGradientView, IconTheme, Loading } from '../..'
import withMutation from '../../../core/withMutation'

class Match extends React.PureComponent {
  onPressButton = () => {
    const { data, onPress, mutation } = this.props
    if (onPress) {
      return onPress(data, async (id) => {
        await mutation.action({
          variables: { id },
          refetchQueries: [`getSchedulesByDay`, `getSchedules`]
        })
      })
    }
  }

  render () {
    const { data, itemComponentProps, horizontalList, mutation = {} } = this.props
    const { loading = false } = mutation
    const { loadingProps = {} } = itemComponentProps
    if (_isEmpty(data.match)) return null
    const { match: { 'rival-1': opponentLeft = {}, 'rival-2': opponentRight = {} } = {},
      purchased,
      scheduled,
      current,
      date_start: time,
      date_end: date } = data

    const boxProps = _merge({}, itemPropsDefault.boxProps, itemComponentProps.boxProps)

    const wrapperOpponentsProps = _merge({},
      itemPropsDefault.wrapperOpponentsProps, itemComponentProps.wrapperOpponentsProps)
    const boxOpponentProps = _merge({},
      itemPropsDefault.boxOpponentProps, itemComponentProps.boxOpponentProps)
    const opponentImageProps = _merge({},
      itemPropsDefault.opponentImageProps, itemComponentProps.opponentImageProps)

    const boxScheduleInfoProps = _merge({},
      itemPropsDefault.boxScheduleInfoProps, itemComponentProps.boxScheduleInfoProps)
    const scheduleInfoIconProps = _merge({},
      itemPropsDefault.scheduleInfoIconProps, itemComponentProps.scheduleInfoIconProps)
    const scheduleInfoTimeProps = _merge({},
      itemPropsDefault.scheduleInfoTimeProps, itemComponentProps.scheduleInfoTimeProps)
    const scheduleInfoDateProps = _merge({},
      itemPropsDefault.scheduleInfoDateProps, itemComponentProps.scheduleInfoDateProps)

    const wrapperDescriptionProps = _merge({},
      itemPropsDefault.wrapperDescriptionProps, itemComponentProps.wrapperDescriptionProps)
    const descriptionSchedulesProps = _merge({},
      itemPropsDefault.descriptionSchedulesProps, itemComponentProps.descriptionSchedulesProps)
    const { descriptionName } = descriptionSchedulesProps
    return (
      <Button {...boxProps} onPress={this.onPressButton}>
        {/* Opponents */}
        <View {...wrapperOpponentsProps}>

          {/* Opponent One */}
          <Opponent
            side={'left'}
            image={opponentLeft.image}
            boxOpponentProps={boxOpponentProps}
            opponentImageProps={opponentImageProps}
            horizontalList={horizontalList}
            textOpponentProps={descriptionSchedulesProps.textOpponentProps}
            text={_get(opponentLeft, descriptionName, opponentLeft.name)} />

          {/* Schedule Info  & loading */}
          <ScheduleInfo
            LoadingComponent={loading ? <Loading {...loadingProps}/> : null}
            time={time}
            date={date}
            current={current}
            scheduled={scheduled}
            purchased={purchased}
            boxScheduleInfoProps={boxScheduleInfoProps}
            scheduleInfoIconProps={scheduleInfoIconProps}
            scheduleInfoTimeProps={scheduleInfoTimeProps}
            scheduleInfoDateProps={scheduleInfoDateProps}
          />

          {/* Opponent Two */}
          <Opponent
            side={'right'}
            image={opponentRight.image}
            boxOpponentProps={boxOpponentProps}
            opponentImageProps={opponentImageProps}
            horizontalList={horizontalList}
            textOpponentProps={descriptionSchedulesProps.textOpponentProps}
            text={_get(opponentRight, descriptionName, opponentRight.name)} />

        </View>

        {/* Description */}
        {horizontalList === undefined && <DescriptionSchedules
          wrapperDescriptionProps={wrapperDescriptionProps}
          descriptionSchedulesProps={descriptionSchedulesProps}
          textLeft={_get(opponentLeft, descriptionName, opponentLeft.name)}
          textRight={_get(opponentRight, descriptionName, opponentRight.name)}
        />
        }

      </Button>
    )
  }
}

Match.displayName = 'MatchComponent'

Match.propTypes = {
  data: PropTypes.object,
  itemComponentProps: PropTypes.object,
  mutation: PropTypes.object,
  onPress: PropTypes.func,
  descriptionName: PropTypes.string,
  horizontalList: PropTypes.bool
}

class Show extends React.PureComponent {
  onPressButton = () => {
    const { data, onPress, mutation } = this.props
    if (onPress) {
      return onPress(data, async (id) => {
        await mutation.action({
          variables: { id },
          refetchQueries: [`getSchedulesByDay`, `getSchedules`]
        })
      })
    }
  }

  render () {
    const { data,
      itemComponentProps,
      pathImage,
      imageBackgroundDefault,
      mutation
    } = this.props
    const { loadingProps = {} } = itemComponentProps
    const { loading = false } = mutation
    let _source = {
      uri: _get(data, pathImage)
    }
    if (!_source.uri) {
      _source = imageBackgroundDefault
    }
    const { scheduled, date_start: time, current } = data
    const boxProps = _merge({}, itemPropsDefault.boxProps, itemComponentProps.boxProps)
    const imageWrapper = _merge({}, itemPropsDefault.imageWrapper, itemComponentProps.imageWrapper)
    const textShowProps = _merge({}, itemPropsDefault.textShowProps, itemComponentProps.textShowProps)
    const scheduleShowIconProps = _merge({},
      itemPropsDefault.scheduleInfoIconProps, itemComponentProps.scheduleShowIconProps)
    const linearGradientViewProps = _merge({},
      itemPropsDefault.linearGradientViewProps, itemComponentProps.linearGradientViewProps)
    const { isScheduledProps, isNotScheduledProps, playScheduledProps } = scheduleShowIconProps
    const iconProps = current ? playScheduledProps : scheduled ? isScheduledProps : isNotScheduledProps
    const timeFormated = `${moment(time).format('DD')} de ${moment(time).format('MMM - HH:mm')} hrs`
    return (
      <Button {...boxProps} onPress={this.onPressButton}>
        <Image source={_source} {...imageWrapper} />
        <LinearGradientView
          {...linearGradientViewProps}>
          <Text {...textShowProps} text={timeFormated} />
          {loading ? <Loading {...loadingProps}/> : <IconTheme {...iconProps} />}
        </LinearGradientView>
      </Button>
    )
  }
}

Show.displayName = 'ShowComponent'

Show.propTypes = {
  data: PropTypes.object,
  itemComponentProps: PropTypes.object,
  mutation: PropTypes.object,
  onPress: PropTypes.func,
  pathImage: PropTypes.string,
  imageBackgroundDefault: PropTypes.object.isRequired
}
Show.defaultProps = {
  pathImage: 'customJson.backgroundimagelive'
}

function ListItemSchedules (props) {
  const { data: { match } } = props
  return _isEmpty(match)
    ? <Show {...props} />
    : <Match {...props} />
}

ListItemSchedules.displayName = 'ListItemSchedules'

ListItemSchedules.getMutation = (props) => {
  return {
    mutation: props.mutation
  }
}

ListItemSchedules.propTypes = {
  data: PropTypes.object,
  itemComponentProps: PropTypes.object,
  onPress: PropTypes.func,
  descriptionName: PropTypes.string
}
ListItemSchedules.defaultProps = {
  onPress: () => null
}
export default withMutation(ListItemSchedules)
