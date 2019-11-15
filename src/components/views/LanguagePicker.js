import React from 'react'
import PropTypes from 'prop-types'
import has from 'lodash/has'
import isArray from 'lodash/isArray'
import size from 'lodash/size'
import {TranslationContext} from '../../core/Translation'
import withConfig from '../../core/withConfig'
import {withNavigation} from 'react-navigation'
import View from '../native/View'
import Picker from '../native/Picker'
import Button from '../native/Button'

class Component extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedLanguage: null
    }
    this.seletedOption = this.seletedOption.bind(this)
    this.resetNavigation = this.resetNavigation.bind(this)
  }

  seletedOption (value, index) {
    this.setState({selectedLanguage: value})
  }

  resetNavigation () {
    this.props.navigation.navigate('AuthLoading')
  }

  render () {
    const config = this.props.config
    const options = has(config, 'language.options') && isArray(config.language.options) ? config.language.options : []
    return size(options) && (
      <TranslationContext.Consumer >
        {
          ({setUserLanguage, selectedLanguage}) => {
            const currentLanguage = this.state.selectedLanguage || selectedLanguage
            return (
              <View
                className="bg-white flex-3 align-items-center justify-content-space-between" >
                <View className="flex-3 mb-10 h-viewport-10" >
                  <Picker seletedOption={currentLanguage}
                    onOptionSelected={this.seletedOption} options={options} />
                </View>
                <Button
                  className="flex-1 bg-dark justify-content-center mb-10 p-2 w-50 align-items-center"
                  onPress={() => setUserLanguage(currentLanguage, this.resetNavigation)}
                  text="%general_change_language%"/>
              </View>
            )
          }
        }
      </TranslationContext.Consumer>
    )
  }
}

Component.propTypes = {
  children: PropTypes.string,
  className: PropTypes.string,
  imageProps: PropTypes.object,
  navigation: PropTypes.object,
  titleProps: PropTypes.object,
  config: PropTypes.object
}

export default withNavigation(withConfig(Component))
