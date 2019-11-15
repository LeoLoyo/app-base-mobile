/**
 * Libraries
 */
import React from 'react'
import PropTypes from 'prop-types'
import * as COMPONENTS from './../components'
import ToastService from './ToastService'

const ToastContext = React.createContext({})
class ToastProvider extends React.PureComponent {
  static defaultProps = {
    alignment: 'bottom'
  }

  constructor (props) {
    super(props)
    this.state = {
      showToast: false,
      type: 'toast-info',
      message: 'toast message'
    }
  }

  componentDidMount () {
    ToastService.setComponent(this)
  }

  dismissToast = () => this.setState({showToast: !this.state.showToast})

  renderToast = () => {
    const {className, message} = this.state
    return (
      <COMPONENTS.View className={`toast toast-${this.props.alignment} h-10 w-100 ${className}`}>
        <COMPONENTS.View className="flex-1 align-items-center flex-row h-10">
          <COMPONENTS.Text className="w-100 text-align-center toast-text" text={message}/>
        </COMPONENTS.View>
      </COMPONENTS.View>
    )
  }

  toggleToast = (className, message, duration = 2000) => {
    this.setState(() => ({
      showToast: true,
      className,
      message
    }), () => setTimeout(() => this.setState(() => ({showToast: false})), duration))
  }

  info = (message, duration = 1000, className = '') =>
    this.toggleToast(`toast-info ${className}`, message, duration)
  success = (message, duration = 1000, className = '') =>
    this.toggleToast(`toast-success ${className}`, message, duration)
  error = (message, duration = 1000, className = '') =>
    this.toggleToast(`toast-error ${className}`, message, duration)

  render () {
    return (
      <ToastContext.Provider
        value={{
          info: this.info,
          success: this.success,
          error: this.error
        }}>
        {this.props.children}
        {this.state.showToast && this.renderToast()}
      </ToastContext.Provider>
    )
  }
}

/**
 * Props
 */
ToastProvider.propTypes = {
  children: PropTypes.object,
  config: PropTypes.object,
  alignment: PropTypes.string
}

export { ToastProvider, ToastContext }
