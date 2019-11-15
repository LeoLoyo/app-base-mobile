/**
 * Libraries
 */
import React from 'react'
import PropTypes from 'prop-types'
import Storage from './Storage'
import {has} from 'lodash'
const TimeLimitContext = React.createContext({})
class TimeLimitProvider extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {}
  }

  static startTimeLimit ({settings}) {
    if (has(settings, 'time_limit')) {
      // //console.log('time limit', settings)
      const timeLimitValue = parseInt(settings.time_limit)
      if (timeLimitValue <= 0) return null
      const config = JSON.stringify({start: Date.now(), seconds: timeLimitValue * 60})
      Storage.setItem('time-limit', config).then((resp) => {
        // //console.log(resp)
      })
        .catch((err) => console.error(err))
    }
  }

  static clearTimeLimit () {
    return Storage.removeFromStorage('time-limit')
  }

  render () {
    return (
      <TimeLimitContext.Provider
        value={{start: TimeLimitProvider.startTimeLimit, clear: TimeLimitProvider.clearTimeLimit}}>
        {this.props.children}
      </TimeLimitContext.Provider>
    )
  }
}

/**
 * Props
 */
TimeLimitProvider.propTypes = {
  children: PropTypes.object,
  config: PropTypes.object
}

export {TimeLimitContext, TimeLimitProvider}
