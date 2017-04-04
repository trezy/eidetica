import { app } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import notify from 'electron-main-notification'





module.exports = function () {
  // Setup autoupdater
  if (process.env.NODE_ENV !== 'development') {
    autoUpdater.logger = log
    autoUpdater.logger.transports.file.level = 'info'

    autoUpdater.on('update-available', () => {
      notify('Update available', {
        body: `We're downloading the update now and will restart when we're finished.`
      })
    })

    autoUpdater.on('update-downloaded', () => {
      notify('Restarting', {
        body: `We're restarting ${app.getName()} so you can have all the nifty new features. 😉`
      })

      autoUpdater.quitAndInstall()
    })

    autoUpdater.checkForUpdates()

    // Check for updates every hour
    setInterval(
      autoUpdater.checkForUpdates,
      3600 * 1000 // [seconds in an hour] * milliseconds
    )
  }
}
