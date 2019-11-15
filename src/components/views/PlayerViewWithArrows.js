import React from 'react'
import PropTypes from 'prop-types'
import {Dimensions} from 'react-native'
import * as COMPONENTS from '../../components'
const {width, height} = Dimensions.get('window')

class Component extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      readyToPlay: false
    }
    this.renderControlsLeft = this.renderControlsLeft.bind(this)
    this.renderControlsRight = this.renderControlsRight.bind(this)
  }

  renderControlsLeft (isFirstElement) {
    return <COMPONENTS.IconButton
      className="flex-1"
      disabled={isFirstElement}
      icon={{name: 'before', className: 'nav-icon'}}
      onPress={this.props.onBackClick}/>
  }

  renderControlsRight (isLastElement) {
    return <COMPONENTS.IconButton
      className="flex-1"
      disabled={isLastElement}
      icon={{name: 'next', className: 'nav-icon'}}
      onPress={this.props.onNextClick}/>
  }

  render () {
    const {current, isFirstElement, isLastElement, ...props} = this.props
    return (
      <COMPONENTS.KeepAwakeView className={this.props.className}>
        {this.renderControlsLeft(isFirstElement)}
        <COMPONENTS.View className={this.props.className}>
          <COMPONENTS.PlayerView current={this.props.current} {...props} />
        </COMPONENTS.View>
        {this.renderControlsRight(isLastElement)}
      </COMPONENTS.KeepAwakeView>
    )
  }
}

Component.propTypes = {
  accountId: PropTypes.string,
  className: PropTypes.string,
  config: PropTypes.object,
  current: PropTypes.string,
  environment: PropTypes.string,
  data: PropTypes.shape({
    getMedia: PropTypes.shape({
      _id: PropTypes.string,
      accessToken: PropTypes.string
    })
  }),
  id: PropTypes.string,
  isFirstElement: PropTypes.bool,
  isLastElement: PropTypes.bool,
  loading: PropTypes.bool,
  onReady: PropTypes.func,
  onBackClick: PropTypes.func,
  onNextClick: PropTypes.func,
  readyToPlay: PropTypes.bool,
  style: PropTypes.object,
  showControls: PropTypes.bool
}

Component.defaultProps = {
  onReady: () => null,
  style: {height: height, width: width},
  policy: 'network-only'
}

export default Component
