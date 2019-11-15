import update from 'immutability-helper'
import {NavigationActions} from 'react-navigation'
import {get, has} from 'lodash'

export const patchWithReplaceAction = (Navigator) => {
  const removeCurrentRoute = (state) => {
    const { index, routes } = state
    const route = routes[index]

    if (typeof route.index !== 'undefined') {
      return update(state, {
        routes: {
          [index]: { $set: removeCurrentRoute(route) }
        }
      })
    }

    const nextRoutes = routes.filter((v, i) => i !== index)

    if (!nextRoutes.length) {
      return update(state, {
        $unset: ['index'],
        routes: {$set: nextRoutes}
      })
    }

    return update(state, {
      index: {$set: (nextRoutes.length - 1)},
      routes: {$set: nextRoutes}
    })
  }

  const defaultGetStateForAction = Navigator.router.getStateForAction

  Navigator.router.getStateForAction = (action, state) => {
    if (action.type === 'Navigation/REPLACE') {
      // Prepare the state for replacing
      state = removeCurrentRoute(state)
      action = action.payload
    }

    return defaultGetStateForAction(action, state)
  }
}

export const patchWithAvoidDuplicates = (Navigator) => {
  const defaultGetStateForAction = Navigator.router.getStateForAction

  let isDebounced = false

  let timeOutReference = null
  const startDebounce = () => {
    if (timeOutReference) clearTimeout(timeOutReference)
    isDebounced = true
    timeOutReference = setTimeout(() => (isDebounced = false), 500)
  }

  Navigator.router.getStateForAction = (action, state) => {
    const getRoute = (state) => {
      const route = state.routes[state.index]
      return typeof route.index === 'undefined' ? route : getRoute(route)
    }
    const nextState = defaultGetStateForAction(action, state)

    if (!state || !nextState) {
      startDebounce()
      return nextState || state
    }

    const currentRoute = getRoute(state)
    const nextRoute = getRoute(nextState)
    if (currentRoute.routeName !== nextRoute.routeName ||
        currentRoute.key === nextRoute.key) {
      startDebounce()
      return nextState
    }

    let mergeAction = action
    if (currentRoute.routeName === nextRoute.routeName &&
      currentRoute.key !== nextRoute.key &&
      isDebounced &&
      !get(nextRoute, 'params.BYPASS_DEBOUNCED_NAVIGATION', false)
    ) {
      mergeAction = NavigationActions.setParams({
        params: nextRoute.params,
        key: currentRoute.key
      })
    }

    if (has(mergeAction, 'params.BYPASS_DEBOUNCED_NAVIGATION')) {
      mergeAction.params.BYPASS_DEBOUNCED_NAVIGATION = false
    }

    startDebounce()

    return defaultGetStateForAction(mergeAction, state)
  }
}
