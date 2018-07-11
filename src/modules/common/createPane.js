// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow } from 'electron'
import path from 'path'
import url from 'url'





import { setupUploadListener } from '.'





const createPane = () => {
  const pane = new BrowserWindow({
    frame: false,
    height: 500,
    resizable: false,
    show: false,
    transparent: false,
    useContentSize: true,
    width: 500,
  })

  pane.loadPane = (paneName) => {
    pane.loadURL(url.format({
      pathname: path.resolve(__dirname, 'panes', `${paneName}.html`),
      protocol: 'file',
      slashes: true,
    }))
  }

  pane.on('blur', pane.hide)
  pane.on('ready-to-show', pane.show)
  pane.on('shortcut-reset', setupUploadListener)
  pane.on('shortcut-updated', setupUploadListener)

  return pane
}





export { createPane }
