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

    // By default, close events shouldn't actually close the app
    app.shouldQuit = false

    // Prevent the dock icon from being displayed in production
    if (!isDevelopmentMode()) {
      app.dock.hide()
    }

    // Preload the pane in a hidden browser window
    // app.pane = createPane()

    // Create the system tray icon
    await updateIcon()

    const menuOptions = [
      {
        label: 'Preferences...',
        click: createPane,
      },
      {
        label: 'Quit',
        click: () => {
          app.shouldQuit = true
          app.quit()
        },
      },
    ]

    if (isDevelopmentMode()) {
      menuOptions.push({
        label: 'Restart',
        click: () => {
          app.shouldQuit = true
          app.relaunch()
          app.quit()
        },
      })
    }

    app.tray.setToolTip(app.getName())
    app.tray.setContextMenu(Menu.buildFromTemplate(menuOptions))

    app.on('will-quit', event => (!app.shouldQuit ? event.preventDefault() : null))

    // Start listening for screenshots to be taken
    this.startScreenshotListener()

    setupUploadListener()

    log.info('App initialized')
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
