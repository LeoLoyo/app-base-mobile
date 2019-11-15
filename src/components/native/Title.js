import React from 'react'
import PropTypes from 'prop-types'
import withStyle from '../../core/withStyle'
import withTranslation from '../../core/withTranslation'
import {extractHighlights} from '../../core/utils/highlight'
import * as COMPONENTS from '../../components'
class Component extends React.Component {
  render () {
    const {
      isActive,
      validateFocus,
      text,
      uppercase,
      containerClassName,
      highlightClassname
    } = this.props
    const content = this.props.children || text
    const className = (isActive && validateFocus)
      ? this.props.activeClassName
      : this.props.className
    return (
      <COMPONENTS.View className={containerClassName}>
        {(extractHighlights(content) || []).map(
          ({text, highlight}, key) =>
            <COMPONENTS.Text
              key={key}
              uppercase={uppercase}
              className={highlight ? `${className} ${highlightClassname}` : className}
              text={text}/>)}
      </COMPONENTS.View>
    )
  }
}

Component.propTypes = {
  activeClassName: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  children: PropTypes.any.isRequired,
  highlightClassname: PropTypes.string,
  isActive: PropTypes.bool,
  text: PropTypes.string,
  uppercase: PropTypes.bool,
  validateFocus: PropTypes.bool
}

Component.defaultProps = {
  className: 'text-color-white'// TODO: color de texto por defecto
  // superClassName: 'font-default'
}

export default withTranslation(withStyle(Component))
