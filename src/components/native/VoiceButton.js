// import React from 'react'
// import {Platform} from 'react-native'
// import Voice from 'react-native-voice'
// import PropTypes from 'prop-types'
// import * as COMPONENTS from './../../components'
// import withCustomComponent from '../../core/withCustomComponent'

// class Component extends React.Component {
//   state = {
//     listening: false
//   }

//   resultTimeout = null

//   componentDidMount () {
//     Voice.onSpeechStart = this.handleSpeechStart
//     Voice.onSpeechEnd = this.handleSpeechEnd
//     Voice.onSpeechResults = this.handleSpeechResults
//     Voice.onSpeechPartialResults = this.handleSpeechPartialResults
//   }

//   handleSpeechStart = () => {
//     this.setState({listening: true})
//   }

//   handleSpeechEnd = () => {
//     this.setState({listening: false})
//   }

//   handleSpeechResults = ({value, ...args}) => {
//     const {onResults = () => null, _setContext, setContext = {}} = this.props
//     const match = (value || []).pop()
//     if (typeof _setContext === 'function') {
//       _setContext({query: match, ...setContext})
//     }
//     onResults(match)
//   }

//   handleSpeechPartialResults = () => {
//     if (Platform.OS === 'ios' && !this.resultTimeout) {
//       this.resultTimeout = setTimeout(this.handleResultTimeout, 5 * 1000)
//     }
//   }

//   handlePress = () => {
//     try {
//       const {listening} = this.state
//       const {locale} = this.props
//       if (!listening) {
//         Voice.start(locale)
//       }
//     } catch (error) {
//       //console.log(error)
//     }
//   }

//   handleResultTimeout = () => {
//     Voice.stop()
//     this.resultTimeout = null
//   }

//   componentWillUnmount () {
//     this.handleResultTimeout()
//   }

//   render () {
//     const {VoiceComponent = COMPONENTS.View, style, onResults, ...props} = this.props
//     const {listening} = this.state
//     return <VoiceComponent style={style} listening={listening} loading={listening} onPress={this.handlePress} {...props}/>
//   }
// }

// Component.defaultProps = {
//   locale: 'es-ES'
// }

// Component.propTypes = {
//   locale: PropTypes.string,
//   onResults: PropTypes.func
// }

// export default withCustomComponent(Component, ['VoiceComponent'])

export default () => ({})
