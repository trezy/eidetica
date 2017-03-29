const {
  app,
  BrowserWindow,
} = require('electron')
const log = require('electron-log')
const path = require('path')
const url = require('url')





module.exports = function () {
  let pane = new BrowserWindow({
    frame: false,
    show: false,
    transparent: true,
    useContentSize: true,
    width: 500,
  })

  pane.loadPane = function (pane) {
    this.loadURL(url.format({
      pathname: path.join(__dirname, '..', '..', 'panes', `${pane}.html`),
      protocol: 'file',
      slashes: true,
    }))
  }

  pane.on('blur', pane.hide)
  pane.on('ready-to-show', pane.show)

  return pane
}
