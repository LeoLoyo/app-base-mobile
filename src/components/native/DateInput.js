// @flow
import React from 'react'
import DatePicker from 'react-native-datepicker'
import { StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import moment from 'moment'
import withTranslation from '../../core/withTranslation'
import withStyle from '../../core/withStyle'
import View from './View'
import Text from './Text'

export class Component extends React.Component {
  state = {
    date: new Date()
  }

  onDateChange = (newDate) => {
    const {value} = this.props
    if (!value) this.setState(() => ({date: newDate}))
    this.props.onChange(newDate)
  }

  render () {
    const {className, value, maxDate, containerStyle, containerClassName, ...props} = this.props
    const {
      dateInputStyle = styles.input,
      placeholderTextStyle = styles.placeholderText,
      dateTextStyle = styles.dateText,
      custom,
      customClassName,
      customStyle
    } = props
    const parsedValue = Number.isNaN(Date.parse(value)) ? new Date() : value
    const maxDateLimit = maxDate ? (maxDate === 'now' ? new Date() : maxDate) : null
    const dateToShow = parsedValue || this.state.date
    return (
      <View style={ containerStyle } className={ containerClassName }>
        {custom && (
          <View className={customClassName} styl={customStyle}>
            <Text style={dateTextStyle} text={moment(dateToShow).format('DD')}/>
            <Text style={dateTextStyle} text={moment(dateToShow).format('MM')}/>
            <Text style={dateTextStyle} text={moment(dateToShow).format('YYYY')}/>
          </View>
        )}
        <DatePicker
          customStyles={ {
            dateTouchBody: styles.touchBody,
            placeholderText: placeholderTextStyle,
            dateText: dateTextStyle,
            dateInput: dateInputStyle
          } }
          maxDate={ maxDateLimit }
          date={ dateToShow }
          { ...props }
          onDateChange={ this.onDateChange }
        />
      </View>
    )
  }
}

Component.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  maxDate: PropTypes.string,
  onChangeText: PropTypes.func,
  onChange: PropTypes.func,
  onDateChange: PropTypes.func,
  value: PropTypes.any,
  containerStyle: PropTypes.object,
  dateInputStyle: PropTypes.object,
  placeholderTextStyle: PropTypes.object,
  dateTextStyle: PropTypes.object,
  containerClassName: PropTypes.string,
  customClassName: PropTypes.string,
  customStyle: PropTypes.object
}

Component.defaultProps = {
  dateFormat: 'DD-MM-YYYY'
}

const styles = StyleSheet.create({
  dateTouchBody: {
    width: '100%',
    borderColor: 'transparent'
  },
  input: {
    width: '100%',
    borderColor: 'transparent'
  },
  placeholderText: {
    color: 'black',
    borderColor: 'transparent'
  },
  dateText: {
    color: 'red',
    borderColor: 'transparent'
    // fontFamily: 'Rajdhani-Regular'
  }
})

export default withStyle(withTranslation(Component,
  ['confirmBtnText', 'cancelBtnText']), ['style', 'placeholderTextStyle', 'dateTextStyle', 'dateInputStyle'])
