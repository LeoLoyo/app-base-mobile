import {get, merge} from 'lodash'
import {$post} from './util'

const handleError = (error, config, extra, data) => {
  return Promise.reject(get(error, 'data.error', 'network_error'))
}

export const RecoverPasswordFormHandler = async (config, data, extra = {}) => {
  const extraData = merge({}, extra)
  return $post(config, get(config, 'auth.recoverPasswordURL', ''), data)
    .then(({data}) => ({...data}))
    .catch(({response}) => handleError(response, config, extraData, data))
}
