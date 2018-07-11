import fs from 'fs'
import log from 'electron-log'





const copyFile = (from, to) => new Promise((resolve, reject) => {
  const readStream = fs.createReadStream(from)
  const writeStream = fs.createWriteStream(to)

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





export { copyFile }
