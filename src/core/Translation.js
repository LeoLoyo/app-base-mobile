/**
 * Libraries
 */
import React from 'react'
import PropTypes from 'prop-types'
import TranslationService from './TranslationService'

/**
 * Components
 */
import Storage from './Storage'

const USER_LANGUAGE_KEY = 'user:language'

const TranslationContext = React.createContext({})

export const getUserLanguage = async () => {
  return Storage.getItem(USER_LANGUAGE_KEY)
}

export const setUserLanguage = async (language) => {
  await Storage.setItem(USER_LANGUAGE_KEY, language)
  return language
}

export const transformOperations = (operations, value) => {
  const tranformers = {
    'lowercase': (value) => String(value).toLowerCase(),
    'capitalize': (value) => String(value).charAt(0).toUpperCase() + String(value).slice(1)
  }
  if (!value) return value
  const result = (operations || []).reduce((acc, current, index) => {
    if (typeof tranformers[current] === 'function') {
      acc = tranformers[current](acc)
    }
    return acc
  }, String(value))
  return result
}
export const translate = (language, text = '', languages = {}, params = {}, transformations = {}) => {
  text = String(text)
  let match = text.match(/^%(.+)%$/)
  if (match && match.length >= 2) {
    const key = String(match[1]).toLowerCase()
    if (languages && languages[language] && languages[language][key]) {
      const normalPart = '[^\\{\\}\\[\\]]+' // Valid matches: 'Solo Padres', 'Bem-vindo a CN'
      const paramPart = '\\{[^\\{\\}]+\\}' // Valid matches: '{JA!}', '{settings}'
      const paramsPattern = new RegExp(`(?:${normalPart})|(?:${paramPart})`, 'g')
      const paramMatches = (languages[language][key] || '').match(paramsPattern)
      return paramMatches
        .map((part) => {
          const paramMatch = part.match(/^{(.+)}$/) || []
          const transformedText = transformOperations(transformations[paramMatch[1]], params[paramMatch[1]])
          return translate(language,
            transformedText || params[paramMatch[1]],
            languages, params, transformations) || part
        })
        .join('')
    }
  }
  return text
}

class TranslationProvider extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedLanguage: null
    }
    this.setUserLanguage = this.setUserLanguage.bind(this)
  }
  async componentDidMount () {
    TranslationService.setComponent(this)
    let selectedLanguage = await getUserLanguage()
    if (!selectedLanguage) {
      selectedLanguage = await setUserLanguage(this.props.lang)
    }
    this.setState({selectedLanguage})
  }
  shouldComponentUpdate (nextState) {
    return nextState.selectedLanguage !== this.state.selectedLanguage
  }
  async componentDidUpdate () {
    await setUserLanguage(this.state.selectedLanguage)
  }
  setUserLanguage (lang, callback) {
    this.setState({selectedLanguage: lang}, () => {
      callback()
    })
  }
  translate = (text, params = {}, transformations = {}) => translate(this.state.selectedLanguage,
    text, this.props.languages, params, transformations)
  render () {
    return this.state.selectedLanguage && (
      <TranslationContext.Provider value={{
        translate: this.translate,
        setUserLanguage: (lang, callback = () => null) => this.setUserLanguage(lang, callback),
        selectedLanguage: this.state.selectedLanguage
      }}>
        {this.props.children}
      </TranslationContext.Provider>
    )
  }
}

/**
 * Props
 */
TranslationProvider.propTypes = {
  children: PropTypes.object,
  lang: PropTypes.string,
  languages: PropTypes.object,
  navigation: PropTypes.object
}

export {TranslationContext, TranslationProvider}
