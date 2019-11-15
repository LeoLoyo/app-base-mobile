import React from 'react'
import PropTypes from 'prop-types'
import {shallowCompare} from '../../core/utils/shallow-compare'
import {Button} from '../../components'

class Refetcher extends React.Component {
  static defaultProps = {
    onPress: () => {},
    variables: {}
  }

  state = {
    pressed: false
  }

  static propTypes = {
    children: PropTypes.any,
    refetch: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    onPress: PropTypes.func,
    Component: PropTypes.func,
    variables: PropTypes.object,
    _setContext: PropTypes.func,
    setContext: PropTypes.any
  }

  _getPayload = ({variables, extra = {}}) => ({...variables, ...extra})

  shouldComponentUpdate (nextProps) {
    const currentVariables = this._getPayload(this.props)
    const nextVariables = this._getPayload(nextProps)
    return shallowCompare({props: currentVariables, state: {}}, nextVariables, {})
  }

  onPress = (...args) => {
    try {
      const currentVariables = this._getPayload(this.props)
      if (typeof this.props._setContext === 'function' && this.props.setContext) {
        this.props._setContext(this.props.setContext)
      }

      if (typeof this.props.refetch === 'function') {
        this.props.refetch(currentVariables)
      }

      if (typeof this.props.onPress === 'function') {
        this.props.onPress(...args)
      }
    } catch (error) {
      console.error(error)
    }
  }

  render () {
    const {children, variables, ...props} = this.props
    return (
      <Button {...props} onPress={this.onPress}>
        {children}
      </Button>
    )
  }
}

export default Refetcher
