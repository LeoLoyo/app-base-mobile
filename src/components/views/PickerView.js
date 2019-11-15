import React from 'react'
import {size} from 'lodash'
import PropTypes from 'prop-types'
import * as COMPONENTS from '../../components'

class Component extends React.Component {
  state = {
    selected: ''
  }
  onSelect = (value, index) => {
    this.setState({selected: value})
  }

  onPress = () => {
    if (typeof this.props.onPress === 'function') {
      this.props.onPress(this.state.selected)
    }
  }
  render () {
    return (
      <COMPONENTS.View className="bg-white flex-3 align-items-center justify-content-space-between">
        <COMPONENTS.View className="flex-3 mb-10 h-viewport-10" >
          <COMPONENTS.Picker seletedOption={this.state.selected}
            onOptionSelected={this.onSelect}
            options={this.props.options} />
        </COMPONENTS.View>
        <COMPONENTS.Button
          {...this.props.button}
          disabled={size(this.props.options) <= 0}
          onPress={() => this.onPress()}/>
      </COMPONENTS.View>
    )
  }
}

/**
   * Props
   */
Component.propTypes = {
  button: PropTypes.object,
  onPress: PropTypes.func,
  options: PropTypes.array
}

export default Component
