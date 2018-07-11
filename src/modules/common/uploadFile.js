/* eslint-disable import/no-extraneous-dependencies */
import {
  clipboard,
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
  log.info('Uploading file', filename)

  const keysToTry = scpConfig.password ? 1 : privateKeys.length
  let shouldContinue = true

  /* eslint-disable no-loop-func */
  for (let i = 0; i < keysToTry; i++) {
    if (!scpConfig.password) {
      scpConfig.privateKey = privateKeys[i]
    }

    scpClient.scp(filepath, scpConfig, error => {
      if (error) {
        return log.error('Upload error:', error)
      }

      shouldContinue = false

      log.info('Upload success!')

      clipboard.writeText(generateShortlink(filename))

      notify('File uploaded!', {
        body: 'The URL has been copied to your clipboard.'
      })
    })

    if (shouldContinue) {
      break // Escape the loop since we've successfully uploaded the file
    }
  }
  /* eslint-enable */
}

    scpClient.scp(filepath, scpConfig, error => {
      if (error) {
        uploadStartNotification.close()
        uploadErrorNotification.show()

        return log.error('Upload error:', error)
      }

      shouldContinue = false

      log.info('Upload success!')

      clipboard.clear()
      clipboard.writeText(generateShortlink(filename))

      uploadStartNotification.close()
      uploadCompleteNotification.show()

      return uploadStartNotification
    })

    if (shouldContinue) {
      break // Escape the loop since we've successfully uploaded the file
    }
  }
  /* eslint-enable */
}





export { uploadFile }
