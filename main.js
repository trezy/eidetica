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
let setupTray = require('./modules/common/setupTray')
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

    // Prevent the dock icon from being displayed
    app.dock.hide()

    // Set up the default items for all context menus
    setupApplicationMenu()

    // Get the screenshot folder
    this.screenshotFolder = app.getPath('desktop')

    // Preload the pane in a hidden browser window
    this.pane = createPane()

    // Start listening for screenshots to be taken
    this.startScreenshotListener()

    this.tray = setupTray(Menu.buildFromTemplate([
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
