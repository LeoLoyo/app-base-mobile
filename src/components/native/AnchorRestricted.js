import React from 'react'
import PropTypes from 'prop-types'
import { Alert as NativeAlert } from 'react-native'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import withNavigation from '../../core/withNavigation'
import { Button } from '../../components'
import { isAuthenticated } from '../../core/Auth'

class AnchorRestricted extends React.Component {
  launchAlert = () => {
    const { title = null, message = null } = this.props
    return NativeAlert.alert(
      title,
      message,
      [
        {
          text: 'OK',
          style: 'OK'
        }
      ]
    )
  }

  canView = async () => {
    const { purchased, config, navigation } = this.props
    const defaultAuthUrl = get(config, 'auth.defaultAuthUrl', 'Auth')
    let user = await isAuthenticated()
    if (!user) return navigation.navigate(defaultAuthUrl)
    return isEqual(purchased, 1) ? this.props.navigateTo() : this.launchAlert()
  }

  render () {
    const { children, ...props } = this.props
    return (
      <Button {...props} onPress={this.canView}>
        {children}
      </Button>
    )
  }
}

AnchorRestricted.propTypes = {
  children: PropTypes.any,
  config: PropTypes.object,
  message: PropTypes.string,
  navigateTo: PropTypes.func,
  navigation: PropTypes.any,
  purchased: PropTypes.any,
  title: PropTypes.string
}

export default withNavigation(AnchorRestricted)
