import React from 'react'
import firebase from 'react-native-firebase'
import PropTypes from 'prop-types'
import {pickBy} from 'lodash'

export default class Notifications extends React.Component {
  state = {
    remoteConfig: {},
    fetchedConfig: false
  }

  _resolveValues = (values) => new Promise((resolve, reject) => {
    const valuesToResolve = (values || []).map((value) => firebase.config().getValue(value))
    Promise.all(valuesToResolve).then((resolvedValues) => {
      const response = (resolvedValues || []).reduce((acc, current, index) => {
        acc[values[index]] = current.val()
        return acc
      }, {})
      resolve(response)
    })
      .catch(reject)
  })

  async componentDidMount () {
    const { config } = this.props
    const remoteVariables = pickBy(config, (i, key) => key.startsWith('remote_'))
    // Set default values
    firebase.config().enableDeveloperMode()
    firebase.config().setDefaults(remoteVariables)

    firebase.config().fetch(0)
      .then(() => firebase.config().activateFetched())
      .then((activated) => activated ? this._resolveValues(Object.keys(remoteVariables)) : {remoteConfigDisabled: true})
      .then((snapshot) => this.setState({ remoteConfig: snapshot, fetchedConfig: true }))
      .catch((err) => {
        this.setState({fetchedConfig: true})
        console.error(err)
      })
  }

  render () {
    const {remoteConfig, fetchedConfig} = this.state
    return fetchedConfig && React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        remoteConfig
      })
    })
  }
}

Notifications.propTypes = {
  children: PropTypes.any,
  config: PropTypes.object
}
