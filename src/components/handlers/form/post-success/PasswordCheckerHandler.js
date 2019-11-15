import {
  get
} from 'lodash'

export const PasswordCheckerHandler = async (config, data, extra = {}, props) => {
  const {
    status
  } = get(data, 'response.data.customer.checkPassword', false)
  if (status) return Promise.resolve(data)
  return Promise.reject(new Error('form_password_check_invalid_credentials'))
}
