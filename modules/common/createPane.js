import {
  app,
  BrowserWindow
} from 'electron'
import log from 'electron-log'
import path from 'path'
import url from 'url'





module.exports = function () {
  let pane = new BrowserWindow({
    frame: false,
    height: 500,
    resizable: false,
    show: false,
    transparent: false,
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
