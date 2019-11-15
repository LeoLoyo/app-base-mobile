import React from 'react'
import get from 'lodash/get'
import defaultsDeep from 'lodash/defaultsDeep'
import PropTypes from 'prop-types'
import * as COMPONENTS from '../../components'
import Screen from './Screen'
import ComponentBuilder from '../../core/Wrapper'

class Component extends React.PureComponent {
  state = {
    validated: false
  }
  onSuccess = () => this.setState({validated: true})

  onError = (err) => err

  renderSection (component, extraProps = {}) {
    const renderComponent = get(this.props, component)
    if (renderComponent) {
      const Component = get(COMPONENTS, renderComponent.name)
      if (typeof Component === 'function') {
        const props = defaultsDeep({}, renderComponent.props, extraProps)
        return (
          <Component {...props} />
        )
      }
    }
    return null
  }

  render () {
    const {className, ProtectedComponent, backButton, closeButton} = this.props
    return (
      <Screen className={className} backButton={backButton} closeButton={closeButton}>
        { this.state.validated
          ? <ComponentBuilder component={ProtectedComponent} />
          : this.renderSection('ValidatorComponent', {onSuccess: this.onSuccess, onError: this.onError})
        }
      </Screen>
    )
  }
}

Component.propTypes = {
  backButton: PropTypes.object,
  className: PropTypes.string,
  closeButton: PropTypes.object,
  ProtectedComponent: PropTypes.object,
  ValidatorComponent: PropTypes.object

}

export default Component
