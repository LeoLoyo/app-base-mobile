/**
 * Libraries
 */
import React from 'react'
import PropTypes from 'prop-types'
import {size} from 'lodash'
/**
 * Components
 */
import * as COMPONENTS from '../components'
import withConfig from './withConfig'

/**
 * Main component
 */

/**
  * UNUSED CODE MUST DELETE IT
  *
**/

class Component extends React.Component {
  render () {
    const {component, ...props} = this.props
    const {name, components = []} = component
    const {appComponents = {}} = this.props.config
    const appComponent = appComponents[name]
    const isAppComponent = !!appComponent
    const WrappedComponent = COMPONENTS[name] ? COMPONENTS[name] : null

    if (isAppComponent) {
      const {props: appComponentProps = {}, components: appComponentComponents = []} = appComponent
      appComponent.props = {...appComponentProps, ...component.props}
      appComponent.components = [...appComponentComponents, ...components]
      return (
        <Component {...props} component={appComponent}/>
      )
    } else if (typeof WrappedComponent === 'function') {
      if (size(components)) {
        return (
          <WrappedComponent {...component.props} {...props}>
            {(components || []).map((component, i) => {
              return <Component key={i} {...component.props} component={component}/>
            })}
          </WrappedComponent>
        )
      }
      return <WrappedComponent {...component.props} {...props} />
    }
    return null
  }
}

export default withConfig(Component)

/**
 * Props
 */
Component.propTypes = {
  component: PropTypes.object.isRequired,
  listeners: PropTypes.object,
  config: PropTypes.object,
  children: PropTypes.node
}
