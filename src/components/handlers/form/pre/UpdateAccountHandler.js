
export const UpdateAccountHandler = (config, data, props) => {
  const overrides = Object.keys(data).reduce((acc, key) => {
    const shouldOverride = String(key).startsWith('override_')
    if (shouldOverride) {
      const keyToOverride = String(key).substr(9)
      acc[keyToOverride] = acc[key]
      return acc
    }
    return acc
  }, data)
  return overrides
}
