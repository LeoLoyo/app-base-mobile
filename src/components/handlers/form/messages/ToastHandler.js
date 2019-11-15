
import ToastService from '../../../../core/ToastService'
import {getSuccessMessage, getErrorMessage} from './util'

export const ToastSuccessHandler = ({message = '', duration = 5000, ...rest}) => {
  const messageToast = getSuccessMessage(message, rest)
  ToastService.success(messageToast, duration, 'toast-top')
}

export const ToastErrorHandler = ({message = '', duration = 5000, ...rest}) => {
  const messageToast = getErrorMessage('local', message, rest)
  ToastService.error(messageToast, duration, 'toast-top')
}
