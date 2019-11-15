import React from 'react'
import PropTypes from 'prop-types'
import isFunction from 'lodash/isFunction'
import isString from 'lodash/isString'
import memoize from 'memoize-one'
import withAppComponents from './withAppComponents'
import * as COMPONENTS from '../components'

const _componetizedProps = (props, appComponents, componentProps = []) => {
  const componetizedProps = componentProps.reduce((acc, prop) => {
    if (!props[prop]) return acc
    if (isFunction(props[prop])) {
      acc[prop] = props[prop]
    } else if (isString(props[prop])) {
      const name = props[prop]
      let Component = appComponents[name] || COMPONENTS[name]
      acc[prop] = Component
    }
    return acc
  }, {})
  return componetizedProps
}

// Re-run the filter whenever the list of props changes:
const memoizedProps = memoize(
  (props, appComponents, componentProps) => _componetizedProps(props, appComponents, componentProps)
)

export default (WrappedComponent, componentProps = []) => {
  class Component extends React.Component {
    static propTypes = {
      appComponents: PropTypes.object
    }

    static displayName = 'WithCustomComponent'
    render () {
      const {appComponents = {}, ...props} = this.props
      const componetizedProps = memoizedProps(props, appComponents, componentProps)
      return <WrappedComponent {...props} {...componetizedProps} />
    }
  }

  return withAppComponents(Component)
}

const CustomComponentMapper = withAppComponents((props) => {
  const {appComponents = {}, components, ...extraProps} = props
  const componetizedProps = memoizedProps(extraProps, appComponents, components)
  return props.children(componetizedProps)
})

export const CustomComponentProvider = React.memo((props) => <CustomComponentMapper {...props} />)
CustomComponentProvider.displayName = 'CustomComponentProvider'
