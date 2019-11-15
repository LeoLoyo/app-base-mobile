import React from 'react'
import PropTypes from 'prop-types'
import has from 'lodash/has'
import isString from 'lodash/isString'
import merge from 'lodash/merge'
import flatten from 'lodash/flatten'
import _get from 'lodash/get'
import _includes from 'lodash/includes'
import gql from 'graphql-tag'
import { StackActions, withNavigation as router } from 'react-navigation'
import withCondition from './withCondition'
import withMutation from './withMutation'
import NavigationService from './NavigatorService'

const withNavigation = (WrappedComponent, link = 'link') => {
  class Component extends React.Component {
    static defaultProps = {
      params: {},
      onModalsuccessfulDismiss: () => { },
      shouldMutateOnNavigation: false
    }

    _buildDeepLinkingUrl = (url, params) => {
      return `[app]://${url}/${_get(params, '_id', _get(params, 'id'))}}`
    }

    _navigate (extraParams = {}) {
      const params = merge({},
        _get(this.props, 'navigation.state.params', {}),
        _get(this.props, 'params', {}), extraParams || {})

      if (_get(this.props, 'popToPop', false)) {
        this.props.navigation.dispatch(StackActions.popToTop())
      }
      if (this.props.isBackButton || !this.props[link]) {
        this.props.navigation.goBack(null)
        this.props.onModalsuccessfulDismiss(params)
      } else if (isString(this.props[link])) {
        if (_includes(['openDrawer', 'closeDrawer', 'toggleDrawer'], _get(this.props, 'link'))) {
          if (this.props.navigation[_get(this.props, 'link')]) {
            return this.props.navigation[_get(this.props, 'link')]()
          }
        }
        if (this.props.replace) {
          return NavigationService.replace(this.props[link], params)
        }

        // should navigate to
        return NavigationService.navigate(this.props[link], params)
      }
    }

    onNavigate = async (extraParams = {}) => {
      const { mutation, shouldMutateOnNavigation } = this.props
      if (mutation && mutation.action && shouldMutateOnNavigation) {
        try {
          let payload = {
            variables: merge({}, _get(this.props, 'navigation.state.params', {}),
              _get(this.props, 'params', {}), extraParams || {})
          }
          if (mutation.refetchQueries) {
            payload = Object.assign({}, payload, {
              refetchQueries: flatten([mutation.refetchQueries]).map((query) => ({
                query: gql`${query}`,
                variables: payload.variables
              }))
            })
          }
          await mutation.action(payload)
          this._navigate(Object.assign({ mutationSuccess: true }, extraParams))
        } catch (err) {
          this._navigate(Object.assign({ mutationSuccess: false }, extraParams))
        }
      } else {
        this._navigate(extraParams)
      }
    }

    isRouteActive = () => {
      if (
        _get(this.props, 'validateFocus', false) &&
        has(this.props, 'navigation.state.routes') &&
        has(this.props, 'navigation.state.index')) {
        const routeIndex = this.props.navigation.state.routes.findIndex((route) => route.routeName === this.props[link])
        const currentIndex = this.props.navigation.state.index
        return routeIndex === currentIndex
      }
      return false
    }

    render () {
      return (
        <WrappedComponent {...this.props} navigateTo={this.onNavigate} isRouteActive={this.isRouteActive()} />
      )
    }
  }

  Component.propTypes = {
    isBackButton: PropTypes.bool,
    onModalsuccessfulDismiss: PropTypes.func,
    params: PropTypes.object,
    replace: PropTypes.bool,
    shouldMutateOnNavigation: PropTypes.bool,
    mutation: PropTypes.object,
    navigation: PropTypes.shape({
      goBack: PropTypes.func,
      navigate: PropTypes.func,
      popToTop: PropTypes.func,
      state: PropTypes.object,
      reset: PropTypes.func,
      dispatch: PropTypes.func
    })
  }

  return withCondition(withMutation(router(Component)))
}

export default withNavigation
