let { app } = require('electron').remote
let Config = require('electron-config')





new class {
  constructor () {
    this.config = new Config

    this.handleLaunchAtLoginChange = this.handleLaunchAtLoginChange.bind(this)
    this.handleTextInput = this.handleTextInput.bind(this)

    this.initialize()
  }

  handleLaunchAtLoginChange (event) {
    let input = event.target
    let prefName = input.getAttribute('name')

    this.config.set(prefName, input.checked)

    app.setLoginItemSettings({
      openAtLogin: input.checked
    })
  }

  handleTextInput (event) {
    let input = event.target
    let prefName = input.getAttribute('name')

    this.config.set(prefName, input.value)
  }

  initialize () {
    this.setupTextInputs()
    this.setupLaunchAtLoginInput()
  }

  setTextInputValue (textInput) {
    let prefName = textInput.getAttribute('name')
    let pref = this.config.get(prefName)

    textInput.value = pref || ''
  }

  setupLaunchAtLoginInput () {
    let input = document.querySelector('#launchAtLogin')
    let currentValue = this.config.get('launchAtLogin')

    input.checked = app.getLoginItemSettings().openAtLogin

    input.addEventListener('change', this.handleLaunchAtLoginChange)
  }

  setupTextInputs () {
    let textInputs = document.querySelectorAll('[type=number], [type=password], [type=text], [type=url]')

    for (let i = 0, length = textInputs.length; i < length; i++) {
      let textInput = textInputs[i]

      this.setTextInputValue(textInput)

      textInput.addEventListener('input', this.handleTextInput)
    }
  }
}
