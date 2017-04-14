import {
  app,
  globalShortcut,
  Menu,
  nativeImage,
  Tray
} from 'electron'
import notify from 'electron-main-notification'
import fs from 'fs'
import log from 'electron-log'
import path from 'path'





import createPane from './modules/common/createPane'
import handleScreenshot from './modules/common/handleScreenshot'
import setupApplicationMenu from './modules/common/setupApplicationMenu'
import setupAutoUpdater from './modules/common/setupAutoUpdater'
import setupUploadListener from './modules/common/setupUploadListener'





// Setup development mode
let developmentMode = process.env.NODE_ENV === 'development'





setupAutoUpdater()





new class App {
  constructor () {
    // Setup default configs
    new (require('electron-config'))({
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
      }
    })

    // Bind any functions that will always require the app as context
    this.initialize = this.initialize.bind(this)
    this.showAboutPane = this.showAboutPane.bind(this)
    this.showPreferencesPane = this.showPreferencesPane.bind(this)

    // Spin up application
    app.on('ready', this.initialize)
  }

  initialize () {
    log.info('Initializing app')

    let trayIconPath

    // Set up the default items for all context menus
    setupApplicationMenu()

    // Get the screenshot folder
    this.screenshotFolder = app.getPath('desktop')

    // Track whether or not we should exit or just hide the preferences pane
    this.shouldQuitApp = false

    // Prevent the dock icon from being displayed
    app.dock.hide()

    // Preload the pane in a hidden browser window
    this.pane = createPane()

    // Attach the pane to the app object to make it easier to access from inside the pane itself
    app.pane = this.pane

    // Figure out where the tray icon lives
    if (process.env.NODE_ENV === 'development') {
      trayIconPath = path.resolve(app.getAppPath(), 'assets', 'tray-iconTemplate.png')
    } else {
      trayIconPath = path.resolve(process.resourcesPath, 'tray-iconTemplate.png')
    }

    // Generate the tray icon as a native image
    this.trayIcon = nativeImage.createFromPath(path.resolve(trayIconPath))

    // setting the tray icon as a template image means macOS will handle changing it from white to black for us
    this.trayIcon.setTemplateImage(true)

    this.tray = new Tray(this.trayIcon)
    this.tray.setToolTip(app.getName())
    this.tray.setContextMenu(Menu.buildFromTemplate([
      {
        label: 'Preferences...',
        click: this.showPreferencesPane
      },
      { type: 'separator' },
      {
        label: `About ${app.getName()}`,
        click: this.showAboutPane
      },
      {
        label: 'Quit',
        click: app.quit
      }
    ]))

    // Start listening for screenshots to be taken
    this.startScreenshotListener()

    setupUploadListener()

    log.info('App initialized')
  }

  showAboutPane () {
    this.pane.loadPane('about')
  }

  showPreferencesPane () {
    this.pane.loadPane('preferences')
  }

  startScreenshotListener () {
    // MacOS
    fs.watch(this.screenshotFolder, (type, filename) => {
      if (filename.indexOf('Screen Shot') === 0) {
        handleScreenshot(filename)
      }
    })

    // Windows
  //  globalShortcut.register('PrintScreen', () => {
  //    log.info('PrintScreen pressed')
  //  })
  }
}
