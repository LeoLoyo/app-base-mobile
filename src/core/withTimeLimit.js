
import React from 'react'
import {TimeLimitContext} from './TimeLimit'
import Storage from './Storage'
import NavigatorService from './NavigatorService'

const withTimeLimit = (WrappedComponent) => {
  class Component extends React.Component {
    async componentDidUpdate () {
      try {
        const timeLimitSettings = await Storage.getItem('time-limit')
        if (timeLimitSettings) {
          const {start, seconds} = JSON.parse(timeLimitSettings)
          const diff = Date.now() - start
          const elapsed = Math.floor(diff / 1000)
          if (elapsed >= seconds) {
            NavigatorService.replace('TimeLimitScreen')
          }
        }
      } catch (error) {
        console.error(error)
      }
    }

    async componentDidMount () {
      try {
        const timeLimitSettings = await Storage.getItem('time-limit')
        if (timeLimitSettings) {
          const {start, seconds} = JSON.parse(timeLimitSettings)
          const diff = Date.now() - start
          const elapsed = Math.floor(diff / 1000)
          if (elapsed >= seconds) {
            NavigatorService.navigate('TimeLimitScreen')
          }
        }
      } catch (error) {
        console.error(error)
      }
    }

    render () {
      return (
        <TimeLimitContext.Consumer>
          { (ctx) => <WrappedComponent timeLimit={ctx} {...this.props}/> }
        </TimeLimitContext.Consumer>
      )
    }
  }

  Component.propTypes = {}

  return Component
}

export default withTimeLimit
