const fs = require('fs')
const log = require('electron-log')





module.exports = function (from, to) {
  return new Promise((resolve, reject) => {
    let readStream = fs.createReadStream(from)
    let writeStream = fs.createWriteStream(to)

    readStream.on('error', error => {
      log.error('Error reading screenshot file:', error)
      reject(error)
    })

    writeStream.on('error', error => {
      log.error('Error copying screenshot file:', error)
      reject(error)
    })

    writeStream.on('close', () => {
      log.info('Copied screenshot to temp directory')
      resolve(to)
    })

    readStream.pipe(writeStream)
  })
}
