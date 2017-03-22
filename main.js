let {
  app,
  BrowserWindow,
  clipboard,
  globalShortcut,
  Menu,
  nativeImage,
  systemPreferences,
  Tray,
} = require('electron')
const Config = require('electron-config')
const notify = require('electron-main-notification')
const fs = require('fs')
const path = require('path')
const scpClient = require('scp2')
const shorthash = require('shorthash')





class App {
  constructor () {
    this.config = new Config

    this.initialize = this.initialize.bind(this)
    this.showPreferencesPane = this.showPreferencesPane.bind(this)

    app.on('ready', this.initialize)
    app.on('before-quit', () => this.shouldQuitApp = true)
  }

  createPreferencesPane () {
    this.preferencesPane = new BrowserWindow({
      show: false,
      titleBarStyle: 'hidden',
      transparent: true,
      useContentSize: true,
    })

    this.preferencesPane.loadURL(path.join('file://', __dirname, 'preferences/', 'index.html'))
    this.preferencesPane.on('blur', this.preferencesPane.hide)
    this.preferencesPane.on('close', event => {
      if (this.shouldQuitApp) {
        return this.preferencesPane = null
      }

      event.preventDefault()
      this.preferencesPane.hide()
    })
  }

  generateShortlink (filename) {
    return `${this.getURL()}/${filename}`
  }

  getSCPConfig () {
    let host = this.config.get('host')
    let port = this.config.get('port') || 22
    let username = this.config.get('username')
    let password = this.config.get('password')
    let path = this.config.get('path')

    return {
      host: host,
      port: port,
      username: username,
      password: password,
      path: path,
    }
  }

  getURL () {
    return this.config.get('url')
  }

  handleScreenshot (filename) {
    let filepath = path.resolve(this.screenshotFolder, filename)
    let fileExt = path.extname(filename)
    let hashedFilename = `${shorthash.unique(filename.replace(fileExt, ''))}${fileExt}`
    let hashedFilepath = path.resolve(app.getPath('temp'), hashedFilename)
    let shortlink = this.generateShortlink(hashedFilename)

    fs.renameSync(filepath, hashedFilepath)

    scpClient.scp(hashedFilepath, this.getSCPConfig(), (error => {
      if (error) {
        return console.log('Upload error:', error)
      }

      fs.unlinkSync(hashedFilepath)

      clipboard.writeText(shortlink)

      notify('Screenshot uploaded!', {
        body: 'The screenshot URL has been copied to your clipboard.'
      })
    }))
  }

  initialize () {
    let trayIconPath

    // Get the screenshot folder
    this.screenshotFolder = app.getPath('desktop')

    // Track whether or not we should exit or just hide the preferences pane
    this.shouldQuitApp = false

    // Prevent the dock icon from being displayed
    app.dock.hide()

    // Preload the preferences pane in a hidden browser window
    this.createPreferencesPane()

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
    this.tray.setToolTip('Eidetica')
    this.tray.setContextMenu(Menu.buildFromTemplate([
      {
        label: 'Preferences...',
        click: this.showPreferencesPane
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: app.quit
      }
    ]))

    // Start listening for screenshots to be taken
    this.startScreenshotListener()
  }

  showPreferencesPane () {
    if (!this.preferencesPane) {
      this.createPreferencesPane()
    }

    this.preferencesPane.show()
  }

  startScreenshotListener () {
    // MacOS
    fs.watch(this.screenshotFolder, (type, filename) => {
      if (type === 'change' && filename.indexOf('Screen Shot') === 0) {
        this.handleScreenshot(filename)
      }
    })

    // Windows
  //  globalShortcut.register('PrintScreen', () => {
  //    console.log('PrintScreen pressed')
  //  })
  }
}

let eidetica = new App
