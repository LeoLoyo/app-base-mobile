/**
 * Libraries
 */
import React from 'react'
import PropTypes from 'prop-types'
import reduce from 'lodash/reduce'
import isString from 'lodash/isString'
import get from 'lodash/get'
import set from 'lodash/set'

/**
 * Components
 */
import { TranslationContext } from './Translation'

/**
 * Main component
 *
 */
export default function (WrappedComponent, textProps = ['text']) {
  /**
   * Main component
   */

  class Component extends React.Component {
    static displayName = 'withTranslation'
    render () {
      return (
        <TranslationContext.Consumer>
          {
            ({translate}) => {
              const translatedProps = reduce(textProps, (result, key) => {
                if (!isString(get(this.props, key))) return result
                return set(Object.assign({}, result), key, translate(get(this.props, key),
                  get(this.props, `${key}Params`),
                  get(this.props, `${key}ParamsTransform`)))
              }, {})
              return <WrappedComponent {...this.props} {...translatedProps} />
            }
          }
        </TranslationContext.Consumer>
      )
    }
  }

  /**
   * Props
   */
  Component.propTypes = {
    text: PropTypes.any
  }

  return Component
}
