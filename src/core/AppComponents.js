import React from 'react'
import PropTypes from 'prop-types'
import withRenderer from './withRenderer'
const AppComponentsContext = React.createContext()

class AppComponentsProviderComponent extends React.PureComponent {
  constructor (props) {
    super(props)
    const {components = {}} = this.props
    this.components = this._createComponents(components)
  }

  renderChildren = (children, props) => React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child
    return React.cloneElement(child, props)
  })

  _createComponents = (components) => {
    const {renderer} = this.props
    const self = this
    return Object.keys(components).reduce((acc, componentKey) => {
      const component = components[componentKey]
      class Component extends React.Component {
        static displayName = componentKey
        static defaultProps = component
        render () {
          const {children, ...props} = this.props
          return children
            ? self.renderChildren(children, props)
            : renderer(component, component.name, {
              optionalAppComponents: self.components,
              extraProps: {...this.props}
            })
        }
      }

      acc[componentKey] = Component
      return acc
    }, {})
  }

  render () {
    return (
      <AppComponentsContext.Provider value={this.components}>
        {this.props.children}
      </AppComponentsContext.Provider>
    )
  }
}

const AppComponentsProvider = withRenderer(AppComponentsProviderComponent)

/**
 * Props
 */

AppComponentsProviderComponent.propTypes = {
  children: PropTypes.object,
  components: PropTypes.object,
  renderer: PropTypes.func
}

export { AppComponentsProvider, AppComponentsContext }
