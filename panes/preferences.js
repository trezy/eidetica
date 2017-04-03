let { app } = require('electron').remote
let Config = require('electron-config')





new class {
  constructor () {
    this.config = new Config

    this.handleLaunchAtLoginChange = this.handleLaunchAtLoginChange.bind(this)
    this.handleInput = this.handleInput.bind(this)

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

  handleInput (event) {
    let input = event.target
    let prefName = input.getAttribute('name')
    let value

    switch (input.getAttribute('type')) {
      case 'checkbox':
        value = input.checked
        break

      case 'email':
      case 'number':
      case 'password':
      case 'url':
      case 'text':
      default:
        value = input.value
    }

    this.config.set(prefName, value)
  }

  initialize () {
    this.setupInputs([
      'deleteAfterUpload',
      'hashBeforeUpload',
      'host',
      'password',
      'path',
      'port',
      'url',
      'username',
    ])

    this.setupLaunchAtLoginInput()
  }

  linkInputToConfig (input) {
    let eventType

    this.setInputValue(input)

    switch (input.getAttribute('type')) {
      case 'checkbox':
        eventType = 'change'
        break

      case 'email':
      case 'number':
      case 'password':
      case 'url':
      case 'text':
      default:
        eventType = 'input'
    }

    input.addEventListener(eventType, this.handleInput)
  }

  setInputValue (input) {
    let pref = input.getAttribute('name')
    let value = this.config.get(pref)

    switch (input.getAttribute('type')) {
      case 'checkbox':
        input.checked = value
        break

      case 'email':
      case 'number':
      case 'password':
      case 'url':
      case 'text':
      default:
        input.value = value || ''
    }
  }

  setupLaunchAtLoginInput () {
    let input = document.querySelector('#launchAtLogin')
    let currentValue = this.config.get('launchAtLogin')

    input.checked = app.getLoginItemSettings().openAtLogin

    input.addEventListener('change', this.handleLaunchAtLoginChange)
  }

  setupInputs (inputs) {
    inputs.forEach(inputID => {
      let input = document.querySelector(`#${inputID}`)

      this.linkInputToConfig(input)
    })
  }
}
