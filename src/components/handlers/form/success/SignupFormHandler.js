import {$post} from './util'
import {get} from 'lodash'
import {setAccessToken, setProfileId} from '../../../../core/Auth'

const handleError = (error) => Promise.reject(get(error, 'data.error', 'network_error'))

export const SignupFormHandler = async (config, data, extra) => {
  try {
    return $post(config, get(config, 'auth.authSignupURL', ''), data, extra)
      .then(({data}) => Promise.resolve(data))
      .then(({data}) => [setAccessToken(get(data, 'access_token')), setProfileId(get(data, 'data.profileId'))])
      .catch(({response}) => handleError(response, config, extra, data))
  } catch (error) {
    return handleError(error, config, extra, data)
  }
}

export const SignupWithProfileFormHandler = async (config, data, extra) => {
  // //console.log(data, extra)
  return Promise.resolve()
}
