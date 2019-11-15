import React from 'react'
import PropTypes from 'prop-types'
import {uniq, each, merge, get} from 'lodash'
import classNamesHelper from 'classnames'
import withConfig from './withConfig'
import * as COMPONENTS from '../components'

export default (WrappedComponent) => {
  class Renderer extends React.PureComponent {
    static propTypes = {
      appComponents: PropTypes.object
    }

    renderChildren = ({name, props = {}, components = []}, key, config = {}) => {
      const {optionalAppComponents = {}, extraProps = {}} = config
      let {appComponents = optionalAppComponents} = this.props
      appComponents = {...appComponents}

      let Component = appComponents[name] || COMPONENTS[name] || null

      if (Component === null) {
        console.warn(`component ${name} does not exists`)
        return null
      }

      // eslint-disable-next-line no-extra-boolean-cast
      if (!!appComponents[name]) {
        const defaultName = Component.defaultProps.name
        const AppComponentComposition = get(COMPONENTS, defaultName, null)
        const componentDefaultProps = get(Component, 'defaultProps.props', {})

        // combining styles and classNames (including custom classNames props)
        const propsArray = [componentDefaultProps, props, extraProps]
        const stylesProps = uniq(propsArray.reduce((acc, currentProps) => {
          each(currentProps, (value, key) => {
            if (key.toLowerCase().endsWith('style')) acc.push(key)
          })
          return acc
        }, []))

        const [styles, classNames] = stylesProps.reduce((acc, styleKey) => {
          const cnKey = styleKey.replace(styleKey, styleKey === 'style' ? 'className' : 'ClassName')
          each(propsArray, propsSource => {
            acc[0][styleKey] = merge({}, acc[0][styleKey], propsSource[styleKey])
            acc[1][cnKey] = classNamesHelper(acc[1][cnKey], (propsSource[cnKey] || '').trim())
          })
          return acc
        }, [{}, {}])

        props = merge({}, componentDefaultProps, props, extraProps, classNames, styles)
        components = merge([], Component.defaultProps.components, components)
        const nextKey = `${key}-${defaultName}`

        return (
          <Component key={key}>
            {AppComponentComposition
              ? this.conditionalRenderer(AppComponentComposition, nextKey, components, props)
              : this.renderChildren({props, components, name: defaultName}, nextKey)}
          </Component>
        )
      }

      return this.conditionalRenderer(Component, key, components,
        {...props, ...extraProps}, {optionalAppComponents})
    }

    conditionalRenderer = (Component, key, components, props, config = {}) => {
      if (Component && components.length === 0) return <Component {...props} key={key} />
      return (
        <Component {...props} key={key}>
          {components
            .map((component, index) =>
              this.renderChildren(component, `${key}-${component.name}-${index}`, config))}
        </Component>
      )
    }

    render () {
      return <WrappedComponent {...this.props} renderer={this.renderChildren} />
    }
  }
  return withConfig(Renderer)
}
