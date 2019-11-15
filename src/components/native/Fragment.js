import React, { Fragment as NativeFragment } from 'react'
import PropTypes from 'prop-types'
import withCustomComponent from '../../core/withCustomComponent'

function Fragment ({ Component = NativeFragment, ...props }) {
  if (!Component) return null
  return <Component {...props}/>
}

Fragment.displayName = 'Fragment'
Fragment.propTypes = {
  Component: PropTypes.func
}
export default withCustomComponent(Fragment, ['Component'])
