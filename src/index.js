import React from 'react'
import { Alert as NativeAlert } from 'react-native'
import NavigatorFactory from './core/NavigatorFactory'
import { GraphQLProvider, getClient as getGraphClient } from './core/GraphQL'
import CheckSession from './core/CheckSession'
import { ThemeProvider } from './core/Theme'
import { ConfigProvider } from './core/Config'
import { TranslationProvider, translate } from './core/Translation'
import { ToastProvider } from './core/Toast'
import { TimeLimitProvider } from './core/TimeLimit'
import NavigationService from './core/NavigatorService'
import { AppComponentsProvider } from './core/AppComponents'
import { PortalProvider } from './core/Portal'

/**
 * Main Class
 */
export default class OTTBuilder {
  _NotificationService = null

  navigationMounted = false

  constructor (config = {}) {
    this.LAYOUTS = {}
    this.ASSETS = {}
    this.THEME = {}
    this.ICONS = {}
    this.VARIABLES = {}
    this.CONFIG = config.config
    this.APP_COMPONENTS = config.appComponents
    this.navigatorOptions = {}
    this.appolloGraph = config.config.graph
    this.setNavigator(config.navigator)
      .setNavigatorOptions(config.navigatorOptions)
      .setScreens(config.screens)
      .setTheme(config.theme)
      .setLanguages(config.i18n)
      .setStyle(config.styles)
    this.navigatorTracker = this.navigatorTracker.bind(this)
  }

  getDefaultLanguage () {
    return (this.CONFIG && this.CONFIG.language && this.CONFIG.language.default) || 'en'
  }

  setNavigator (navigator = []) {
    this.NAVIGATOR = navigator
    return this
  }

  setNavigatorOptions (config = {}) {
    this.NAVIGATOR_OPTIONS = config
    return this
  }

  setScreens (screens = []) {
    this.SCREENS = screens
    return this
  }

  setStyle (styles = {}) {
    this.STYLES = styles
    return this
  }

  setAssets ({ images = {} }) {
    this.ASSETS.images = images
    return this
  }

  setTheme (theme = {}) {
    this.THEME = theme
    return this
  }

  setLanguages (languages = {}) {
    this.LANGUAGES = languages
    return this
  }

  setIconReference (ref) {
    this.ICONS = ref
    return this
  }

  setVariables (variables) {
    this.VARIABLES = variables
    return this
  }

  setGraphQLMutations ({ mutations }) {
    this.CONFIG.mutations = mutations
    return this
  }

  async navigatorTracker (prevState, currentState) {
    const currentScreen = NavigationService.getActiveRouteName(currentState)
    const prevScreen = NavigationService.getActiveRouteName(prevState)
    if (!this.navigationMounted && (currentScreen !== prevScreen)) {
      // await Notifications.getInitialNotification()
    }
    this.navigationMounted = true
  }

  launchAlert = () => {
    const { viewOnNetworkError, sessionNetworkTitle, sessionNetworkMsg, sessionAlert = false } = this.CONFIG.auth
    const title = translate(this.getDefaultLanguage(), sessionNetworkTitle, this.LANGUAGES)
    const msg = translate(this.getDefaultLanguage(), sessionNetworkMsg, this.LANGUAGES)
    if (sessionAlert) {
      NavigationService.navigate(viewOnNetworkError)
      NativeAlert.alert(
        title,
        msg,
        [
          {
            text: 'Aceptar',
            onPress: () => null
          }
        ],
        { cancelable: false }
      )
      return
    }
    NavigationService.navigate(viewOnNetworkError)
  }

  mount () {
    const { images } = this.ASSETS
    const navigator = new NavigatorFactory(this.NAVIGATOR, this.SCREENS, this.NAVIGATOR_OPTIONS)
    const AppNavigator = navigator.mount()
    const graphHandlers = {
      // TODO: Maybe handle or look a better way to ge main route
      // Something like navigationService.navigateInit()
      onNetworkError: this.launchAlert
    }
    return (
      <PortalProvider config={this.CONFIG}>
        <ConfigProvider config={this.CONFIG}>
          <GraphQLProvider client={getGraphClient(this.CONFIG, graphHandlers)}>
            <ThemeProvider
              theme={this.THEME}
              styles={this.STYLES}
              images={images}
              icons={this.ICONS}
              variables={this.VARIABLES}>
              <TranslationProvider lang={this.getDefaultLanguage()} languages={this.LANGUAGES}>
                <ToastProvider config={this.CONFIG}>
                  <AppComponentsProvider components={this.APP_COMPONENTS}>
                    <TimeLimitProvider config={this.CONFIG}>
                      <CheckSession action={this.launchAlert}>
                        <AppNavigator
                          ref={NavigationService.setTopLevelNavigator}
                          onNavigationStateChange={this.navigatorTracker}>
                        </AppNavigator>
                      </CheckSession>
                    </TimeLimitProvider>
                  </AppComponentsProvider>
                </ToastProvider>
              </TranslationProvider>
            </ThemeProvider>
          </GraphQLProvider>
        </ConfigProvider>
      </PortalProvider>
    )
  }
}
