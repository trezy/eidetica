const {
  app,
  globalShortcut,
  Menu,
  nativeImage,
  Tray,
} = require('electron')
const notify = require('electron-main-notification')
const fs = require('fs')
const log = require('electron-log')
const path = require('path')





let createPane = require('./modules/common/createPane')
let handleScreenshot = require('./modules/common/handleScreenshot')
let setupApplicationMenu = require('./modules/common/setupApplicationMenu')
let setupAutoUpdater = require('./modules/common/setupAutoUpdater')
let setupUploadListener = require('./modules/common/setupUploadListener')





// Setup development mode
let developmentMode = process.env.NODE_ENV === 'development'





setupAutoUpdater()





new class App {
  constructor () {
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
