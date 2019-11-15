import TranslationService from '../../../../core/TranslationService'
import isObject from 'lodash/isObject'
import has from 'lodash/has'

export const getError = (type, ...args) => {
  let errorStr = ''
  // if error is local, it should destructure the error object
  if (type === 'local') {
    const [formName, errors = {}] = args
    const errorKeys = Object.keys(errors)
    if (!isObject(errors)) return
    if (errorKeys.length === 0) return
    const firstErrorKey = errorKeys[0]
    const [error] = errors[firstErrorKey][0].split(':')
    errorStr = `%form_${formName}_${firstErrorKey}_${error}%`
    return TranslationService.translate(errorStr)
  }
  // if external, the next arg is the error code (it should be in the translations files)
  const errorObj = args[0] || {}

  if (has(errorObj, 'graphQLErrors.0.message')) {
    errorStr = `%${errorObj['graphQLErrors'][0]['message'].toLowerCase()}%`
  } else if (has(errorObj, 'message')) {
    if (String(errorObj.message).includes('Network')) {
      errorStr = ('%network_error%')
    } else {
      const errorMessage = String(errorObj.message).split('Error:')
      errorStr = (`%${errorMessage[errorMessage.length - 1]}%`)
    }
  } else {
    errorStr = (`%${String(errorObj).toLowerCase()}%`)
  }
  return TranslationService.translate(errorStr)
}
