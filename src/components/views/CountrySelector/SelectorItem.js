import React from 'react'
import PropTypes from 'prop-types'
import View from '../../native/View'
import Modal from '../../native/Modal'
import Button from '../../native/Button'
import Text from '../../native/Text'
import IconThemeButton from '../../native/IconThemeButton'
import IconTheme from '../../native/IconTheme'
import { FlatList } from 'react-native'

const SelectorItem = (
  {
    data,
    selectedValue,
    visible,
    keyExtractor,
    renderSeparator,
    renderItem,
    modalKey,
    itemType,
    labelText,
    headerTitle,
    animationType,
    headerContainerStyle,
    headerButtonIconProps,
    headerTitleStyle,
    inputButtonContainer,
    inputContainer,
    inputButtonLabelText,
    inputIconStyle,
    inputPlaceholderStyle,
    modalContainer,
    toggleModal
  }
) => {
  return (
    <View>
      <View {...inputContainer}>
        <Text {...inputButtonLabelText} text={labelText}/>
        <Button
          onPress={() => toggleModal()}
          {...inputButtonContainer}
        >
          <Text {...inputPlaceholderStyle} text={selectedValue ? selectedValue.label : headerTitle}/>
          <IconTheme {...inputIconStyle}/>
        </Button>
      </View>
      <Modal
        transparent
        visible={visible}
        animationType={animationType}
        onRequestClose={() => toggleModal()}
      >
        <View style={modalContainer}>
          <View {...headerContainerStyle}>
            <IconThemeButton {...headerButtonIconProps} onPress={() => toggleModal()}/>
            <Text {...headerTitleStyle} text={headerTitle}/>
            <View style={{ width: 30 }}/>
          </View>
          <FlatList
            data={data}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={renderSeparator}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </View>
  )
}

SelectorItem.propTypes = {
  test: PropTypes.bool,
  states: PropTypes.array,
  municipality: PropTypes.any,
  countries: PropTypes.array,
  animationType: PropTypes.string,
  municipalityKey: PropTypes.string,
  filterStateByCountry: PropTypes.string,
  filterByCountry: PropTypes.bool,
  filterMunicipality: PropTypes.bool,
  filterMunByState: PropTypes.bool,
  filterByState: PropTypes.bool,
  modalContainer: PropTypes.any,
  buttonContainerStyle: PropTypes.any,
  buttonTextStyle: PropTypes.any,
  headerContainerStyle: PropTypes.any,
  headerButtonIconProps: PropTypes.any,
  headerTitleStyle: PropTypes.any,
  inputButtonContainer: PropTypes.any,
  inputContainer: PropTypes.any,
  inputButtonLabelText: PropTypes.any,
  inputIconStyle: PropTypes.any,
  inputPlaceholderStyle: PropTypes.any,
  data: PropTypes.array,
  selectedValue: PropTypes.object,
  itemType: PropTypes.string,
  labelText: PropTypes.string,
  headerTitle: PropTypes.string,
  modalKey: PropTypes.string,
  visible: PropTypes.bool,
  keyExtractor: PropTypes.func,
  renderSeparator: PropTypes.func,
  renderItem: PropTypes.func,
  toggleModal: PropTypes.func
}

export default SelectorItem
