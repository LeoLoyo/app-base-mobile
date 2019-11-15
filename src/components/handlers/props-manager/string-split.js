import {isString, isArray, isUndefined, uniq} from 'lodash'
const splitter = (props, prop, match) => {
  if (!isString(prop)) return
  let [key, val] = prop.split(match)
  if (isUndefined(val)) return
  key = String(key).trim()
  val = String(val).trim()
  if (isUndefined(props[key])) props[key] = []
  props[key].push({value: val, key: prop})
}

export const StringSplit = (prop, params = {match: ':'}) => {
  const props = {}
  if (isArray(prop)) prop.forEach((item) => splitter(props, item, params.match))
  else splitter(props, prop)
  return Object.keys(props).reduce((acc, key) => {
    acc[key] = uniq(props[key])
    return acc
  }, {})
}
