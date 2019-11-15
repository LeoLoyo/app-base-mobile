
import React from 'react'
import PropTypes from 'prop-types'
import TouchableOpacity from '../native/TouchableOpacity'
import withQuery from '../../core/withQuery'
import withNavigation from '../../core/withNavigation'
import {clearAccessToken, clearProfileId} from '../../core/Auth'
import { ApolloConsumer } from 'react-apollo'
import { get } from 'lodash'
import * as COMPONENTS from '../../components'

class Component extends React.Component {
  constructor (props) {
    super(props)
    this.onLogout = this.onLogout.bind(this)
    this.renderButton = this.renderButton.bind(this)
    this.renderScreen = this.renderScreen.bind(this)
  }

  async onLogout (apollo) {
    try {
      await clearAccessToken()
      await clearProfileId()
      apollo.resetStore()
      this.props.navigateTo()
    } catch (error) {
      await clearAccessToken()
      await clearProfileId()
      this.props.navigateTo()
    }
  }

  renderButton (apollo) {
    return (
      <TouchableOpacity {...this.props} onPress={() => this.onLogout(apollo)}>
        {this.props.children}
      </TouchableOpacity>
    )
  }

  renderScreen (apollo) {
    const reason = get(this.props, this.props.reasonPath)
    if (this.props.timeOut && this.props.timeLimitSettings && reason) {
      const {icon, message} = this.props.timeLimitSettings[reason]
      return React.Children.map(this.props.children, (child) => {
        if (child.props.mapValue === 'reason-icon') {
          return React.cloneElement(child, {name: icon})
        }

        if (child.props.mapValue === 'reason-text') {
          return React.cloneElement(child, {text: message})
        }

        if (child.props.mapValue === 'button-handler') {
          return React.cloneElement(child, {onPress: () => this.onLogout(apollo)})
        }

        return React.cloneElement(child)
      })
    }
    return this.props.children
  }

  render () {
    return (
      <ApolloConsumer>
        {(apollo) => this.props.link ? this.renderButton(apollo)
          : <COMPONENTS.View className={this.props.className}>
            {this.renderScreen(apollo)}
          </COMPONENTS.View>
        }
      </ApolloConsumer>
    )
  }
}

Component.propTypes = {
  className: PropTypes.string,
  children: PropTypes.array,
  client: PropTypes.object,
  navigation: PropTypes.object,
  link: PropTypes.string,
  logoutLink: PropTypes.string,
  titleProps: PropTypes.object,
  config: PropTypes.object,
  reasonPath: PropTypes.string,
  timeLimitSettings: PropTypes.array,
  timeOut: PropTypes.bool,
  navigateTo: PropTypes.func
}

export default withNavigation(withQuery(Component))
