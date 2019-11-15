import React from 'react'
import PropTypes from 'prop-types'
import * as COMPONENTS from '../../components'
import {withNavigation} from 'react-navigation'
import withConfig from '../../core/withConfig'

class Component extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }
  render () {
    const {className, ...props} = this.props
    return (
      <COMPONENTS.View className={className} {...props} >
        {this.props.children}
      </COMPONENTS.View>
    )
  }
}

Component.propTypes = {
  children: PropTypes.string,
  className: PropTypes.string,
  imageProps: PropTypes.object,
  navigation: PropTypes.object,
  titleProps: PropTypes.object,
  config: PropTypes.object
}

export default withNavigation(withConfig(Component))
