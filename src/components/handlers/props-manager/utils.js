import {
  find,
  get,
  isNil,
  isEmpty,
  reduce
} from 'lodash'
import * as HANDLERS from './index'

import {
  replaceHightLights,
  extractHighlights
} from './regex'

const _get = (object, property, defaultValue = '') => {
  const value = get(object, property, defaultValue)
  return (isNil(value) || isEmpty(value)) ? defaultValue : value
}

export const Log = (prop, params = {}, props) => {
  console.log(props) // eslint-disable-line no-console
}

export const Split = (prop, {
  key,
  match
}, props) => {
  return {
    [key]: (String(prop).split((match)) || []).map(item => item.trim())
  }
}

export const Get = (prop, {
  key,
  field,
  defaultValue
}, props) => {
  return {
    [key]: _get(prop, field, defaultValue)
  }
}

export const Find = (prop = '', {
  key,
  hastle,
  match,
  take
}) => {
  try {
    const needle = find(hastle, (item) => get(item, match, '').toLowerCase() === (prop || '').toLowerCase()) || {}
    return {
      [key]: get(needle, take)
    }
  } catch (error) {
    return {
      [key]: prop
    }
  }
}

export const Interpolation = (prop, {
  key,
  source,
  variables
}) => {
  const {
    parts,
    highlightPattern
  } = extractHighlights(source)
  return {
    [key]: prop ? replaceHightLights(highlightPattern, parts, {
      [key]: prop,
      ...variables
    }) : null
  }
}

export const Sequence = (prop, {
  key,
  path,
  steps
}, props) => {
  const result = prop || {}
  try {
    let response = reduce(steps, (acc, current) => {
      let handler = get(current, 'handler')
      let path = get(current, 'path')
      if (HANDLERS[handler]) {
        let key = get(current, 'params.key', handler)
        let params = get(current, 'params', {})
        let result = HANDLERS[handler](get(acc, path), params, props)
        acc[key] = get(result, key)
        return acc
      }
      return acc
    }, result)
    return {
      [key]: get(response, key)
    }
  } catch (error) {
    return {
      [key]: prop
    }
  }
}

export const DefaultDate = (prop, params) => ({
  [params.key]: new Date().toISOString()
})
