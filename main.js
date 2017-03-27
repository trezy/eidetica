const {
  app,
  BrowserWindow,
  clipboard,
  globalShortcut,
  Menu,
  nativeImage,
  systemPreferences,
  Tray,
} = require('electron')
const { autoUpdater } = require('electron-updater')
const Config = require('electron-config')
const notify = require('electron-main-notification')
const fs = require('fs')
const log = require('electron-log')
const path = require('path')
const scpClient = require('scp2')
const shorthash = require('shorthash')
const sshpk = require('sshpk')
const url = require('url')





// Setup development mode
let developmentMode = process.env.NODE_ENV === 'development'





new class App {
  constructor () {
    // Generate a new config so we have access to the user's preferences
    this.config = new Config

    // Bind any functions that will always require the app as context
    this.initialize = this.initialize.bind(this)
    this.showAboutPane = this.showAboutPane.bind(this)
    this.showPreferencesPane = this.showPreferencesPane.bind(this)

    // Spin up application
    app.on('ready', this.initialize)
    app.on('before-quit', () => this.shouldQuitApp = true)
  }

  createPane () {
    this.pane = new BrowserWindow({
      frame: false,
      show: false,
      transparent: true,
      useContentSize: true,
      width: 500,
    })

    this.pane.loadPane = function (file) {
      this.loadURL(url.format({
        pathname: path.join(__dirname, 'panes', `${file}.html`),
        protocol: 'file',
        slashes: true,
      }))
    }

    this.pane.on('blur', this.pane.hide)
    this.pane.on('close', event => {
      if (this.shouldQuitApp) {
        return this.pane = null
      }

      event.preventDefault()
      this.pane.hide()
    })
    this.pane.on('ready-to-show', this.pane.show)
  }

  generateShortlink (filename) {
    return `${this.getURL()}/${filename}`
  }

  getPrivateKeys () {
    let privateKeyPath = path.resolve(process.env.HOME, '.ssh', 'id_rsa')
    let sshPath = path.resolve(process.env.HOME, '.ssh')
    let privateKeys = []

    fs.readdirSync(sshPath).forEach(file => {
      let keyPath = path.resolve(sshPath, file)

      try {
        let key = fs.readFileSync(keyPath, 'utf8')

        sshpk.parsePrivateKey(key)

        privateKeys.push(key)

      } catch (error) {}
    })

    return privateKeys
  }

  getSCPConfig () {
    let config = {
      host: this.config.get('host'),
      port: this.config.get('port') || 22,
      username: this.config.get('username'),
      path: this.config.get('path'),
    }
    let password = this.config.get('password')

    if (password) {
      config.password = password

    }

    return config
  }

  getURL () {
    return this.config.get('url')
  }

  handleScreenshot (filename) {
    let scpConfig = this.getSCPConfig()
    let filepath = path.resolve(this.screenshotFolder, filename)
    let fileExt = path.extname(filename)
    let hashedFilename = `${shorthash.unique(filename.replace(fileExt, ''))}${fileExt}`
    let hashedFilepath = path.resolve(app.getPath('temp'), hashedFilename)
    let shortlink = this.generateShortlink(hashedFilename)

    fs.renameSync(filepath, hashedFilepath)

    this.uploadFile(hashedFilepath, scpConfig, this.getPrivateKeys())
  }

  initialize () {
    if (!developmentMode) {
      autoUpdater.logger = log
      autoUpdater.logger.transports.file.level = 'info'

      autoUpdater.on('update-available', () => {
        notify('Eidetica update available', {
          body: `We're downloading the update now and will restart when we're finished.`
        })
      })

      autoUpdater.on('update-downloaded', () => {
        notify('Restarting Eidetica', {
          body: `We're restarting Eidetica so you can have all the nifty new features. 😉`
        })

        autoUpdater.quitAndInstall()
      })

      autoUpdater.checkForUpdates()
    }

    let trayIconPath

    // Set up the default items for all context menus
    this.setupApplicationMenu()

    // Get the screenshot folder
    this.screenshotFolder = app.getPath('desktop')

    // Track whether or not we should exit or just hide the preferences pane
    this.shouldQuitApp = false

    // Prevent the dock icon from being displayed
    app.dock.hide()

    // Preload the pane in a hidden browser window
    this.createPane()

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
        label: 'About Eidetica',
        click: this.showAboutPane
      },
      {
        label: 'Quit',
        click: app.quit
      }
    ]))

    // Start listening for screenshots to be taken
    this.startScreenshotListener()
  }

  setupApplicationMenu () {
    Menu.setApplicationMenu(Menu.buildFromTemplate([{
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
      ]
    }]))
  }

  showAboutPane () {
    if (!this.pane) {
      this.createPane()
    }

    this.pane.loadPane('about')
  }

  showPreferencesPane () {
    if (!this.pane) {
      this.createPane()
    }

    this.pane.loadPane('preferences')
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
  //    log.info('PrintScreen pressed')
  //  })
  }

  uploadFile (filepath, scpConfig, privateKeys = []) {
    let shortlink = this.generateShortlink(path.basename(filepath))

    if (!scpConfig.password) {
      for (let i = 0, length = privateKeys.length; i < length; i++) {
        let privateKey = privateKeys.shift()

        scpConfig.privateKey = privateKey

        scpClient.scp(filepath, scpConfig, error => {
          if (error) {
            if (privateKeys.length) {
              return this.uploadFile(filepath, scpConfig, privateKeys)
            }

            return log.error('Upload error:', error)
          }

          log.info('Upload success!')

          fs.unlinkSync(filepath)

          clipboard.writeText(shortlink)

          notify('Screenshot uploaded!', {
            body: 'The screenshot URL has been copied to your clipboard.'
          })
        })
      }

    } else {
      scpClient.scp(filepath, scpConfig, error => {
        if (error) {
          if (privateKeys.length) {
            return this.uploadFile(filepath, scpConfig, privateKeys)
          }

          return log.error('Upload error:', error)
        }

        fs.unlinkSync(filepath)

        log.info('Upload success!')

        clipboard.writeText(shortlink)

        notify('Screenshot uploaded!', {
          body: 'The screenshot URL has been copied to your clipboard.'
        })
      })
    }
  }
}
