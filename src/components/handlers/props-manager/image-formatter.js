import { get, isObject, isString } from 'lodash'

const imageParts = ['baseUrl', 'folder', 'fileName']
const has = (elem, path) => isString(get(elem, path, undefined))

export const ImageFormatter = (prop, {
  key,
  source,
  variables
}) => {
  const presetImage = get(variables, 'preset') ? `?${variables.preset}` : ''

  if (!isObject(prop)) return {}
  if (!imageParts.every((path) => has(prop, path))) return {}
  return { [key]: imageParts.reduce((acc, path) => acc + get(prop, path), '') + presetImage }
}
