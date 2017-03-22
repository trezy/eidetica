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





let config = new Config
let preferencesPane
let screenshotFolder
let shouldQuitApp = false
let tray





function createPreferencesPane () {
  preferencesPane = new BrowserWindow({
    show: false,
    titleBarStyle: 'hidden',
    transparent: true,
    useContentSize: true,
  })

  preferencesPane.loadURL(path.join('file://', __dirname, 'preferences/', 'index.html'))
  preferencesPane.on('blur', preferencesPane.hide)
  preferencesPane.on('close', event => {
    if (shouldQuitApp) {
      return preferencesPane = null
    }

    event.preventDefault()
    preferencesPane.hide()
  })
}

function generateShortlink (filename) {
  return `${getURL()}/${filename}`
}

function getURL () {
  return config.get('url')
}

function getSCPConfig () {
  return {
    host: config.get('host'),
//    port: config.get('port'),
    username: config.get('username'),
    password: config.get('password'),
    path: config.get('path'),
  }
}

function handleScreenshot (filename) {
  let filepath = path.resolve(screenshotFolder, filename)
  let fileExt = path.extname(filename)
  let hashedFilename = `${shorthash.unique(filename.replace(fileExt, ''))}${fileExt}`
  let hashedFilepath = path.resolve(app.getPath('temp'), hashedFilename)
  let shortlink = generateShortlink(hashedFilename)

  fs.renameSync(filepath, hashedFilepath)

  scpClient.scp(hashedFilepath, getSCPConfig(), (error => {
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

function showPreferencesPane () {
  if (!preferencesPane) {
    createPreferencesPane()
  }

  preferencesPane.show()
}

function startScreenshotListener () {
  // MacOS
  fs.watch(screenshotFolder, (type, filename) => {
    if (type === 'change' && filename.indexOf('Screen Shot') === 0) {
      handleScreenshot(filename)
    }
  })

  // Windows
//  globalShortcut.register('PrintScreen', () => {
//    console.log('PrintScreen pressed')
//  })
}





app.on('ready', function () {
  let trayIconPath

  // Get the screenshot folder
  screenshotFolder = app.getPath('desktop')

  // Prevent the dock icon from being displayed
  app.dock.hide()

  // Preload the preferences pane in a hidden browser window
  createPreferencesPane()

  // Figure out where the tray icon lives
  if (process.env.NODE_ENV === 'development') {
    trayIconPath = path.resolve(app.getAppPath(), 'assets', 'tray-iconTemplate.png')
  } else {
    trayIconPath = path.resolve(process.resourcesPath, 'tray-iconTemplate.png')
  }

  // Generate the tray icon as a native image
  let trayIcon = nativeImage.createFromPath(path.resolve(trayIconPath))

  // setting the tray icon as a template image means macOS will handle changing it from white to black for us
  trayIcon.setTemplateImage(true)

  tray = new Tray(trayIcon)
  tray.setToolTip('Eidetica')
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Preferences...',
      click: showPreferencesPane
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: app.quit
    }
  ]))

  // Start listening for screenshots to be taken
  startScreenshotListener()
})

app.on('before-quit', () => shouldQuitApp = true)
