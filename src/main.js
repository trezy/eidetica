// Module imports
/* eslint-disable import/no-extraneous-dependencies */
import {
  app,
  Menu,
} from 'electron'
/* eslint-enable */
import fs from 'fs'
import Config from 'electron-config'
import log from 'electron-log'

// Component imports
import {
  createPane,
  handleScreenshot,
  isDevelopmentMode,
  setupApplicationMenu,
  setupAutoUpdater,
  setupUploadListener,
} from './modules/common'
import { updateIcon } from './modules/trayIcon'





setupAutoUpdater()





// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit()
}





new class App {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  fillPad = 4

  screenshotQueue = new Set([])

  size = 45





  /***************************************************************************\
    Local Methods
  \***************************************************************************/

  initialize = async () => {
    log.info('Initializing app')

    // Set up the default items for all context menus
    setupApplicationMenu()

    // Get the screenshot folder
    this.screenshotFolder = app.getPath('desktop')

    // Prevent the dock icon from being displayed in production
    if (!isDevelopmentMode()) {
      app.dock.hide()
    }

    // Preload the pane in a hidden browser window
    this.pane = createPane()

    // Create the system tray icon
    await updateIcon()

    app.tray.setToolTip(app.getName())
    app.tray.setContextMenu(Menu.buildFromTemplate([
      {
        label: 'Preferences...',
        click: this.showPreferencesPane,
      },
      {
        label: 'Quit',
        click: app.quit,
        },
    ]))

    // Start listening for screenshots to be taken
    this.startScreenshotListener()

    setupUploadListener()

    log.info('App initialized')
  }

  showPreferencesPane = () => {
    this.pane.loadPane('index')
  }

  startScreenshotListener = () => {
    // MacOS
    fs.watch(this.screenshotFolder, (type, filename) => {
      if (/^Screen Shot.*\.png$/gi.exec(filename) && !this.screenshotQueue.has(filename)) {
        this.screenshotQueue.add(filename)
        handleScreenshot(filename)
      }
    })

    // Windows
    // globalShortcut.register('PrintScreen', () => {
    //   log.info('PrintScreen pressed')
    // })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor () {
    // Setup default configs
    new Config({
      defaults: {
        // App settings
        autoUpdate: true,
        deleteAfterUpload: true,
        filenameHandling: 'hash',
        launchAtLogin: true,
        shortcut: 'Super+Control+U',

        // Server settings
        host: '',
        password: '',
        path: '',
        port: '',
        url: '',
        username: '',
      },
    })

    // Spin up application
    app.on('ready', this.initialize)
  }
}
