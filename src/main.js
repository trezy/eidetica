// Module imports
/* eslint-disable import/no-extraneous-dependencies */
import {
  app,
  Menu,
  nativeImage,
  Tray,
} from 'electron'
/* eslint-enable */
import fs from 'fs'
import Config from 'electron-config'
import log from 'electron-log'
import path from 'path'
import sharp from 'sharp'

// Component imports
import createPane from './modules/common/createPane'
import handleScreenshot from './modules/common/handleScreenshot'
import setupApplicationMenu from './modules/common/setupApplicationMenu'
import setupAutoUpdater from './modules/common/setupAutoUpdater'
import setupUploadListener from './modules/common/setupUploadListener'





// Setup development mode
const isDevelopmentMode = process.env.NODE_ENV === 'development'





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

    // Track whether or not we should exit or just hide the preferences pane
    this.shouldQuitApp = false

    // Prevent the dock icon from being displayed
    // app.dock.hide()

    // Preload the pane in a hidden browser window
    this.pane = createPane()

    // Attach the pane to the app object to make it easier to access from inside the pane itself
    app.pane = this.pane

    // Create the system tray icon
    this.tray = new Tray(await this.createIconFrame(100))
    this.tray.setToolTip(app.getName())
    this.tray.setContextMenu(Menu.buildFromTemplate([
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
      if (filename.indexOf('Screen Shot') === 0) {
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

  createIconFill (state) {
    const fillHeight = Math.floor((state / 100) * (this.size - (this.fillPad * 2))) + this.fillPad
    const overlayPath = path.resolve(App.assetPath, 'tray-icon.overlay.png')

    // Create the fill as a plain white image with the appropriate dimensions
    const fill = sharp({
      create: {
        background: {
          r: 255,
          b: 255,
          g: 255,
          alpha: 1,
        },
        channels: 4,
        height: fillHeight,
        width: this.size,
      },
    })

    // Set the fill's background to transparent for the embed process
    fill.background({
      r: 0,
      g: 0,
      b: 0,
      alpha: 0,
    })

    // Extend the image to the full icon by padding the top with the remainder of the image height
    fill.extend({
      bottom: 0,
      left: 0,
      right: 0,
      top: this.size - fillHeight,
    })

    // Convert the fill to PONG format, otherwise the overlay process won't work
    fill.png()

    // Use the overlay to cut the fill to the appropriate shape
    fill.overlayWith(overlayPath, { cutout: true })

    return fill
  }

  async createIconFrame (state) {
    const iconAsNativeImage = nativeImage.createEmpty()
    const outline = sharp(path.resolve(App.assetPath, 'tray-icon.outline.png'))

    const fill = this.createIconFill(state)

    outline.overlayWith(await fill.toBuffer())

    const imageBuffer = await outline.toBuffer()

    iconAsNativeImage.addRepresentation({
      buffer: imageBuffer,
      height: this.size,
      scaleFactor: 2,
      width: this.size,
    })

    // iconAsNativeImage.addRepresentation({
    //   buffer: imageBuffer,
    //   height: 22,
    //   scaleFactor: 1,
    //   width: 22,
    // })

    iconAsNativeImage.setTemplateImage(true)

    return iconAsNativeImage
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  static get assetPath () {
    if (isDevelopmentMode) {
      return path.resolve(__dirname, 'assets')
    }

    return path.resolve(process.resourcesPath, 'app', 'src', 'assets')
  }
}
