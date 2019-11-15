import React from 'react'
import {has} from 'lodash'
import PropTypes from 'prop-types'
import * as COMPONENTS from '../../components'
import withStyle from '../../core/withStyle'

class Component extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      value: 0
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (value) {
    const {name, options} = this.props
    if (typeof this.props.onChange === 'function') {
      this.props.onChange({[name]: value}, options)
    }
    this.setState({value})
  }

  renderInfoLabel () {
    return has(this.props, 'info') && (
      <COMPONENTS.Text className={this.props.info.className}>
        {!this.props.value ? this.props.info.minimumValueLabel : `${this.props.value} ${this.props.info.valueSuffix}`}
      </COMPONENTS.Text>
    )
  }

  renderTitle () {
    return has(this.props, 'title') &&
      <COMPONENTS.Text className={this.props.title.className} >
        {this.props.title.text}
      </COMPONENTS.Text>
  }

  render () {
    const {title, value, className, step, minimumValue, maximumValue, ...props} = this.props
    return (
      <COMPONENTS.View className={className} {...props}>
        {this.renderTitle()}
        <COMPONENTS.Slider
          step={step}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          value={value}
          onValueChange={this.handleChange}
        />
        {this.renderInfoLabel()}
      </COMPONENTS.View>
    )
  }
}

Component.propTypes = {
  className: PropTypes.string,
  info: PropTypes.shape({
    className: PropTypes.string,
    minimumValueLabel: PropTypes.string,
    text: PropTypes.string,
    valueSuffix: PropTypes.string
  }),
  maximumValue: PropTypes.number,
  minimumValue: PropTypes.number,
  name: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.object,
  step: PropTypes.number,
  title: PropTypes.shape({
    className: PropTypes.string,
    text: PropTypes.string
  }),
  value: PropTypes.number
}

export default withStyle(Component)
