const mapObject = (obj, fn, omittedKeys) => Object.keys(obj).reduce((res, key) => {
  res[key] = omittedKeys.includes(key) ? obj[key] : fn(obj[key])
  return res
}, {})

export const deepMap = (obj, fn, omittedKeys = []) => {
  const deepMapper = val => typeof val === 'object' ? deepMap(val, fn, omittedKeys) : fn(val)
  if (Array.isArray(obj)) return obj.map(deepMapper)
  if (obj !== null && typeof obj === 'object') return mapObject(obj, deepMapper, omittedKeys)
  return obj
}
