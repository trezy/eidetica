/* eslint-disable import/no-extraneous-dependencies */
import {
  clipboard,
  Notification,
} from 'electron'
/* eslint-enable */
import log from 'electron-log'
import path from 'path'
import scpClient from 'scp2'





import {
  generateShortlink,
  getPrivateKeys,
  getSCPConfig,
} from '.'





const uploadFile = filepath => {
  const filename = path.basename(filepath)
  const privateKeys = getPrivateKeys()
  const scpConfig = getSCPConfig()

  const keysToTry = scpConfig.password ? 1 : privateKeys.length
  let uploadSuccess = false

  log.info('Uploading file', filename)

  scpClient.on('connect', () => console.log('connected!'))
  scpClient.on('error', error => console.log('error:', error))
  scpClient.on('transfer', (buffer, uploaded, total) => console.log('transfer:', uploaded, total))

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
    title: 'Uploading',
  })

  uploadStartNotification.show()

  /* eslint-disable no-loop-func */
  for (let i = 0; i < keysToTry; i++) {
    console.log('Trying key...')
    if (!scpConfig.password) {
      scpConfig.privateKey = privateKeys[i]
    }

    scpClient.scp(filepath, scpConfig, error => {
      console.log('Error?', error)
      if (!error) {
        log.info('Upload success!')

        clipboard.clear()
        clipboard.writeText(generateShortlink(filename))

        uploadSuccess = true
      }
    })

    // Escape the loop since we've successfully uploaded the file
    if (uploadSuccess) {
      break
    }
  }

  uploadStartNotification.close()

  if (uploadSuccess) {
    uploadSuccessNotification.show()
  } else {
    uploadErrorNotification.show()
  }
  /* eslint-enable */
}





export { uploadFile }
