import React from 'react'
import {Modal as NativeModal, Platform} from 'react-native'
import _get from 'lodash/get'
import PropTypes from 'prop-types'
import withStyle from '../../core/withStyle'

class Modal extends React.PureComponent {
  render () {
    const osProps = _get(this.props, Platform.OS, {})
    return (
      <NativeModal {...this.props} {...osProps}>
        {this.props.children}
      </NativeModal>
    )
  }
}

Modal.propTypes = {
  children: PropTypes.any
}
Modal.defaultProps = {
  onRequestClose: () => null
}

export default withStyle(Modal)
