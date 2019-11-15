import React from 'react'
import {omit, get, isString, has, isObject, merge, each, includes} from 'lodash'
import classNamesHelper from 'classnames'
import PropTypes from 'prop-types'
import {ThemeContext} from './Theme'
import {isRem, calcRem} from './../core/utils/rem'
import {isVh, calcVh} from './../core/utils/vh'
import {isVw, calcVw} from './../core/utils/vw'

const overrideStyles = {
  borderWidth: 1,
  borderColor: 'red'
}

const sizeProperties = [
  'fontSize',
  'width',
  'height',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'paddingVertical',
  'paddingHorizontal',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginVertical',
  'marginHorizontal',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderWidth',
  'borderRadius',
  'top',
  'right',
  'bottom',
  'left'
]

export const calculateRemUnits = (styles, base) => {
  let style = {}
  each(styles, (item, key) => {
    if (item && includes(sizeProperties, key) && isRem(item)) {
      style[key] = calcRem(item, base)
    } else if (item && includes(sizeProperties, key) && isVh(item)) {
      style[key] = calcVh(item, base)
    } else if (item && includes(sizeProperties, key) && isVw(item)) {
      style[key] = calcVw(item, base)
    } else {
      style[key] = item
    }
  })
  return style
}

export const parseStyles = (options, cssHelpers, classNames = '', styles, component) => {
  const {outline = false} = options
  const classes = isString(classNames) ? classNames.trim().split(' ') : []
  const inlineStyles = isObject(styles) ? styles : {}
  const stylesFromClasses = classes.reduce((acc, item) => {
    if (item === '') return acc
    if (cssHelpers[item]) {
      acc = Object.assign({}, acc, cssHelpers[item])
    } else {

    }
    return acc
  }, {})
  if (outline) {
    return merge({}, stylesFromClasses, inlineStyles, overrideStyles)
  }
  return merge({}, stylesFromClasses, inlineStyles)
}

const getClassNamePropKey = (styleKey) => {
  return styleKey === 'style' ? 'className' : styleKey.replace('Style', 'ClassName')
}

const StyledWrapper = (WrappedComponent, styles = ['style', 'contentContainerStyle']) => {
  const defaults = styles.reduce((acc, styleKey) => {
    const key = styleKey.toLowerCase()
    if (key.endsWith('style')) {
      acc[styleKey] = {}
      const classNameKey = getClassNamePropKey(styleKey)
      acc[classNameKey] = ''
    }
    return acc
  }, {})

  class StyledComponent extends React.PureComponent {
    static defaultProps = {...defaults}
    constructor (props) {
      super(props)
      this.defaultClassNames = get(WrappedComponent, 'defaultProps.className', '').split(' ')
      this.superClassNames = get(WrappedComponent, 'defaultProps.superClassName', '').split(' ')
    }

    resolveProps (images) {
      const source = get(this.props, 'source')
      const props = omit(this.props, ['style', 'source'])
      if (has(source, 'uri')) {
        return {
          ...props,
          source: get(images, source.uri, this.props.source)
        }
      }
      return props
    }

    renderComponent ({classes, styles: customStyles, options, images, variables}) {
      const props = this.resolveProps(images)

      const styleProps = styles.reduce((acc, styleKey) => {
        const classNamePropKey = getClassNamePropKey(styleKey)
        const cn = styleKey === 'style'
          ? classNamesHelper(this.superClassNames,
            this.defaultClassNames,
            this.props[classNamePropKey])
          : classNamesHelper(this.props[classNamePropKey])
        const _parserStyles = parseStyles(options, classes, cn, this.props[styleKey], this)
        acc[styleKey] = calculateRemUnits(_parserStyles, variables.$rem)
        return acc
      }, {})

      return (
        <WrappedComponent
          {...props}
          {...styleProps}
        />
      )
    }

    render () {
      return (
        <ThemeContext.Consumer>
          { (ctx) => this.renderComponent(ctx)}
        </ThemeContext.Consumer>
      )
    }
  }

  /**
   * Props
   */
  StyledComponent.propTypes = {
    className: PropTypes.string,
    style: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    source: PropTypes.shape({
      uri: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
      ]),
      parse: PropTypes.bool
    })
  }

  return StyledComponent
}

export default StyledWrapper
