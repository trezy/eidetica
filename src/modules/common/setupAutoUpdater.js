// Module imports
/* eslint-disable import/no-extraneous-dependencies */
import {
  app,
  Notification,
} from 'electron'
/* eslint-enable */
import { autoUpdater } from 'electron-updater'
import Config from 'electron-store'
import log from 'electron-log'





const config = new Config





const setupAutoUpdater = () => {
  // Setup autoupdater
  if (process.env.NODE_ENV !== 'development') {
    autoUpdater.logger = log
    autoUpdater.logger.transports.file.level = 'info'

    const updateAvailableNotification = new Notification({
      body: 'We\'re downloading the update now and will restart when we\'re finished.',
      title: 'Update available',
    })

    const updateDownloadedNotification = new Notification({
      body: `We're restarting ${app.getName()} so you can have all the nifty new features. 😉`,
      title: 'Restarting',
    })

    autoUpdater.on('update-available', () => {
      updateAvailableNotification.show()
    })

    autoUpdater.on('update-downloaded', () => {
      updateAvailableNotification.close()
      updateDownloadedNotification.show()

      autoUpdater.quitAndInstall()
    })

    if (config.get('autoUpdate')) {
      autoUpdater.checkForUpdates()
    }

    // Check for updates every hour
    setInterval(
      () => {
        if (config.get('autoUpdate')) {
          autoUpdater.checkForUpdates()
        }
      },
      3600 * 1000 // [seconds in an hour] * milliseconds
    )
  }
}





export { setupAutoUpdater }
