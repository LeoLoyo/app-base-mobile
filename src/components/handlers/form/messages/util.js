import TranslationService from '../../../../core/TranslationService'
import {isObject} from 'lodash'

export const getErrorMessage = (type, ...args) => {
  let errorStr = ''

  if (type === 'local' && !/^%.*%$/.test(args[0])) { // if error is local, it should destructure the error object
    const [formName, errors = {}] = args
    const errorKeys = Object.keys(errors)
    if (!isObject(errors)) return
    if (errorKeys.length === 0) return
    const firstErrorKey = errorKeys[0]
    const [error] = String(errors[firstErrorKey][0]).split(':')
    errorStr = `%form_${formName}_${firstErrorKey}${error !== 'undefined' ? `_${error}` : ''}%`
  } else { // if external, the next arg is the error code (it should be in the translations files)
    errorStr = args[0]
  }

  return TranslationService.translate(errorStr)
}

export const getSuccessMessage = (message, ...args) => {
  return TranslationService.translate((message || '').toLowerCase())
}
