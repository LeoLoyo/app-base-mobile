import React from 'react'
import PropTypes from 'prop-types'
import size from 'lodash/size'
import View from '../native/View'
import Link from '../native/Link'
import IconTheme from '../native/IconTheme'
import TextInput from '../native/TextInput'
import VoiceButton from '../native/VoiceButton'
import QuerySlider from './QuerySlider'

class Component extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleVoiceResults = this.handleVoiceResults.bind(this)
    this.query = `query ($q: String!, $limit: Int!) { search(q: $q, limit: $limit) { 
      data {_id title favorite thumbnails { default { url } } } } 
    }`
    this.state = {
      input: ''
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange = (search) => this.setState({input: search})

  handleVoiceResults = (results = []) => this.handleChange(results.pop())

  render () {
    return (
      <View className="absolute-fill bg-dark flex-column">
        <View className="h-viewport-20 bg-dark flex-row align-items-center">
          <Link className="flex-1 align-items-center" isBackButton>
            <View className="border-color-white border-1 w-50 h-50 align-items-center justify-content-center">
              <IconTheme name="arrow-left" className="close-icon"/>
            </View>
          </Link>
          <View className="flex-6" >
            <TextInput
              className={this.props.textInputClassname}
              name='search'
              underlineColorAndroid='transparent'
              value={this.state['input']}
              onChangeText={this.handleChange}
            />
          </View>
          <VoiceButton onResults={this.handleVoiceResults}/>
        </View>
        <View className="h-viewport-10"/>
        <View className="flex-2 flex-column align-items-center">
          {
            size(this.state.input) ? (
              <QuerySlider
                policy='network-only'
                query={this.query}
                variables={{q: this.state.input, limit: 10}}
                {...this.props}
              />
            ) : null
          }
        </View>
      </View>
    )
  }
}

Component.propTypes = {
  children: PropTypes.array,
  client: PropTypes.object,
  navigation: PropTypes.object,
  link: PropTypes.string,
  textInputClassname: PropTypes.string,
  titleProps: PropTypes.object,
  config: PropTypes.object
}

export default Component
