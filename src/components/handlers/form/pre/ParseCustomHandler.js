export const ParseCustomHandler = (config, {
  _id,
  ...data
}, props) => {
  // "settings":{"time_limit":"29","message_type":"0","message_limit":"hola"},"message_limit":"holis"}
  return {
    _id,
    custom: JSON.stringify({
      settings: data
    })
  }
}

export const GroupFieldsCustomHandler = (config, {
  _id,
  ...data
}, props) => {
  if (props.groupFields) {
    const custom = {}
    if (props.groupFields.fields && props.groupFields.fields.length) {
      for (let field of props.groupFields.fields) {
        if (data[field]) {
          custom[field] = data[field]
        }
      }
    }
    return ({
      ...data,
      custom: JSON.stringify(custom)
    })
  }
  return {}
}

export const GroupFieldsAddressCustomHandler = (config, {
  _id,
  ...data
}, props) => {
  if (props.groupFields) {
    const custom = {}
    if (props.groupFields.fields && props.groupFields.fields.length) {
      for (let field of props.groupFields.fields) {
        if (data[field]) {
          custom[field] = data[field]
        }
      }
    }
    return ({
      ...data,
      ...data.customer_address,
      custom: JSON.stringify(custom)
    })
  }
  return {}
}
