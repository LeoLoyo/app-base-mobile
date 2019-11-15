import ToastService from '../../../../core/ToastService'
import { getError } from './util'

export const ToastFormErrorHandler = (...args) => {
  // only the last element of the array are used
  const [, , , duration, toastClassName] = args
  const error = getError(...args)
  ToastService.error(error, duration, toastClassName)
}
