const {
  app,
  clipboard,
} = require('electron')
const log = require('electron-log')
const notify = require('electron-main-notification')
const path = require('path')
const SCPClient = require('scp2').Client





const generateShortlink = require('./generateShortlink')
const getPrivateKeys = require('./getPrivateKeys')
const getSCPConfig = require('./getSCPConfig')





module.exports = function (filepath) {
  let filename = path.basename(filepath)
  let privateKeys = getPrivateKeys()
  let scpConfig = getSCPConfig()
  let keysToTry = scpConfig.password ? 1 : privateKeys.length
  let shouldContinue = true
  let destination = `${scpConfig.path}/${filename}`

  log.info('Uploading file', filename)

  for (let i = 0; i < keysToTry; i++) {
    if (!scpConfig.password) {
      scpConfig.privateKey = privateKeys[i]
    }

    let scpClient = new SCPClient(scpConfig)

    scpClient.on('transfer', (buffer, uploaded, total) => {
      log.info('transfer', uploaded, total)

      let percentage = uploaded / total * 100
    })

    scpClient.upload(filepath, destination, error => {
      if (error) {
        return log.error('Upload error:', error)
      }

      scpClient.close()

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
