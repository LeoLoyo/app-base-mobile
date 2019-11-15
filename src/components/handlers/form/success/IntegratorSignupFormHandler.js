import {
  $post
} from './util'
import {
  get
} from 'lodash'
import {
  setAccessToken
} from '../../../../core/Auth'

const handleError = (error, config, extra, data) =>
  Promise.reject(get(error, 'response.data.error', error))
const handleSuccess = (response) => Promise.resolve(response)
export const IntegratorSignupFormHandler = async (config, data, extra) =>
  $post(config, get(config, 'auth.getIntegratorsUrl', ''), data, extra)
    .then((response) => Promise.resolve(response))
    .then(({
      data
    }) => setAccessToken(data))
    .catch(({
      response
    }) => handleError(response, config, extra, data))

export const IntegratorFormHandler = (config, data, extra) => {
  const [form] = get(extra, 'form')
  const url = get(extra, 'finalUrl')
  const {item} = get(extra, 'navigationParams')

  const payload = {
    operator: get(item, 'raw.operator'),
    action: get(form, 'action'),
    msisdn: get(data, 'msisdn')
  }

  const request = $post({
    auth: {
      clientID: get(config, 'auth.integratorClientID', '')
    }
  }, url, payload, {})
    .then(({
      data: response
    }) => {
      const {data} = response
      const {access} = data
      return access
        ? handleSuccess({...data, ...payload})
        : Promise.reject(new Error(get(data, 'message')))
    })
    .catch((err) => handleError(err, config, extra, data))

  return request
}
