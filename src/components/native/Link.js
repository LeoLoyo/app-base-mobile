import React from 'react'
import {Linking} from 'react-native'
import PropTypes from 'prop-types'
import {withApollo} from 'react-apollo'
import toPairs from 'lodash/toPairs'
import {clearAccessToken, clearTimeLimit} from '../../core/Auth'
import Storage from '../../core/Storage'
import withNavigation from '../../core/withNavigation'
import {CustomComponentProvider} from '../../core/withCustomComponent'
import { CheckSessionContext, unSubcribeSession } from '../../core/CheckSession'
import {IconThemeButton} from '../../components'

class Link extends React.Component {
  static contextType = CheckSessionContext

  onPress = async (apollo) => {
    try {
      if (this.props.link) {
        const isURL = /^((http|https):\/\/)/i.test(this.props.link)

        if (isURL) {
          return Linking.openURL(this.props.link)
        }
      }

      if (this.props.setContext) {
        this.props._setContext({...this.props.setContext})
      }

      if (this.props.setStorage) {
        await Promise.resolve(
          new Promise((resolve, reject) => {
            Storage.multiSet(toPairs(this.props.setStorage), (err) => {
              if (err) return reject(err)
              resolve()
            })
          })
        )
      }

      if (this.props.startTimeLimit &&
          this.props.timeLimitSettings &&
          typeof this.props.timeLimitSettings.start === 'function') {
        this.props.timeLimitSettings.start(this.props)
      }

      this.props.navigateTo()

      if (this.props.isLogout) {
        await unSubcribeSession(this.context)
        await clearAccessToken()
        await clearTimeLimit()
        await apollo.resetStore()
      }
    } catch (error) {
      console.log({error}) // eslint-disable-line no-console
      await unSubcribeSession(this.context)
      await clearAccessToken()
      await clearTimeLimit()
      return this.props.navigateTo()
    }
  }

  render () {
    const {isRouteActive, validateFocus, isLogout, client: apollo, ...props} = this.props
    return (
      <CustomComponentProvider {...props} components={['Component']}>
        {({ Component = IconThemeButton }) => {
          return <Component {...props} onPress={() => this.onPress(apollo)} isActive={isRouteActive}/>
        }}
      </CustomComponentProvider>
    )
  }
}

Link.propTypes = {
  onPress: PropTypes.func,
  client: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  link: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  navigateTo: PropTypes.func,
  isRouteActive: PropTypes.bool,
  validateFocus: PropTypes.bool,
  Component: PropTypes.string,
  isLogout: PropTypes.bool,
  setContext: PropTypes.any,
  _setContext: PropTypes.func,
  startTimeLimit: PropTypes.any,
  timeLimitSettings: PropTypes.any,
  setStorage: PropTypes.any
}

export default withNavigation(withApollo(Link))
