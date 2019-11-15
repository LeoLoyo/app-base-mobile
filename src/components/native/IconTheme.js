import React from 'react'
import PropTypes from 'prop-types'
import { createIconSetFromIcoMoon, createIconSetFromFontello } from 'react-native-vector-icons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome'
import FeatherIcons from 'react-native-vector-icons/Feather'
import {ThemeContext} from '../../core/Theme'
import withStyle from '../../core/withStyle'
import withConfig from '../../core/withConfig'

class IconTheme extends React.PureComponent {
  static displayName = 'IconTheme'
  renderIcon = (icons) => {
    let Icon = null
    let {icon, className, disabled, style, config} = this.props
    const {fontGenerator = 'fontEllo', useIconSet} = config

    if (Icon === null && useIconSet === 'materialIcons') {
      Icon = withStyle(MaterialIcons)
    }
    if (Icon === null && useIconSet === 'featherIcons') {
      Icon = withStyle(FeatherIcons)
    }

    if (Icon === null && useIconSet === 'fontAwesomeIcons') {
      Icon = withStyle(FontAwesomeIcons)
    }

    if (Icon === null && icons) {
      Icon = withStyle(fontGenerator === 'fontEllo'
        ? createIconSetFromFontello(icons)
        : createIconSetFromIcoMoon(icons))
    }

    if (disabled) {
      style = {...style, opacity: 0.5}
    }
    return <Icon name={icon} style={style} className={className} />
  }

  render () {
    return (
      <ThemeContext.Consumer>
        {({icons}) => this.renderIcon(icons.ref)}
      </ThemeContext.Consumer>
    )
  }
}

/**
   * Props
   */
IconTheme.propTypes = {
  icon: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  config: PropTypes.object
}
export default withConfig(IconTheme)
