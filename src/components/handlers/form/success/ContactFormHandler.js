import {get, merge} from 'lodash'
import {$post} from './util'

const handleError = (error, config, extra, data) => {
  return Promise.reject(get(error, 'data.error', 'network_error'))
}

export const ContactFormHandler = async (config, data, extra = {}) => {
  const extraData = merge({}, extra)
  return $post(config, get(config, 'general.contactUrl', ''), data, extraData)
    .then(({data}) => ({...data}))
    .catch(({response}) => handleError(response, config, extraData, data))
}
