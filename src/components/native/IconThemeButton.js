import React from 'react'
import PropTypes from 'prop-types'
import Button from '../native/Button'
import IconTheme from '../native/IconTheme'
import Text from '../native/Text'

export default class IconThemeButton extends React.Component {
  static propTypes = {
    icon: PropTypes.string,
    iconStyle: PropTypes.any,
    iconClassName: PropTypes.string,
    textProps: PropTypes.object,
    iconProps: PropTypes.object
  }

  render () {
    const {icon, iconStyle, iconProps, iconClassName, textProps, ...props} = this.props
    return icon ? (
      <Button {...props}>
        <IconTheme icon={icon} style={iconStyle} className={iconClassName} {...iconProps} />
        { textProps && <Text {...textProps}/>}
      </Button>
    ) : null
  }
}
