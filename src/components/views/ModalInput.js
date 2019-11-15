import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import isNull from 'lodash/isNull'
import eq from 'lodash/eq'
import memoize from 'memoize-one'
import {CustomComponentProvider} from '../../core/withCustomComponent'
import withStyle from '../../core/withStyle'
import withCondition from '../../core/withCondition'
import Modal from '../native/Modal'
import View from '../native/View'

const shouldResetInput = memoize(({hastle, needle}) => {
  return !(hastle || []).find(item => eq(get(item, 'label'), get(needle, 'label')))
}, (newArg, lastArg) => get(newArg, 'needle.label') === get(lastArg, 'needle.label'))

class ModalInput extends React.Component {
  state = {
    modalVisible: false,
    item: null
  };

  shouldComponentUpdate (newProps, prevState) {
    const itemSelected = this.state.item
    const options = newProps.options
    return newProps.value !== this.props.value ||
      prevState.modalVisible !== this.state.modalVisible ||
      newProps.errors.length !== this.props.errors.length ||
      newProps.show !== this.props.show ||
      shouldResetInput({hastle: options, needle: itemSelected})
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const itemSelected = prevState.item
    const options = nextProps.options
    const shouldResetOnHide = nextProps.show !== undefined && !nextProps.show
    return itemSelected && (shouldResetInput({hastle: options, needle: itemSelected}) || shouldResetOnHide) ? {
      item: null,
      ...prevState
    } : {
      ...prevState,
      item: nextProps.value && isNull(prevState.item) ? {
        label: nextProps.defaultValue,
        value: nextProps.defaultValue
      } : prevState.item
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.item && !this.state.item) {
      this.props.onOptionSelected(get(this.props.item, this.props.valuePath || 'value', ''))
    }
  }

  showModal = () => {
    this.setState({modalVisible: !this.state.modalVisible})
  }

  dissmissModal = (itemSelected) => {
    this.setState({
      modalVisible: !this.state.modalVisible,
      item: itemSelected
    }, () => {
      this.props.onOptionSelected(get(itemSelected, this.props.valuePath || 'value', ''))
    })
  }

  toggleModal = () => this.setState({modalVisible: !this.state.modalVisible})

  onRequestClose = () => {
    this.toggleModal()
    return true
  }

  render () {
    const {
      animationType,
      errorStyle,
      styles,
      errors,
      errorClassName,
      className,
      textClassName,
      placeholderClassName,
      value,
      ...props
    } = this.props
    const {item, modalVisible} = this.state
    // TODO: the item should be a button, by convention
    const inputStyles = errors.length > 0 ? errorStyle : null
    return (
      <CustomComponentProvider {...props} components={['ContentComponent', 'ItemComponent']}>
        {({ItemComponent, ContentComponent}) => (
          <View>
            <ItemComponent
              {...props}
              value={value}
              className={errors.length > 0 ? errorClassName : className}
              errors={errors}
              showModal={this.showModal}
              selected={item}
              toggleModal={this.toggleModal}
              inputStyles={inputStyles}
              textClassName={value ? textClassName : placeholderClassName}
            />
            <Modal
              transparent
              visible={modalVisible}
              animationType={animationType}
              onRequestClose={this.onRequestClose}>
              <ContentComponent {...props}
                dissmissModal={this.dissmissModal}
                selected={item}
                toggleModal={this.toggleModal} />
            </Modal>
          </View>
        )}
      </CustomComponentProvider>
    )
  }
}

ModalInput.propTypes = {
  animationType: PropTypes.string,
  ContentComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  inputStyle: PropTypes.object,
  ItemComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  onOptionSelected: PropTypes.func,
  valuePath: PropTypes.string,
  errorStyle: PropTypes.object,
  styles: PropTypes.object,
  errors: PropTypes.array,
  errorClassName: PropTypes.string,
  className: PropTypes.string,
  textClassName: PropTypes.string,
  placeholderClassName: PropTypes.string,
  value: PropTypes.any,
  show: PropTypes.any,
  options: PropTypes.any,
  defaultValue: PropTypes.any,
  item: PropTypes.any
}

ModalInput.defaultProps = {
  errors: [],
  onOptionSelected: () => {}
}

export default withCondition(withStyle(ModalInput, ['errorStyle']), ['hide', 'show'],
  [false, false])
