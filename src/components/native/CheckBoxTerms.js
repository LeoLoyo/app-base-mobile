import React, { Component } from 'react'
import { TouchableWithoutFeedback, Image, Linking, Text } from 'react-native'
import PropTypes from 'prop-types'
import View from './View'
import withStyle from '../../core/withStyle'

class CheckBoxTerms extends Component {
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
    urls: PropTypes.object,
    linkTextStyle: PropTypes.object,
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
    onClick: () => { }
  }

  onClick = () => {
    this.setState({
      value: !this.state.value
    })
    this.props.onClick(!this.state.value)
  }

  _linkURL = (url) => url ? Linking.openURL(url) : null

  _renderText (side = 'left') {
    if (!this.props[`${side}Text`]) return null
    const { urls: { terms, policy, system }, linkTextStyle } = this.props
    let textStyle = { ...styles[`${side}Text`], ...this.props[`${side}TextStyle`] }
    let linkStyle = { ...textStyle, ...linkTextStyle }
    return (
      <Text style={textStyle}>Acepto los
        <Text
          style={terms ? linkStyle : textStyle}
          onPress={() => this._linkURL(terms)}> Términos y Condiciones de Uso,
        </Text>
        <Text
          style={policy ? linkStyle : textStyle}
          onPress={() => this._linkURL(policy)} > Políticas de Privacidad
        </Text> y los
        <Text
          style={system ? linkStyle : textStyle}
          onPress={() => this._linkURL(system)} > Requerimientos Mínimos del Sistema
        </Text>
      </Text>
    )
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
      source = require('./CheckBox/img/ic_indeterminate_check_box.png')
    } else if (this.props.iconOutLine) {
      source = this.state.value
        ? require('./CheckBox/img/check-1.png')
        : require('./CheckBox/img/check-2.png')
    } else {
      source = this.state.value
        ? require('./CheckBox/img/ic_check_box.png')
        : require('./CheckBox/img/ic_check_box_outline_blank.png')
    }

    return (
      <Image source={source} style={{ tintColor: this.props.checkBoxColor }} />
    )
  }

  render () {
    const containerStyle = {
      ...styles.container,
      ...this.props.style
    }

    return (
      <View style={containerStyle}>
        {this._renderText('left')}
        <TouchableWithoutFeedback
          onPress={this.onClick}
          underlayColor='transparent'
          disabled={this.props.disabled}>
          {this._renderImage()}
        </TouchableWithoutFeedback>
        {this._renderText('right')}
      </View>
    )
  }
}

export default withStyle(CheckBoxTerms)

const styles = {
  wrapper: {
    marginBottom: 12
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
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
