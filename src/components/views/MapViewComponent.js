import React from 'react'
import {View, Platform} from 'react-native'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import filter from 'lodash/filter'
import xor from 'lodash/xor'
import includes from 'lodash/includes'
import size from 'lodash/size'
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'
import withCustomComponent from '../../core/withCustomComponent'
import {isRemoteUrl} from '../../core/utils/regex'

class MapViewComponent extends React.Component {
  markersGroups = []
  state = {
    currentSelected: null,
    modalVisible: false,
    mapReady: false,
    filter: []
  }

  static defaultProps = {
    navigationEnabled: false
  }

  _map = null

  _header = null

  componentDidUpdate (prevProps, prevState) {
    const {animateToRegion} = this.props
    if (this._map && (!prevState.mapReady && this.state.mapReady) && animateToRegion) {
      const latlng = {
        latitude: Number(get(animateToRegion, 'latitude', 0)),
        longitude: Number(get(animateToRegion, 'longitude', 0))
      }
      this._map.animateToCoordinate(latlng, get(animateToRegion, 'duration', 1000))
    }
  }

  showModal = () => {
    this.setState({modalVisible: !this.state.modalVisible})
  }

  _onMapReady = () => {
    this.setState({mapReady: true})
  }

  dissmissModal = (itemSelected) => {
    this.setState({
      modalVisible: !this.state.modalVisible,
      item: itemSelected
    }, () => {
      this.props.onOptionSelected(get(itemSelected, this.props.valuePath || 'value', ''))
    })
  }

  computeMarkersData = (markerGroup = []) => {
    try {
      return map(markerGroup, ({_id, custom, description, name, medias}) => {
        let categoryMetadata = JSON.parse(custom)
        return ({
          _id,
          custom: JSON.parse(custom),
          description,
          pinColor: get(categoryMetadata, 'color-map', 'red'),
          medias: map(medias, ({custom, ...rest}, index) => {
            const metadata = JSON.parse(custom)
            const latlng = {
              latitude: Number(get(metadata, 'latitud', 0)),
              longitude: Number(get(metadata, 'longitud', 0)) }
            return {
              _id: get(rest, '_id', index),
              latlng,
              pinColor: get(categoryMetadata, 'color-map', 'red'),
              data: {...rest, extra: metadata, latlng},
              parent: _id
            }
          })
        })
      })
    } catch (error) {
      // console.log(error)
    }
  }

  _actionMarker = (e, currentSelected) => {
    const {modalVisible} = this.state
    let payload = {
      currentSelected
    }

    if (!modalVisible) { payload = Object.assign({}, payload, {modalVisible: !modalVisible}) }
    modalVisible && (this._header) && this._header._toggleState()
    this.setState(payload)
  }

  _addMarkers = (markers, action, filterValue) => {
    const set = size(filterValue) ? filter(markers, ({parent}) => {
      return !includes(filterValue, parent)
    }) : markers
    return map(set, (marker, key) => {
      const {latlng, _id = key, ...props} = marker
      return (
        <Marker
          key={`${_id}-${latlng}`}
          {...props}
          _id={_id}
          coordinate={latlng}
          onPress={e => action(e, marker)}
        />
      )
    })
  }

  _onHeaderItemPress = ({...params}) => {
    const _id = get(params, 'id', get(params, 'id'))
    const {filter} = this.state
    this.setState({filter: xor(filter, [_id])})
  }

  _renderMarkerModal = () => {
    const {MarkerComponent = View} = this.props
    const {currentSelected} = this.state
    return currentSelected
      ? (
        <MarkerComponent
          {...currentSelected}
          onCloseButtonPress={this._hideModal}
          onNavigationStateChange={this._onNavigationStateChange}
        />
      ) : null
  }

  _hideModal = () => this.state.modalVisible && this.setState({modalVisible: !this.state.modalVisible})

  _onNavigationStateChange = ({url, ...args}, viewInstance) => {
    if (isRemoteUrl(url) && Platform.OS === 'android') { // we only want this behaviour in android
      viewInstance.goBack()
    }
  }

  render () {
    const {data, style, HeaderComponent = View, headerProps = {}, isFocused = true, ...props} = this.props
    const markers = flatten(map(this.computeMarkersData(data), ({medias}) => (medias)))
    const {modalVisible, filter} = this.state
    const preparedData = map(data, ({_id, ...item}) => {
      return {
        isSelected: !((filter || []).find((i) => i === _id)),
        _id,
        ...item
      }
    })
    const computedHeaderProps = modalVisible ? {...headerProps, isOpened: false} : headerProps
    return (
      <View style={style}>
        <MapView
          ref={(ref) => (this._map = ref)}
          style={style}
          provider={PROVIDER_GOOGLE}
          zoomEnabled={true}
          zoomControlEnabled={true}
          onPanDrag={this._hideModal}
          onMapReady={this._onMapReady}
          {...props}
        >
          {this._addMarkers(markers, this._actionMarker, filter)}
        </MapView>
        {isFocused && modalVisible ? this._renderMarkerModal() : null}
        <HeaderComponent
          {...computedHeaderProps}
          togglable
          data={preparedData}
          onPress={this._onHeaderItemPress}
        />
      </View>
    )
  }
}

MapViewComponent.propTypes = {
  animateToRegion: PropTypes.object,
  headerProps: PropTypes.object,
  MarkerComponent: PropTypes.func,
  HeaderComponent: PropTypes.func,
  data: PropTypes.any,
  style: PropTypes.any,
  isFocused: PropTypes.bool,
  onOptionSelected: PropTypes.func,
  valuePath: PropTypes.string
}

export default withCustomComponent(MapViewComponent, ['MarkerComponent', 'HeaderComponent'])
