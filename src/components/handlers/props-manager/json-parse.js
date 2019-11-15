import {isString, merge, get} from 'lodash'

export const JSONParser = (prop, params = {}, props) => {
  if (isString(prop)) {
    try { prop = JSON.parse(prop) } catch (e) {}
  }
  return {
    [params.key]: (params.mergeWith)
      ? merge({}, get(props, params.mergeWith), prop)
      : prop
  }
}
