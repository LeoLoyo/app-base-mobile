import React from 'react'
import PropTypes from 'prop-types'
import withNavigation from '../../core/withNavigation'
import withToast from '../../core/withToast'

class Redirect extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  componentDidMount () {
    const {showMessage, messageType, messageParams} = this.props
    if (showMessage) {
      this.props.toast[messageType](...messageParams)
    }
    return this.props.navigateTo()
  }

  render () {
    return null
  }
}

Redirect.propTypes = {
  navigateTo: PropTypes.func,
  messageType: PropTypes.string,
  messageParams: PropTypes.array,
  showMessage: PropTypes.bool,
  toast: PropTypes.object
}

export default withToast(withNavigation(Redirect))
