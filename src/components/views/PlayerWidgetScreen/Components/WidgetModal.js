import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-native-modalbox'
import {Text} from 'react-native'
import withConfig from '../../../../core/withConfig'
import WebView from '../../../native/WebView'
import View from '../../../native/View'
import IconThemeButton from '../../../native/IconThemeButton'
import TouchableOpacity from '../../../native/TouchableOpacity'

const OPTIONS = [
  { id: 1, title: 'Estadisticas', widget: 'matchstats' },
  { id: 2, title: 'Tabla de  Posiciones', widget: 'standings' },
  { id: 3, title: 'Resultados', widget: 'fixtures' }
]

function TabModal ({ widgetModalRef, uri, wrapperProps, webViewProps }) {
  const [tabActive, setTabActive] = useState(OPTIONS[0])
  return (
    [<View
      key="container-tab-modal"
      className="w-100 bg-transparent flex-row justify-content-space-between align-items-center"
      style={{ paddingVertical: 20, paddingHorizontal: '10%' }}>
      {OPTIONS.map((option, key) => <TabItemModal
        key={key}
        {...option}
        onPress={() => setTabActive(option)}
        isActive={tabActive.id === option.id} />)}
      <IconThemeButton onPress={() => widgetModalRef.current.close()}
        icon="close"
        iconStyle={{ fontSize: 35, color: 'white' }}
        iconProps={{config: { useIconSet: 'materialIcons' }}}
      />
    </View>,
    <View {...wrapperProps} key="content-tab-modal" >
      <WebView {...webViewProps} uri={`${uri}&widget=%22${tabActive.widget}%22`}/>
    </View>
    ]
  )
}

TabModal.propTypes = {
  widgetModalRef: PropTypes.object,
  wrapperProps: PropTypes.object,
  webViewProps: PropTypes.object
}
TabModal.defaultProps = {
  wrapperProps: {},
  webViewProps: {},
  widgetModalRef: {
    current: {
      close: () => null
    }
  }
}

function TabItemModal ({ title, isActive, onPress }) {
  return (
    <TouchableOpacity
      className="border-color-bottom-primary"
      onPress={onPress}
      style={{
        borderBottomWidth: 5,
        paddingBottom: 5,
        ...Object.assign({}, !isActive && { borderBottomColor: 'transparent' })
      }}>
      <Text style={[{ fontSize: 18, fontFamily: 'PassionOne-Bold' },
        isActive ? ({ color: 'white' }) : ({ color: 'gray' })]}>{title}</Text>
    </TouchableOpacity>
  )
}

TabItemModal.propTypes = {
  title: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onPress: PropTypes.func
}
TabItemModal.defaultProps = {
  isActive: false,
  onPress: () => null
}

function Widget (props) {
  const { wrapperProps, webViewProps, opta = {}, live = false, widgetModalRef, modalStyle } = props
  const { general: { web, prefixWidget = '' } } = props.config
  const competition = `competition=${opta.competition}`
  const season = `season=${opta.season}`
  const match = `match=${opta.match_id}`
  const base = `${web}${prefixWidget}`
  const uri = encodeURI(`${base}?${competition}&${season}&${match}&team=${opta.team || []}&live="${live}"`)

  return (
    <Modal ref={widgetModalRef} swipeToClose={false} style={modalStyle}>
      <TabModal widgetModalRef={widgetModalRef} uri={uri} wrapperProps={wrapperProps} webViewProps={webViewProps} />
    </Modal>
  )
}

Widget.propTypes = {
  config: PropTypes.object,
  wrapperProps: PropTypes.object,
  WidgetFailComponent: PropTypes.string,
  webViewProps: PropTypes.object,
  widgetModalRef: PropTypes.object,
  modalStyle: PropTypes.object,
  opta: PropTypes.object,
  live: PropTypes.bool
}

Widget.defaultProps = {
  modalStyle: {
    backgroundColor: 'transparent'
  },
  wrapperProps: {
    className: 'bg-transparent w-100 h-100',
    style: {
      paddingHorizontal: '10%'
    }
  },
  webViewProps: {
    className: 'flex-1'
  },
  widgetModalRef: {
    current: {
      close: () => null
    }
  }
}
export default withConfig(Widget)
