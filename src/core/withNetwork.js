import React from 'react'
import {NetInfo} from 'react-native'

const withNetwork = (WrappedComponent) => {
  class Component extends React.Component {
        static displayName = 'withNetwork'

        state = {
          isConnected: false
        };

        componentDidMount () {
          NetInfo.isConnected.fetch().then(isConnected => {
            this.handleIsConnected(isConnected)
          })
          NetInfo.isConnected.addEventListener('connectionChange', this.handleIsConnected)
        }

        componentWillUnmount () {
          NetInfo.isConnected.removeEventListener('connectionChange', this.handleIsConnected)
        }

        handleIsConnected = (isConnected) => this.setState({isConnected})

        render () {
          const {isConnected} = this.state
          return (
            <WrappedComponent {...this.props} isConnected={isConnected}/>
          )
        }
  }
  return Component
}

export default withNetwork
