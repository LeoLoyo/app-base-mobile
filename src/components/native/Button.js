import React from 'react'
import PropTypes from 'prop-types'
import isUndefined from 'lodash/isUndefined'
import TouchableOpacity from './TouchableOpacity'
import Text from './Text'
import TouchableHighlight from './TouchableHighlight'
import withCondition from '../../core/withCondition'

class Button extends React.Component {
  _renderText = ({textClassName, text, uppercase, textStyle = {}}) => (
    <Text className={textClassName} text={text} uppercase={uppercase} style={textStyle} />
  )

  _renderOpacityButton = () => {
    const {text, textClassName, uppercase, children, textStyle, ...props} = this.props
    return (
      <TouchableOpacity {...props}>
        { text ? this._renderText({text, textClassName, uppercase, textStyle}) : children }
      </TouchableOpacity>
    )
  }

  _renderHighlightButton = () => {
    const {text, textClassName, uppercase, textStyle, children, ...props} = this.props
    return (
      <TouchableHighlight {...props}>
        { text ? this._renderText({text, textClassName, uppercase, textStyle}) : children }
      </TouchableHighlight>
    )
  }
  render () {
    const {show, hide} = this.props
    let displayInput = true
    if (!isUndefined(hide)) displayInput = !hide
    else if (!isUndefined(show)) displayInput = show
    return displayInput && (this.props.shouldHighlight ? this._renderHighlightButton() : this._renderOpacityButton())
  }
}

Button.propTypes = {
  children: PropTypes.any,
  handlePress: PropTypes.func,
  isBackButton: PropTypes.bool,
  show: PropTypes.bool,
  hide: PropTypes.bool,
  text: PropTypes.any,
  textClassName: PropTypes.string,
  textStyle: PropTypes.object,
  uppercase: PropTypes.bool,
  shouldHighlight: PropTypes.bool
}

Button.defaultProps = {
  isBackButton: false,
  shouldHighlight: false
}

export default withCondition(Button, ['hide', 'show'], [false, false])
