/**
 * Libraries
 */
import React from 'react'
import PropTypes from 'prop-types'
const ConfigContext = React.createContext({})
class ConfigProvider extends React.PureComponent {
  render () {
    const { config } = this.props
    return (
      <ConfigContext.Provider value={{...config}}>
        {this.props.children}
      </ConfigContext.Provider>
    )
  }
}

/**
 * Props
 */
ConfigProvider.propTypes = {
  children: PropTypes.object,
  config: PropTypes.object,
  remoteConfig: PropTypes.object
}

export { ConfigProvider, ConfigContext }
