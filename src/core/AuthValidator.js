import React from 'react'
import { withNavigation } from 'react-navigation'
import PropTypes from 'prop-types'
import * as COMPONENTS from '../components'

class Component extends React.Component {
  constructor (props) {
    super(props)
    this._bootstrapAsync()
  }

  // Fetch the token from storage then navigate to our appropriate place
  async _bootstrapAsync () {
    this.props.navigation.navigate('Signin')
  };

  // Render any loading content that you like here
  render () {
    return (
      <COMPONENTS.View className={this.props.className}>
        <COMPONENTS.LoadingComponent size="large" color={this.props.loadingComponentColor}/>
      </COMPONENTS.View>
    )
  }
}

Component.propTypes = {
  className: PropTypes.string,
  loadingComponentColor: PropTypes.string,
  navigation: PropTypes.object
}

Component.defaultProps = {
  className: 'absolute-fill bg-dark flex-1 align-items-center justify-content-center',
  loadingComponentColor: 'white'
}

export default withNavigation(Component)
