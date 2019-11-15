import React from 'react'
import PropTypes from 'prop-types'
import {get, merge} from 'lodash'
import * as COMPONENTS from '../'
import withNavigation from '../../core/withNavigation'

/**
 * This component is just a PropsManager with access to the navigation params.
 * usefull to perform navigation based on data coming from different views ahead of it (like modals).
 */

class NavigationManager extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    navigateTo: PropTypes.func.isRequired
  }

  _onModalSuccessfulDismiss = (data) => {
    data = merge({},
      data,
      {BYPASS_DEBOUNCED_NAVIGATION: get(this.props, 'BYPASS_DEBOUNCED_NAVIGATION', false)})
    return this.props.navigateTo(data)
  }

  render () {
    const routeIndex = get(this.props, 'navigation.state.index', 0)
    return (
      <COMPONENTS.PropsManager
        {...this.props}
        navigationParams={get(this.props, 'navigation.state.params',
          get(this.props, `navigation.state.routes.${routeIndex}.params`, {}))}
        onModalsuccessfulDismiss={this._onModalSuccessfulDismiss}>
        {this.props.children}
      </COMPONENTS.PropsManager>
    )
  }
}

export default withNavigation(NavigationManager)
