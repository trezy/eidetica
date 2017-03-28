let { app } = require('electron').remote





new class {
  _setVersion () {
    let versionEl = document.querySelector('#version')
    let version = app.getVersion()

    versionEl.innerHTML = version
  }

  _setYear () {
    let yearEl = document.querySelector('#year')
    let year = (new Date).getFullYear()

    yearEl.innerHTML = year
  }

  constructor () {
    this._setVersion()
    this._setYear()
  }
}
