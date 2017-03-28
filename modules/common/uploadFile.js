const { clipboard } = require('electron')
const log = require('electron-log')
const notify = require('electron-main-notification')
const path = require('path')
const scpClient = require('scp2')





const generateShortlink = require('./generateShortlink')
const getPrivateKeys = require('./getPrivateKeys')
const getSCPConfig = require('./getSCPConfig')





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

      notify('Screenshot uploaded!', {
        body: 'The screenshot URL has been copied to your clipboard.'
      })
    })

    if (shouldContinue) {
      break // Escape the loop since we've successfully uploaded the file
    }
  }
}
