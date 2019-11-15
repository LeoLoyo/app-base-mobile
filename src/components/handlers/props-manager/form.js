
import {get, lowerCase, snakeCase} from 'lodash'

export const InputFormatter = (prop, {key} = {key: 'form'}, props) => {
  const prefix = get(prop, 'name', 'form')
  const translations = get(props, 'translations', {})
  return {
    [key]: (get(prop, 'formSteps', [])).map((step) => (
      {
        action: step.action || '/',
        fields: (step.fields || []).map(({type, name, label, invalidText, ...properties}) => ({
          type,
          name,
          validationMessage: invalidText,
          placeholder: get(translations, snakeCase(lowerCase(`${prefix}_${label}`)),
            snakeCase(lowerCase(`form_${prefix}_${label}`))),
          validations: (Object.keys(properties) || []).map((label) => (label))
        }))
      }
    ))
  }
}
