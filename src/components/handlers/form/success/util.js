import axios from 'axios'
import _get from 'lodash/get'
import {stringify} from 'qs'

export const $postSafe = async (config, url, data, extra = {}) => {
  try {
    const _response = await axios.post(
      url,
      stringify({...data, ...extra}), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-client-id': _get(config, 'auth.clientID', '')
        }
      }
    )
    return _response
  } catch (error) {
    return ({error})
  }
}

export const $post = (config, url, data, extra = {}) => axios.post(
  url,
  stringify({...data, ...extra}), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-client-id': _get(config, 'auth.clientID', '')
    }
  }
)
