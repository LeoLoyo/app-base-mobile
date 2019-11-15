import { isNumber } from 'lodash'
import moment from 'moment'
import 'moment/locale/es'

const TimeFormatter = (input, { key = 'time', format = 'minutes', suffix = 'minutos' }) => {
  const data = isNumber(input) ? input : input
  let response = ''
  const formats = {
    seconds: (input) => `${parseInt(input / 3600)} ${parseInt(input / 3600) === 1
      ? suffix.slice(0, suffix.length - 1) : suffix}`,
    minutes: (input) => `${parseInt(input / 60)} ${parseInt(input / 60) === 1
      ? suffix.slice(0, suffix.length - 1) : suffix}`,
    'moment:diff:hours': (input) => {
      const diff = moment().diff(moment(input), 'hours')
      return diff >= 0 ? diff : 0
    }
  }

  if (typeof formats[format] === 'function') {
    response = formats[format](data)
  }

  return {
    [key]: response
  }
}

const FormatDate = (prop, { key, format = 'YYYY-MM-DD', defaultDate = false, locale = 'es' }) => {
  const date = prop || new Date()
  moment.locale(locale)
  const fallback = defaultDate ? moment().format(format) : ''
  return {
    [key]: moment(date).isValid() ? moment(date).format(format) : fallback
  }
}

const TodayDate = (prop, { key, format = 'YYYY-MM-DD' }) => {
  const date = new Date()
  return { [key]: moment(date).format(format) }
}

const CompareDates = (prop, { key, compareWithDate = new Date(), diff = 'months' }) => {
  return { [key]: moment(prop).diff(moment(compareWithDate), diff) }
}

const DateTimeFromMoment = (prop, { key, compareWithDate = new Date(), locale = 'es' }) => {
  moment.locale(locale)
  return { [key]: moment(prop).from(moment(compareWithDate)) }
}

const FormatTime = (prop, { key, params = {} }) => {
  const h = Math.floor(prop / 3600)
  const m = Math.floor((prop % 3600) / 60)
  const s = prop % 60
  return {
    [key]: [
      h > 0 ? h : (params.hours ? params.hours : h),
      m > 9 ? m : (h ? '0' + m : m || '0'),
      s > 9 ? s : '0' + s
    ].filter(a => a).join(':')
  }
}

const UtcDiff = (prop, { key }) => {
  return {
    [key]: moment().utcOffset()
  }
}

export {
  UtcDiff,
  TimeFormatter,
  FormatDate,
  FormatTime,
  TodayDate,
  CompareDates,
  DateTimeFromMoment
}
