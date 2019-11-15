
import _ from 'lodash'
const { isArray, uniqBy, values, get, map, filter, find, toArray: _toArray, merge: _merge, keyBy: _keyBy } = _

const ArrayReverse = (arr, params) => {
  return {
    [params.key]: isArray(arr) ? arr.reverse() : arr
  }
}

const ArrayUnique = (arr, params) => {
  return {
    [params.key]: isArray(arr)
      ? values(uniqBy(arr, params.uniqBy || '_id'))
      : arr
  }
}

const ArrayFilter = (arr, params, context) => {
  return {
    [params.key]: filter(get(params, 'nest', []), (item, index) => {
      return get(context, get(params, 'match')) === index
    })
  }
}

const ArrayFind = (arr, params, context) => {
  const output = {
    [params.key]: find(get(params, 'nest', arr), (item, index) => {
      return (
        get(context, get(params, 'match')) ===
        get(item, get(params, 'field'), index)
      )
    })
  }
  return output
}
const conditional = {
  equal: (a, b) => a === b,
  distinct: (a, b) => a !== b,
  contains: (a, b) => String(a).indexOf(b) > 0,
  notContains: (a, b) => String(a).indexOf(b) === -1
}
const ArrayFilterBy = (arr, params, props) => {
  if (isArray(params.filter)) {
    const filteredData = map(params.filter, ({ field, match, condition = 'equal' }) => {
      const dynamicProps = /^{{(.+)}}$/.exec(match)
      if (dynamicProps) {
        const propValue = get(props, dynamicProps[1], null)
        return filter(arr, item => conditional[condition](get(item, field), propValue))
      }
      return filter(arr, item => conditional[condition](get(item, field), match))
    })

    return {
      [params.key]: [].concat.apply([], filteredData)
    }
  }
  return {
    [params.key]: arr
  }
}

const ArrayLooper = (arr, params, context) => {
  if (!isArray(arr)) return {}
  const { prevKey, nextKey, idPath, currentIdPath } = params
  const currentId = get(context, currentIdPath, NaN)
  const currentElementIndex = arr.findIndex(
    current => get(current, idPath, NaN) === currentId
  )
  if (currentElementIndex === -1) return {}
  const nextIndex =
    currentElementIndex === arr.length - 1 ? 0 : currentElementIndex + 1
  const prevIndex =
    currentElementIndex === 0 ? arr.length - 1 : currentElementIndex - 1
  return {
    [prevKey]: get(arr[prevIndex], idPath, ''),
    [nextKey]: get(arr[nextIndex], idPath, '')
  }
}
const objectToArray = (arr, {key, parseChildren = false}, context) => {
  let output = _toArray(arr)
  if (parseChildren) {
    output = output.map(JSON.parse)
  }

  return {
    [key]: _toArray(output)
  }
}

const ArrayMergeWith = (
  arr,
  { key, base, mergeWith, unionKeys = [] },
  props
) => {
  const replaceProps = (child, keysArr) => {
    const mergeWithKeys = keysArr.reduce((prev, curr = {}) => {
      return {
        ...prev,
        [curr.field]: find(get(props, mergeWith), [
          curr.with,
          child[curr.field]
        ])
      }
    }, {})
    return mergeWithKeys
  }
  const output = map(arr, (child, index) => ({
    ...child,
    [base]: _merge(get(child, base), replaceProps(child[base], unionKeys))
  }))
  return {
    [key]: output
  }
}

const ArrayMergeWithKey = (arr, { key, mergeWith, unionKey }, props) => {
  const merged = _(arr).keyBy(unionKey)
    .merge(_keyBy(get(props, mergeWith), unionKey))
    .values()
    .value()
  return {[key]: merged}
}

export {
  ArrayReverse,
  ArrayUnique,
  ArrayFilter,
  ArrayFilterBy,
  ArrayLooper,
  ArrayFind,
  ArrayMergeWith,
  objectToArray,
  ArrayMergeWithKey
}
