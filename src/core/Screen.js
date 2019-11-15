import React from 'react'
import {StatusBar} from 'react-native'
import PropTypes from 'prop-types'
import {get, merge} from 'lodash'
import Wrapper from './Wrapper' // eslint-disable-line no-unused-vars
import withRenderer from './withRenderer'
import withAppComponents from './withAppComponents'
import {isAuthenticated} from './Auth'

/**
 * TODO: ADD Authentication settings
 */
class Component extends React.PureComponent {
  static defaultProps = {
    name: 'SafeAreaView',
    components: [],
    props: {},
    extraProps: {},
    shouldSetStatusBarProps: false,
    statusBarProps: {
      hidden: true
    }
  }

  async componentDidMount () {
    const {config, redirect = null, requiresAuth = false, navigation} = this.props
    const isAuth = await this.isAuth
    const defaultAuthUrl = get(config, 'auth.defaultAuthUrl', 'Auth')
    const authUrl = get(redirect, 'authenticatedUrl', defaultAuthUrl)
    const unAuthUrl = get(redirect, 'unAuthenticatedUrl', defaultAuthUrl)

    if (requiresAuth && !isAuth) {
      setTimeout(() => {
        navigation.navigate(unAuthUrl)
      }, (get(redirect, 'timeOut', 0)))
    }

    if (redirect) {
      setTimeout(() => {
        navigation.navigate(isAuth ? authUrl : unAuthUrl)
      }, (get(redirect, 'timeOut', 0)))
    }
  }

  get isAuth () {
    return isAuthenticated()
  }

  isAuth = () => isAuthenticated()

  screenValidators = {
    isAuth: this.isAuth
  }

  render () {
    const {name, props, extraProps, components, statusBarProps, renderer, tabBarProps} = this.props
    const params = merge({}, get(this.props, 'navigation.state.params', {}))
    let mergedProps = props
    if (tabBarProps) {
      mergedProps = merge({}, mergedProps, {tabBarProps})
    }
    return [
      this.props.shouldSetStatusBarProps && (<StatusBar {...statusBarProps} key={1} />),
      renderer({name, props: {...mergedProps, params}, components}, name, {extraProps})
    ]
  }
}

Component.propTypes = {
  name: PropTypes.string,
  components: PropTypes.array,
  props: PropTypes.object,
  extraProps: PropTypes.object,
  statusBarProps: PropTypes.object,
  renderer: PropTypes.func,
  redirect: PropTypes.any,
  tabBarProps: PropTypes.object,
  shouldSetStatusBarProps: PropTypes.bool,
  config: PropTypes.object,
  requiresAuth: PropTypes.bool,
  navigation: PropTypes.object
}

Component.defaultProps = {
  name: 'SafeAreaView'
}

export default withAppComponents(withRenderer(Component))
