import React from 'react'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import {createDrawerNavigator} from 'react-navigation-drawer'
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  BottomTabBar as TabBarBottom,
  MaterialTopTabBar as TabBarTop
} from 'react-navigation-tabs'
import { each, defaultsDeep, has, get, mergeWith } from 'lodash'
import Screen from './Screen'
import { patchWithReplaceAction, patchWithAvoidDuplicates } from './utils/navigation'
import * as Transitions from './utils/transitions'

class NavigatorFactory {
  constructor (navigators, screen, options) {
    this.NAVIGATOR = navigators
    this.SCREENS = screen
    this.OPTIONS = options
  }

  buildHeader (navigator) {
    let options = defaultsDeep(get(this.OPTIONS,
      `${navigator.options}`, {}), navigator.navigatorOptions || {})

    if (has(options, 'transitioner')) {
      const transitionName = get(options, 'transitioner', undefined)
      const transition = get(Transitions, transitionName)
      if (transition) options.transitionConfig = transition
      else console.warn(`Transition ${transitionName} does not exists`)
    }

    options.navigationOptions = options.navigationOptions || {}

    if (has(options.navigationOptions, 'HeaderComponent')) {
      options.navigationOptions.header = <Screen {...options.navigationOptions.HeaderComponent} />
    }

    if (has(options.navigationOptions, 'HeaderTitleComponent')) {
      options.navigationOptions.headerTitle = <Screen {...options.navigationOptions.HeaderTitleComponent} />
    }

    if (has(options.navigationOptions, 'HeaderLeftComponent')) {
      options.navigationOptions.headerLeft = <Screen {...options.navigationOptions.HeaderLeftComponent} />
    }

    if (has(options.navigationOptions, 'HeaderRightComponent')) {
      options.navigationOptions.headerRight = <Screen {...options.navigationOptions.HeaderRightComponent} />
    }
    return options
  }

  buildTabManager (navigator) {
    let options = defaultsDeep(get(this.OPTIONS, `${navigator.options}`, {}), navigator.navigatorOptions || {})

    if (has(options, 'TabBarComponent')) {
      options.tabBarComponent = (props) => <Screen {...options.TabBarComponent} tabBarProps={props} /> // eslint-disable-line react/display-name
    }

    if (has(options, 'useTabBarComponent')) {
      const tbComponent = get(options, 'useTabBarComponent')
      options.tabBarComponent = get({TabBarTop, TabBarBottom}, tbComponent, TabBarTop)
    }

    options.navigationOptions = options.navigationOptions || {}

    return options
  }

  buildDrawerManager = (navigator) => {
    let options = {}

    mergeWith(options, {...get(this.OPTIONS, `${navigator.options}`, {}), ...navigator.navigatorOptions})

    if (has(options, 'DrawerComponent')) {
      options.contentComponent = () => <Screen {...options.DrawerComponent} /> // eslint-disable-line react/display-name
    }
    return options
  }

  buildManager = (navigator) => {
    return defaultsDeep(get(this.OPTIONS, `${navigator.options}`, {}), navigator.navigatorOptions || {})
  }

  createNavigator (navigator = {}) {
    if (navigator.type === 'screen') { // habilitar opción para Layout, agregar status bar
      const options = this.buildHeader(navigator)
      return {
        screen: (props) => <Screen {...props} {...this.SCREENS[navigator.screen]}/>, // eslint-disable-line react/display-name
        ...options
      }
    }

    if (['tab', 'stack', 'switch', 'drawer'].indexOf(navigator.type) !== -1) { // TODO: falta drawer
      let stack = {}
      const subNavigators = navigator.navigators || []
      each(subNavigators, (subNavigator) => {
        if (subNavigator.name) {
          const processedSubNavigator = this.createNavigator(subNavigator)
          if (processedSubNavigator) {
            stack[subNavigator.name] = processedSubNavigator
          }
        }
      })

      if (navigator.type === 'tab') {
        const options = this.buildTabManager(navigator)
        if (get(options, 'tabBarPosition') === 'bottom') {
          return createBottomTabNavigator(stack, options)
        }
        return createMaterialTopTabNavigator(stack, options)
      }

      if (navigator.type === 'stack') {
        const options = this.buildHeader(navigator)
        return createStackNavigator(stack, options)
      }

      if (navigator.type === 'drawer') {
        const options = this.buildDrawerManager(navigator)
        return createDrawerNavigator(stack, options)
      }

      if (navigator.type === 'switch') {
        const options = this.buildManager(navigator)
        return createSwitchNavigator(stack, options)
      }
    }
    return null
  }

  mount () {
    let stack = {}
    each(this.NAVIGATOR, (navigator) => {
      if (navigator && navigator.name) {
        stack[navigator.name] = this.createNavigator(navigator)
      }
    })

    const Navigator = createAppContainer(createSwitchNavigator(stack))
    patchWithReplaceAction(Navigator)
    patchWithAvoidDuplicates(Navigator)

    return Navigator
  }
}

export default NavigatorFactory
