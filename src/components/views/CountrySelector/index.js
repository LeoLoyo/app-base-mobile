import React from 'react'
import PropTypes from 'prop-types'
import { find, get, isEmpty } from 'lodash'
import View from '../../native/View'
import Button from '../../native/Button'
import Text from '../../native/Text'
import SelectorItem from './SelectorItem'

class CountrySelector extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      stateList: props.states || [],
      municipalityList: props.municipality || [],
      showCountryModal: false,
      showStateModal: false,
      showMunicipalityModal: false,
      country: null,
      state: null,
      municipality: null
    }
  }

  componentDidMount () {
    this._buildInitialValuesObjects()
  }

  _buildInitialValuesObjects = () => {
    const { initialValues, municipality } = this.props
    const hasCountry = get(initialValues, 'country', null)
    const hasState = get(initialValues, 'state', null)
    const hasMunicipality = get(initialValues, 'municipality', null)
    const filteredM = (!isEmpty(hasState) && hasState !== ' ')
      ? find(municipality, { departamento: hasState }).municipios
      : []
    this.setState({
      country: !isEmpty(hasCountry) ? {
        label: hasCountry,
        value: hasCountry
      } : null,
      state: (!isEmpty(hasState) && hasState !== ' ') ? {
        label: hasState,
        value: hasState
      } : null,
      municipality: (!isEmpty(hasMunicipality) && hasMunicipality !== ' ') ? {
        label: hasMunicipality,
        value: hasMunicipality
      } : null,
      municipalityList: filteredM
    })
  }

  toggleModal = key => this.setState({ [key]: !this.state[key] })

  _renderSeparator = () => (<View style={{ borderBottomWidth: 1, borderBottomColor: 'black' }}/>)

  _keyExtractor = (item, CountrySelector) => `${item}${CountrySelector}`

  selectCountry = item => {
    const { onOptionSelected } = this.props
    this.setState({ country: item, state: null, municipality: null }, () => {
      onOptionSelected({ address_country: item.value, address_state: ' ', address_city: ' ' })
    })
  }

  selectState = item => {
    const { onOptionSelected, municipality } = this.props
    const { country } = this.state
    const filteredArray = find(municipality, { 'departamento': item.value })
    this.setState({ state: item, municipalityList: filteredArray.municipios, municipality: null }, () => {
      onOptionSelected({ address_country: country.value, address_state: item.value, address_city: ' ' })
    })
  }

  selectMunicipality = item => {
    const { onOptionSelected } = this.props
    const { country, state } = this.state
    this.setState({ municipality: item }, () => {
      onOptionSelected({ address_country: country.value, address_state: state.value, address_city: item.value })
    })
  }

  _renderItem = (item, index, type) => {
    const { buttonContainerStyle, buttonTextStyle } = this.props
    return (
      <Button
        onPress={() => {
          // this.selectItem(item, )
          if (type === 'country') this.selectCountry(item)
          if (type === 'state') this.selectState(item)
          if (type === 'municipality') this.selectMunicipality(item)

          this.setState({ showCountryModal: false, showStateModal: false, showMunicipalityModal: false })
        }}>
        <View {...buttonContainerStyle}>
          <Text {...buttonTextStyle}>{item.label}</Text>
        </View>
      </Button>
    )
  }

  renderCountry = () => {
    const { showCountryModal, country } = this.state
    const { countries } = this.props

    return (
      <SelectorItem
        {...this.props}
        data={countries}
        visible={showCountryModal}
        selectedValue={country}
        modalKey={'showCountryModal'}
        itemType={'country'}
        labelText={'%form_account_address_country%'}
        headerTitle={'%form_account_address_placeholder%'}
        keyExtractor={this._keyExtractor}
        renderSeparator={this._renderSeparator}
        renderItem={({ item, index }) => this._renderItem(item, index, 'country')}
        toggleModal={() => this.toggleModal('showCountryModal')}
      />
    )
  }

  renderState = () => {
    const { showStateModal, state, country, stateList } = this.state

    const { filterStateByCountry } = this.props
    if (country && country.value.toLowerCase() === filterStateByCountry.toLowerCase()) {
      return (
        <SelectorItem
          {...this.props}
          data={stateList}
          visible={showStateModal}
          selectedValue={state}
          modalKey={'showStateModal'}
          itemType={'state'}
          labelText={'%form_account_address_state%'}
          headerTitle={'%form_account_address_state_placeholder%'}
          keyExtractor={this._keyExtractor}
          renderSeparator={this._renderSeparator}
          renderItem={({ item, index }) => this._renderItem(item, index, 'state')}
          toggleModal={() => this.toggleModal('showStateModal')}
        />
      )
    }
  }

  renderMunicipality = () => {
    const { showMunicipalityModal, municipalityList, country, state, municipality } = this.state
    const { filterMunicipality, filterStateByCountry } = this.props
    // eslint-disable-next-line max-len
    if (country && country.value.toLowerCase() === filterStateByCountry.toLowerCase() && filterMunicipality && !isEmpty(state)) {
      return (
        <SelectorItem
          {...this.props}
          data={municipalityList}
          visible={showMunicipalityModal}
          selectedValue={municipality}
          modalKey={'showMunicipalityModal'}
          itemType={'municipality'}
          labelText={'%form_account_address_city%'}
          headerTitle={'%form_account_address_city_placeholder%'}
          keyExtractor={this._keyExtractor}
          renderSeparator={this._renderSeparator}
          renderItem={({ item, index }) => this._renderItem(item, index, 'municipality')}
          toggleModal={() => this.toggleModal('showMunicipalityModal')}
        />
      )
    }
  }

  render () {
    return (
      <View>
        {this.renderCountry()}
        {this.renderState()}
        {this.renderMunicipality()}
      </View>
    )
  }
}

CountrySelector.propTypes = {
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
  onOptionSelected: PropTypes.any,
  initialValues: PropTypes.any
}

CountrySelector.defaultProps = {
  animationType: 'slide',
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF'
  }
}

export default CountrySelector
