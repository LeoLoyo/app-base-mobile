// NavigationService.js

import { NavigationActions } from 'react-navigation'

let _navigator

function setTopLevelNavigator (navigatorRef) {
  _navigator = navigatorRef
}

function navigate (routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  )
}

function replace (routeName, params) {
  const action = {
    type: 'Navigation/REPLACE',
    payload: NavigationActions.navigate({routeName, params})
  }
  _navigator.dispatch(action)
}

function getActiveRouteName (navigationState) {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route)
  }
  return route.routeName
}
// add other navigation functions that you need and export them

export default {
  navigate,
  replace,
  getActiveRouteName,
  setTopLevelNavigator
}
