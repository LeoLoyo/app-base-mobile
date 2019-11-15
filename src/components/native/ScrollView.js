import React from 'react'
import { ScrollView, Keyboard, RefreshControl } from 'react-native'
import PropTypes from 'prop-types'
import _isFunction from 'lodash/isFunction'
import withStyle from '../../core/withStyle'

const supportedKeyboardEvents = [
  'keyboardWillShow',
  'keyboardDidShow',
  'keyboardWillHide',
  'keyboardDidHide',
  'keyboardWillChangeFrame',
  'keyboardDidChangeFrame'
]
const keyboardEventToCallbackName = (eventName) => (
  'on' + eventName[0].toUpperCase() + eventName.substring(1)
)

class Component extends React.Component {
  scrollRef = null
  callbacks = {}

  componentDidMount () {
    this._mapKeyboardEvents()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.scrollToTop !== this.props.scrollToTop && this.props.scrollToTop === true && this.scrollRef) {
      this.scrollRef.scrollTo({x: 0, y: 0, animated: true})
    }
  }

  componentWillUnmount () {
    Object.values(this.callbacks).forEach((callback) => callback.remove())
  }

  _setScrollRef = (ref) => (this.scrollRef = ref)

  _mapKeyboardEvents = () => {
    // Keyboard events
    supportedKeyboardEvents.forEach((eventName) => {
      const callbackName = keyboardEventToCallbackName(eventName)
      const callbackFn = this.props[callbackName] || this[callbackName]
      if (callbackFn) {
        this.callbacks[eventName] = Keyboard.addListener(eventName, callbackFn)
      }
    })
  }

  onKeyboardWillShow = () => {
    this.scrollRef && this.scrollRef.scrollTo({x: 0, y: 200, animated: true})
  }

  onKeyboardWillHide = () => {
    this.scrollRef && this.scrollRef.scrollTo({x: 0, y: 0, animated: true})
  }
  _onRefresh = () => {
    const { refetchVars = {} } = this.props
    if (_isFunction(this.props._onRefresh)) {
      this.props._onRefresh(refetchVars)
    }
  }

  render () {
    return (
      <ScrollView
        ref={this._setScrollRef}
        contentContainerStyle={{width: '100%', justifyContent: 'space-between'}}
        {...this.props}
        refreshControl={this.props.refreshControl ? <RefreshControl
          {...this.props.refreshControlProps}
          refreshing={this.props.refreshing}
          onRefresh={this._onRefresh}
        /> : null}
      >
        {this.props.children}
      </ScrollView>
    )
  }
}

Component.propTypes = {
  children: PropTypes.any,
  refreshControl: PropTypes.any,
  refreshing: PropTypes.bool,
  scrollToTop: PropTypes.bool,
  refreshControlProps: PropTypes.object,
  _onRefresh: PropTypes.func,
  refetchVars: PropTypes.any
}

Component.defaultProps = {
  refreshControlProps: {},
  refreshControl: false,
  refreshing: false,
  _onRefresh: () => null
}

export default withStyle(Component)
