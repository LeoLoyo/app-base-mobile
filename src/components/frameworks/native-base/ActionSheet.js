import React, { Component } from 'react'
import { Button, Text, View } from '../../../components'
import { ActionSheet, Root } from 'native-base'
import { CustomComponentProvider } from '../../../core/withCustomComponent'
import PropTypes from 'prop-types'
import { PortalContext } from '../../../core/Portal'

class NativeBaseActionSheet extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: null
    }
  }

  componentDidMount () {
    const {value, useGenderFn} = this.props
    if (value && useGenderFn) this.reverseTransformValue(value)
  }

  renderButtonComponent = () => {
    const {selectedValue} = this.context.portal
    return (
      <CustomComponentProvider { ...this.props } components={ ['ButtonComponent'] }>
        { ({ButtonComponent}) => ButtonComponent
          ? <ButtonComponent
            { ...this.props }
            onPress={ this.onPressAction }
            selected={ selectedValue }/>
          : this._renderDefaultButton()
        }
      </CustomComponentProvider>
    )
  }

  _renderDefaultButton = () => (
    <Button onPress={ this.onPressAction }>
      <Text style={ {
        color: 'black',
        fontSize: 25
      } }>Actionsheet</Text>
    </Button>
  )

  onPressAction = () => {
    const {options, title, onChange, useGenderFn} = this.props
    const {set: setPortal} = this.context.portal
    // leave the cancel option at the bottom of the array of options
    const index = options.length - 1

    ActionSheet.show(
      {
        options: options,
        title,
        cancelButtonIndex: index,
        destructiveButtonIndex: index
      },
      buttonIndex => {
        if (buttonIndex === index) return
        // this.setState({selected: options[buttonIndex]})
        onChange(options[buttonIndex])
        setPortal({selectedValue: options[buttonIndex]})
        useGenderFn && this.transformGenderValue(options[buttonIndex])
      }
    )
  }

  transformGenderValue = value => {
    const {set: setPortal} = this.context.portal
    switch (value.toLowerCase()) {
      case 'masculino':
        return setPortal({rawValue: 'male'})
      case 'femenino':
        return setPortal({rawValue: 'female'})
    }
  }

  reverseTransformValue = value => {
    const {set: setPortal} = this.context.portal
    switch (value.toLowerCase()) {
      case 'male':
        return setPortal({selectedValue: 'Masculino', rawValue: 'male'})
      case 'female':
        return setPortal({selectedValue: 'Femenino', rawValue: 'female'})
    }
  }

  render () {
    return (
      <Root>
        <View>
          { this.renderButtonComponent() }
        </View>
      </Root>
    )
  }
}

NativeBaseActionSheet.contextType = PortalContext

NativeBaseActionSheet.propTypes = {
  value: PropTypes.any,
  options: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  setContext: PropTypes.func,
  portal: PropTypes.any,
  useGenderFn: PropTypes.bool
}

export default NativeBaseActionSheet
