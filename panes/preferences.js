let Config = require('electron-config')





new class {
  constructor () {
    this.config = new Config

    this.handleInput = this.handleInput.bind(this)

    this.initialize()
  }

  handleInput (event) {
    let input = event.target
    let prefName = input.getAttribute('name')

    if (input.getAttribute('type') === 'checkbox') {
      this.config.set(prefName, input.checked)

    } else {
      this.config.set(prefName, input.value)
    }
  }

  initialize () {
    let inputs = document.querySelectorAll('input')

    for (let i = 0, length = inputs.length; i < length; i++) {
      let input = inputs[i]

      this.setInputValue(input)

      if (input.getAttribute('type') === 'checkbox') {
        input.addEventListener('change', this.handleInput)

      } else {
        input.addEventListener('input', this.handleInput)
      }
    }
  }

  setInputValue (input) {
    let prefName = input.getAttribute('name')
    let pref = this.config.get(prefName)

    input.value = pref || ''
  }
}
