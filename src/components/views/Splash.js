import React from 'react'
import PropTypes from 'prop-types'
import * as COMPONENTS from '../../components'
import {withNavigation} from 'react-navigation'

class Component extends React.Component {
  static defaultProps = {
    link: 'AuthValidator'
  }

  componentDidMount () {
    setTimeout(() => {
      this.props.navigation.navigate(this.props.link)
    }, (this.props.delay || 10000))
  }

  render () {
    const {image, ...props} = this.props
    return (
      <COMPONENTS.View {...props}>
        <COMPONENTS.Image {...image}/>
      </COMPONENTS.View>
    )
  }
}

Component.propTypes = {
  className: PropTypes.string,
  delay: PropTypes.number,
  image: PropTypes.object,
  navigation: PropTypes.object,
  link: PropTypes.string
}

export default withNavigation(Component)
