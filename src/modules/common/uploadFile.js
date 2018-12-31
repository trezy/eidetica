// Module imports
/* eslint-disable import/no-extraneous-dependencies */
import {
  clipboard,
  Notification,
} from 'electron'
/* eslint-enable */
import Config from 'electron-store'
import log from 'electron-log'
import path from 'path'
import { Client } from 'scp2'





// Component imports
import { generateShortlink } from '.'
import { updateIcon } from '../trayIcon'





// Component constants
const config = new Config





const uploadFile = async filepath => {
  const filename = path.basename(filepath)
  const providers = config.get('providers')

  log.info('Uploading file', filename)

  const scpClient = new Client(providers[0].settings)

  scpClient.on('connect', () => log.info('Connected to server'))
  scpClient.on('error', error => log.error('Error uploading file:', error))
  scpClient.on('transfer', (buffer, uploaded, total) => updateIcon(uploaded / total))

  const uploadSuccessNotification = new Notification({
    // actions: [
    //   {
    //     text: 'View',
    //     type: 'button',
    //   },
    //   {
    //     text: 'Copy to Clipboard',
    //     type: 'button',
    //   },
    // ],
    body: 'Your upload is complete and a link has been placed in your clipboard.',
    title: 'Upload complete',
  })

  // uploadSuccessNotification.on('action', (event, index) => {
  //   if (index === 0) {
  //     log.info('View')
  //   } else if (index === 1) {
  //     log.info('Copy to Clipboard')
  //   }
  // })

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
      scpClient.upload(filepath, providers[0].settings.path, error => {
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
