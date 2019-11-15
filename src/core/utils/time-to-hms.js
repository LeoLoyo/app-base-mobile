import _isNaN from 'lodash/isNaN'

const convertHMS = (value) => {
  if (_isNaN(value)) {
    console.warn('Value must have a Number')
    return 0
  }
  const sec = parseInt(value, 10) // convert value to number if it's string
  let hours = Math.floor(sec / 3600) // get hours
  let minutes = Math.floor((sec - hours * 3600) / 60) // get minutes
  let seconds = sec - hours * 3600 - minutes * 60 //  get seconds
  // add 0 if value < 10
  if (hours < 10) hours = `0${hours}`
  if (minutes < 10) minutes = `0${minutes}`
  if (seconds < 10) seconds = `0${seconds}`

  return `${hours}:${minutes}:${seconds}`
}

export {convertHMS}
