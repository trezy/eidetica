// Module imports
/* eslint-disable import/no-extraneous-dependencies */
import {
  clipboard,
  Notification,
} from 'electron'
/* eslint-enable */
import log from 'electron-log'
import path from 'path'
// import scpClient from 'scp2'
import { Client } from 'scp2'





// Component imports
import {
  generateShortlink,
  getSCPConfig,
} from '.'
import { updateIcon } from '../trayIcon'





const uploadFile = async filepath => {
  const filename = path.basename(filepath)
  const scpConfig = getSCPConfig()

  log.info('Uploading file', filename)

  const scpClient = new Client(scpConfig)

  scpClient.on('connect', () => console.log('connected!'))
  scpClient.on('error', error => console.log('error:', error))
  scpClient.on('transfer', (buffer, uploaded, total) => updateIcon(uploaded / total))

  const uploadSuccessNotification = new Notification({
    body: 'Your upload is complete and a link has been placed in your clipboard.',
    title: 'Upload complete',
  })

  const uploadErrorNotification = new Notification({
    body: 'There was an error uploading your file.',
    sound: 'Basso',
    title: 'Error uploading file',
  })

  const uploadStartNotification = new Notification({
    body: 'Please wait...',
    silent: true,
    sound: false,
    title: 'Uploading',
  })

  uploadStartNotification.show()

  try {
    await new Promise((resolve, reject) => {
      scpClient.upload(filepath, scpConfig.path, error => {
        if (!error) {
          log.info('Upload success!')

          clipboard.clear()
          clipboard.writeText(generateShortlink(filename))

          return resolve(true)
        }

        return reject(error)
      })
    })

    uploadSuccessNotification.show()
  } catch (error) {
    uploadErrorNotification.show()
  }

  uploadStartNotification.close()
}





export { uploadFile }
