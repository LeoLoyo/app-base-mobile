import React, {Component} from 'react'
import {TouchableWithoutFeedback, Image} from 'react-native'
import PropTypes from 'prop-types'
import {View, Text} from '../../'
import withStyle from '../../../core/withStyle'
import withTranslation from '../../../core/withTranslation'

class CheckBox extends Component {
  static propTypes = {
    value: PropTypes.bool,
    disabled: PropTypes.bool,
    isIndeterminate: PropTypes.bool,
    defaultValue: PropTypes.bool,
    onClick: PropTypes.func,
    indeterminateImage: PropTypes.string,
    checkedImage: PropTypes.string,
    unCheckedImage: PropTypes.string,
    checkBoxColor: PropTypes.string,
    iconOutLine: PropTypes.bool,
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ])
  }

  constructor (props) {
    super(props)
    this.state = {
      value: this.props.value || this.props.defaultValue
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.value === prevState.value) return null
    return {
      value: nextProps.value
    }
  }

  static defaultProps = {
    checkBoxColor: 'gray',
    isIndeterminate: false,
    leftTextStyle: {},
    rightTextStyle: {},
    onClick: () => {}
  }

  onClick = () => {
    this.setState({
      value: !this.state.value
    })
    this.props.onClick(!this.state.value)
  }

  _renderText (side = 'left') {
    if (this.props[`${side}TextView`]) return this.props[`${side}TextView`]
    if (!this.props[`${side}Text`]) return null
    let textStyle = {...styles[`${side}Text`], ...this.props[`${side}TextStyle`]}
    return <Text style={textStyle}>{this.props[`${side}Text`]}</Text>
  }

  _renderImage () {
    if (this.props.isIndeterminate) {
      return this.props.indeterminateImage ? this.props.indeterminateImage : this.genCheckedImage()
    }
    if (this.state.value) {
      return this.props.checkedImage ? this.props.checkedImage : this.genCheckedImage()
    } else {
      return this.props.unCheckedImage ? this.props.unCheckedImage : this.genCheckedImage()
    }
  }

  genCheckedImage () {
    var source
    if (this.props.isIndeterminate) {
      source = require('./img/ic_indeterminate_check_box.png')
    } else if (this.props.iconOutLine) {
      source = this.state.value ? require('./img/check-1.png') : require('./img/check-2.png')
    } else {
      source = this.state.value ? require('./img/ic_check_box.png') : require('./img/ic_check_box_outline_blank.png')
    }

    return (
      <Image source={source} style={{tintColor: this.props.checkBoxColor}} />
    )
  }

  render () {
    const containerStyle = {
      ...styles.container,
      ...this.props.style
    }

    return (
      <TouchableWithoutFeedback
        onPress={this.onClick}
        underlayColor='transparent'
        disabled={this.props.disabled}>
        <View style={containerStyle}>
          {this._renderText('left')}
          {this._renderImage()}
          {this._renderText('right')}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default withStyle(withTranslation(CheckBox, ['rightText', 'leftText']))

const styles = {
  wrapper: {
    marginBottom: '6rem'
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '6rem'
  },
  leftText: {
    flex: 1,
    color: 'gray'
  },
  rightText: {
    flex: 1,
    marginLeft: 10,
    color: 'gray'
  }
}
