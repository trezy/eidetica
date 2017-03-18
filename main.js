const Config = require('electron-config')
const fs = require('fs')
const notify = require('electron-main-notification')
const path = require('path')
const scpClient = require('scp2')
const shorthash = require('shorthash')





let config = new Config
let {
  app,
  clipboard,
  globalShortcut,
  Menu,
  nativeImage,
  systemPreferences,
  Tray,
} = require('electron')
let screenshotFolder
let tray





function displayPreferences () {
  console.log('Display Preferences Pane')
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

  screenshotFolder = app.getPath('desktop')

  app.dock.hide()

  if (process.env.NODE_ENV === 'development') {
    trayIconPath = path.resolve(app.getAppPath(), 'assets', 'tray-iconTemplate.png')
  } else {
    trayIconPath = path.resolve(process.resourcesPath, 'tray-iconTemplate.png')
  }

  let trayIcon = nativeImage.createFromPath(path.resolve(trayIconPath))
  trayIcon.setTemplateImage(true)

  tray = new Tray(trayIcon)
  tray.setToolTip('Eidetica')
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Preferences...',
      click: displayPreferences
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: app.quit
    }
  ]))

  startScreenshotListener()
})
