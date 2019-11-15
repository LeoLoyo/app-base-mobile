import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Image } from 'react-native'
import _isUndefined from 'lodash/isUndefined'
import _isFunction from 'lodash/isFunction'

import Fade from './Fade'
import styles from './styles'

class PlayerButton extends React.PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    state: PropTypes.bool,
    style: PropTypes.any,
    buttonStyle: PropTypes.any,
    source: PropTypes.any,
    altSource: PropTypes.any,
    isVisible: PropTypes.bool
  }
  static defaultProps = {
    onPress: () => {}
  }
  state = {imageState: false}
  _onPress = () => {
    const { onPress, state } = this.props
    if (_isUndefined(state)) {
      this.setState((prevState) => ({imageState: !prevState.imageState}))
    }
    _isFunction(onPress) && onPress()
  }

  render () {
    const {imageState} = this.state
    let {style, buttonStyle, state = imageState, source, altSource, isVisible} = this.props
    altSource = altSource || source
    source = state ? altSource : source
    const {playerBaseControl, playerButtonImage} = styles
    return (
      <Fade visible={isVisible} style={style}>
        <TouchableOpacity onPress={this._onPress} style={[playerBaseControl, buttonStyle]}>
          <Image style={playerButtonImage} source={source} />
        </TouchableOpacity>
      </Fade>
    )
  }
}

export default PlayerButton
