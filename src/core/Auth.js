/**
 * Components
 */
import jwtDecode from 'jwt-decode'
import Storage from './Storage'

const ACCESS_TOKEN_KEY = 'auth_access_token'
const PROFILE_ID_KEY = 'auth_profile_id'
const CUSTOMER_ID_KEY = 'auth_customer_id'
const SOCIAL_KEY = 'auth_social'
const SESSION_ID = 'session_id'

export const getAccessToken = async () => Storage.getItem(ACCESS_TOKEN_KEY)

export const setAccessToken = (accessToken) => {
  try {
    const {data: jwtData = {}} = jwtDecode(accessToken, {body: true})
    const {customer: {_id: customerId, social} = {}, session: { sessionId } = {}} = jwtData

    return Storage.multiSet([
      [ACCESS_TOKEN_KEY, accessToken],
      [CUSTOMER_ID_KEY, customerId],
      [SESSION_ID, sessionId],
      [SOCIAL_KEY, JSON.stringify(social)]])
  } catch (error) {
    return Promise.reject(error)
  }
}

export const clearAccessToken = async () => Storage.multiRemove([ACCESS_TOKEN_KEY,
  PROFILE_ID_KEY,
  CUSTOMER_ID_KEY,
  SESSION_ID,
  SOCIAL_KEY])

export const getProfileId = async () => Storage.getItem(PROFILE_ID_KEY)

export const setProfileId = async (profileId) => Storage.setItem(PROFILE_ID_KEY, profileId)

export const setCustomerId = async (customerId) => Storage.setItem(CUSTOMER_ID_KEY, customerId)

export const clearProfileId = async () => Storage.removeItem(PROFILE_ID_KEY)

export const clearTimeLimit = async () => Storage.removeItem('time-limit')

export const isAuthenticated = async () => {
  const hasToken = await getAccessToken()
  return !!hasToken
}

export const hasProfileSelected = async () => {
  const hasProfileSelected = await getProfileId()
  return !!hasProfileSelected
}

export const setToStorage = (key, value) => Storage.setItem(key, value)

export const getFromStorage = (key) => Storage.getItem(key)

export const getFromMultipleStorage = async (keys = []) => {
  try {
    const store = await Storage.multiGet(keys)
    return store.reduce((prev, [key, value]) => {
      prev[key] = value
      return prev
    }, {})
  } catch (error) {
    console.error('Error getFromMultipleStorage: ', error)
    return ({})
  }
}

export const removeFromStorage = (key) => Storage.removeItem(key)
