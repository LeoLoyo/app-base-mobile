import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet} from 'react-native'
import isFunction from 'lodash/isFunction'
import RNSlider from 'react-native-slider'
import withStyle from '../../core/withStyle'

class Slider extends React.Component {
  _onChange = (value) => {
    if (this.props.setContext) {
      this.props._setContext({[this.props.setContext]: value})
    }
    if (isFunction(this.props.onValueChange)) this.props.onValueChange(value)
  }

  render () {
    const {value, onValueChange, ...props} = this.props
    return (
      <RNSlider
        minimumTrackTintColor="#00AEEF"
        trackStyle={styles.track}
        thumbStyle={styles.thumb}
        value={Number(value)}
        onValueChange={this._onChange}
        {...props} />
    )
  }
}

const constraints = {
  $minimumTrackTintColor: '#00AEEF',
  $maximumTrackTintColor: 'red',
  $colorShadow: 'gray',
  $colorForeground: 'white',
  $colorHighlight: '#00AEEF',
  $trackHeight: 10,
  $thumSize: 30
}

const styles = StyleSheet.create({
  track: {
    height: constraints.$trackHeight,
    borderRadius: constraints.$trackHeight / 2
  },
  thumb: {
    width: constraints.$thumSize,
    height: constraints.$thumSize,
    backgroundColor: constraints.$colorHighlight,
    borderColor: constraints.$colorForeground,
    borderWidth: 6,
    borderRadius: constraints.$thumSize / 2
  }
})

Slider.propTypes = {
  setContext: PropTypes.any,
  _setContext: PropTypes.func,
  onValueChange: PropTypes.func,
  value: PropTypes.any
}
export default withStyle(Slider)
