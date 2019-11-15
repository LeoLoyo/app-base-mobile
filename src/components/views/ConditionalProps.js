import React from 'react'
import PropTypes from 'prop-types'
import {decider} from '../../core/withCondition'
import PropsManager from '../native/PropsManager'

function ConditionalProps (props) {
  const {defaultValues, ...otherProps} = props
  const newProps = decider(props, Object.keys(props), defaultValues)
  return (
    <PropsManager {...otherProps} {...newProps}>
      {props.children}
    </PropsManager>
  )
}

ConditionalProps.propTypes = {
  children: PropTypes.node,
  defaultValues: PropTypes.array,
  shouldRender: PropTypes.bool
}

ConditionalProps.defaultProps = {
  shouldRender: false,
  defaultValues: [],
  debug: false
}

export default ConditionalProps
