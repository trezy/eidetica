const {
  app,
  nativeImage,
  Tray,
} = require('electron')
const log = require('electron-log')
const path = require('path')





module.exports = function (menu) {
  let tray
  let trayIcon
  let trayIconPath

  // Figure out where the tray icon lives
  if (process.env.NODE_ENV === 'development') {
    trayIconPath = path.resolve(app.getAppPath(), 'assets', 'tray-iconTemplate.png')
  } else {
    trayIconPath = path.resolve(process.resourcesPath, 'tray-iconTemplate.png')
  }

  // Generate the tray icon as a native image
  trayIcon = nativeImage.createFromPath(path.resolve(trayIconPath))

  // setting the tray icon as a template image means macOS will handle changing it from white to black for us
  trayIcon.setTemplateImage(true)

  tray = new Tray(trayIcon)
  tray.setToolTip(app.getName())
  tray.setContextMenu(menu)

  return tray
}
