let {
  BrowserWindow,
  shell
} = require('electron').remote





new class {
  _bindKeys () {
    window.addEventListener('keydown', this._handleKeypress)
  }

  _handleAnchorClick (event) {
    let target = event.target

    event.preventDefault()

    shell.openExternal(target.getAttribute('href'))
  }

  _handleKeypress (event) {
    switch (event.which) {
      case 27:
        BrowserWindow.getFocusedWindow().hide()
        break
    }
  }

  _setupAnchors () {
    let anchors = document.querySelectorAll('a')

    for (let i = 0, length = anchors.length; i < length; i++) {
      let anchor = anchors[i]

      anchor.addEventListener('click', this._handleAnchorClick)
    }
  }

  constructor () {
    this._handleAnchorClick = this._handleAnchorClick.bind(this)
    this._handleKeypress = this._handleKeypress.bind(this)

    this._bindKeys()
    this._setupAnchors()
  }
}
