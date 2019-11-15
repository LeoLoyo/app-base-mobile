import {has, get, merge} from 'lodash'
import firebase from 'react-native-firebase'
import {$post} from './util'

import {setAccessToken, setProfileId} from '../../../../core/Auth'

const handleError = (error, config, extra, data) => {
  if (has(error, 'data.error.message') && has(error, 'data.error.code')) {
    return LoginFormHandler(config, data, merge({}, extra, {limit_code: get(error, 'data.error.code')}))
  } else {
    return Promise.reject(get(error, 'data.error', 'network_error'))
  }
}

export const LoginFormHandler = async (config, data, extra = {}) => {
  const token = await firebase.messaging().getToken()
  const extraData = merge({}, extra, { grant_type: 'password', token })
  return $post(config, get(config, 'auth.getTokenURL', ''), data, extraData)
    .then(({data}) => Promise.resolve(data))
    .then(({data}) => [setAccessToken(get(data, 'access_token')), setProfileId(get(data, 'data.profileId'))])
    .catch(({response}) => handleError(response, config, extraData, data))
}
