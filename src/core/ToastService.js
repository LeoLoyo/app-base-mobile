class ToastService {
  setComponent = (component) => {
    this.component = component
  }

  success = (...args) => {
    if (this.component) this.component.success(...args)
  }

  info = (...args) => {
    if (this.component) this.component.info(...args)
  }

  error = (...args) => {
    if (this.component) this.component.error(...args)
  }
}

export default new ToastService()
