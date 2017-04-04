import { clipboard } from 'electron'
import log from 'electron-log'
import notify from 'electron-main-notification'
import path from 'path'
import scpClient from 'scp2'





import generateShortlink from './generateShortlink'
import getPrivateKeys from './getPrivateKeys'
import getSCPConfig from './getSCPConfig'





module.exports = function (filepath) {
  let filename = path.basename(filepath)
  let privateKeys = getPrivateKeys()
  let scpConfig = getSCPConfig()

  log.info('Uploading file', filename)

  let keysToTry = scpConfig.password ? 1 : privateKeys.length
  let shouldContinue = true

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
}
