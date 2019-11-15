import React from 'react'
import PropTypes from 'prop-types'
import eq from 'lodash/eq'
import merge from 'lodash/merge'
import size from 'lodash/size'
import _get from 'lodash/get'
import ButtonGroup from './ButtonGroup'
import View from '../native/View'
import withCustomComponent from '../../core/withCustomComponent'

class Select extends React.PureComponent {
  state = { selected: this.props.selected }

  _getPayload = ({ variables = {}, extra = {} }) => ({ ...variables, ...extra })

  _onPressButtonItem = ({ currentTab }) => {
    if (currentTab === this.state.selected) return
    this.setState({ selected: currentTab }, () => this.renderCurrentButton())
  }

  renderCurrentButton = () => {
    try {
      const currentVariables = this._getPayload(_get(this.props, `data.${this.state.selected}`, {}))
      if (typeof this.props._setContext === 'function' && this.props.setContext) {
        this.props._setContext(this.props.setContext)
      }

      if (typeof this.props.refetch === 'function') {
        this.props.refetch(currentVariables)
      }

      if (typeof this.props.onPress === 'function') {
        this.props.onPress()
      }
    } catch (error) {
      console.error(error)
    }
  }

  renderButtons = () => {
    const {
      data,
      styles: {containerStyle, btnStyle, btnStyleActive, textStyle, textStyleActive}
    } = this.props
    const {selected} = this.state
    const options = (data || []).map((item, index) => ({
      name: item || index,
      style: eq(selected, index) ? merge({}, btnStyle, btnStyleActive) : btnStyle,
      textProps: {text: item.text,
        style: eq(selected, index)
          ? merge({}, textStyle, textStyleActive) : textStyle}
    }))

    return (
      <View style={containerStyle}>
        <ButtonGroup
          name='currentTab'
          options={options}
          onChange={this._onPressButtonItem} />
      </View>
    )
  }

  render () {
    const {data} = this.props
    return size(data) ? (
      <View {...this.props}>
        {this.renderButtons()}
      </View>
    ) : null
  }
}

Select.defaultProps = {
  containerStyle: {
    flex: 1
  },
  btnStyle: {
    height: '20rem',
    width: '100rem',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  btnStyleActive: {
    backgroundColor: 'green'
  },
  textStyle: {
    color: 'black'
  },
  textStyleActive: {
    color: 'white'
  }
}

Select.propTypes = {
  button: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.any,
  data: PropTypes.array,
  onChange: PropTypes.func,
  onToggle: PropTypes.func,
  options: PropTypes.array,
  text: PropTypes.string,
  styles: PropTypes.object,
  value: PropTypes.string,
  selected: PropTypes.number,
  _setContext: PropTypes.func,
  setContext: PropTypes.any,
  refetch: PropTypes.func,
  onPress: PropTypes.func
}

export default withCustomComponent(Select, ['SeparatorComponent'])
