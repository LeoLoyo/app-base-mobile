class TranslationService {
  setComponent = (component) => {
    this.component = component
  }
  _translate = (...args) => this.component.translate(...args)

  translate = this._translate
}

export default new TranslationService()
