import React from 'react'
import {View} from '../../components'
import PropTypes from 'prop-types'
import {withNavigation} from 'react-navigation'

class Component extends React.Component {
  static displayName = 'DelayedView'
  static defaultProps = {
    link: 'AuthValidator',
    delay: 10000
  }

  componentDidMount () {
    setTimeout(() => {
      this.props.navigation.navigate(this.props.link)
    }, (this.props.delay))
  }

  render () {
    return (
      <View {...this.props}>
        {this.props.children}
      </View>
    )
  }
}

Component.propTypes = {
  link: PropTypes.string,
  delay: PropTypes.number,
  navigation: PropTypes.object,
  children: PropTypes.node
}

export default withNavigation(Component)
