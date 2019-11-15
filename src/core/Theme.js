import React from 'react'
import PropTypes from 'prop-types'
import {builder as styleBuilder} from './utils/styles'
const ThemeContext = React.createContext()

class ThemeProvider extends React.PureComponent {
  render () {
    const {theme = {}, styles, images, icons, variables} = this.props
    const {options = {}} = theme
    return (
      <ThemeContext.Provider value={{theme,
        options,
        classes: styleBuilder(theme, styles, variables),
        images,
        icons,
        variables}}>
        {this.props.children}
      </ThemeContext.Provider>
    )
  }
}

/**
   * Props
   */
ThemeProvider.propTypes = {
  theme: PropTypes.object,
  styles: PropTypes.object,
  children: PropTypes.object,
  icons: PropTypes.object,
  images: PropTypes.object,
  variables: PropTypes.object
}

export { ThemeProvider, ThemeContext }
