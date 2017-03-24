let { shell } = require('electron').remote
let Config = require('electron-config')





new class PreferencesPane {
  constructor () {
    this.initialize()
  }

  initialize () {
    let anchors = document.querySelectorAll('a')

    for (let i = 0, length = anchors.length; i < length; i++) {
      let anchor = anchors[i]

      anchor.addEventListener('click', event => {
        let target = event.target

        event.preventDefault()

        shell.openExternal(target.getAttribute('href'))
      })
    }
  }
}
