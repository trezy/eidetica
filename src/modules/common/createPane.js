// eslint-disable-next-line import/no-extraneous-dependencies
import {
  app,
  BrowserWindow,
} from 'electron'
import path from 'path'
import url from 'url'





import {
  isDevelopmentMode,
  setupUploadListener,
} from '.'





const createPane = () => {
  const pane = new BrowserWindow({
    backgroundColor: 'blue',
    devTools: isDevelopmentMode(),
    frame: true,
    fullscreenable: false,
    height: 400,
    minHeight: 400,
    minWidth: 600,
    movable: true,
    show: false,
    titleBarStyle: 'hiddenInset',
    useContentSize: true,
    width: 600,
  })

  pane.loadPane = (paneName) => {
    pane.loadURL(url.format({
      pathname: path.resolve(__dirname, '..', '..', 'panes', `${paneName}.html`),
      protocol: 'file',
      slashes: true,
    }))
  }

  pane.loadPane('index')

  if (isDevelopmentMode()) {
    pane.webContents.openDevTools({ mode: 'undocked' })
  }

  pane.on('beforeunload', () => delete app.pane)
  pane.on('ready-to-show', pane.show)
  pane.on('shortcut-reset', setupUploadListener)
  pane.on('shortcut-updated', setupUploadListener)

  app.pane = pane
}





export { createPane }
