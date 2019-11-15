import React from 'react'
import PropTypes from 'prop-types'
import { withApollo } from 'react-apollo'
import { clearAccessToken, clearTimeLimit } from '../../core/Auth'
import withNavigation from '../../core/withNavigation'
import { CustomComponentProvider } from '../../core/withCustomComponent'
import { IconThemeButton } from '../../components'
import withNetwork from '../../core/withNetwork'
import { CheckSessionContext, unSubcribeSession } from '../../core/CheckSession'
class LinkRestricted extends React.Component {
  static contextType = CheckSessionContext

  onPress = async (apollo) => {
    const { closeDrawer, isConnected, isLogout, navigateTo, navigation } = this.props
    try {
      if (isLogout && isConnected) {
        closeDrawer && navigation.closeDrawer()
        await unSubcribeSession(this.context)
        await clearAccessToken()
        await clearTimeLimit()
        await apollo.resetStore()
        return navigateTo()
      }
    } catch (error) {
      console.warn(error)
      await unSubcribeSession(this.context)
      await clearAccessToken()
      await clearTimeLimit()
      return navigateTo()
    }
  }

  render () {
    const { isRouteActive, validateFocus, isLogout, client: apollo, ...props } = this.props
    return (
      <CustomComponentProvider {...props} components={['Component']}>
        {({ Component = IconThemeButton }) => {
          return <Component {...props} onPress={() => this.onPress(apollo)} isActive={isRouteActive} />
        }}
      </CustomComponentProvider>
    )
  }
}

LinkRestricted.propTypes = {
  onPress: PropTypes.func,
  client: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  isConnected: PropTypes.bool,
  link: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  navigateTo: PropTypes.func,
  isRouteActive: PropTypes.bool,
  validateFocus: PropTypes.bool,
  Component: PropTypes.string,
  isLogout: PropTypes.bool,
  closeDrawer: PropTypes.bool,
  navigation: PropTypes.object
}

LinkRestricted.defaultProps = {
  closeDrawer: false
}

export default withNetwork(withNavigation(withApollo(LinkRestricted)))
