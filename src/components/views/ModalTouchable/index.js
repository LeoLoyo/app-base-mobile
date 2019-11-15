import React from 'react'
import PropTypes from 'prop-types'
import { Dimensions, StyleSheet } from 'react-native'
import withCustomComponent from '../../../core/withCustomComponent'
import _merge from 'lodash/merge'
import _get from 'lodash/get'

import { Modal, View, Button } from '../..'

const { height } = Dimensions.get('window')

class ModalTouchable extends React.Component {
  state = {
    loading: false,
    modalVisible: false
  }

  static propTypes = {
    Component: PropTypes.func,
    children: PropTypes.any,
    styleModal: PropTypes.object
  }

  _showModal = () => this.setState({ modalVisible: true })

  _renderModal = () => {
    const { children, styleModal } = this.props
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}>
        <Button
          activeOpacity={1}
          onPress={() => this.setState({ modalVisible: false })}
          style={stylesDefault.containerModal}>
          <View style={_merge({}, stylesDefault.container, _get(styleModal, 'container', {}))}>
            {children}
          </View>
        </Button>
      </Modal>
    )
  }

  render () {
    const { Component, ...props } = this.props
    return (
      <View>
        {this._renderModal()}
        <Component {...props} onPress={this._showModal} />
      </View>
    )
  }
}

const stylesDefault = StyleSheet.create({
  containerModal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingBottom: height * 0.15,
    justifyContent: 'center'
  },
  container: {
    borderRadius: 10,
    width: '80%',
    height: '50%',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
export default withCustomComponent(ModalTouchable, ['Component'])
