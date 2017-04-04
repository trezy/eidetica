const { app } = require('electron')
const Config = require('electron-config')
const fs = require('fs')
const log = require('electron-log')
const path = require('path')
const shorthash = require('shorthash')





const copyFile = require('./copyFile')
const generateShortlink = require('./generateShortlink')
const generateTempFilepath = require('./generateTempFilepath')
const uploadFile = require('./uploadFile')





let config = new Config





module.exports = function (filename) {
  log.info('Handling screenshot')

  let filepath = path.resolve(app.getPath('desktop'), filename)
  let fileExt = path.extname(filename)
  let tempFilepath = generateTempFilepath(fileExt)
  let shortlink = generateShortlink(path.basename(tempFilepath))

  try {
    fs.readFileSync(filepath)
  } catch (error) {
    log.error('Failed to read file. Aborting.')
    return
  }

  log.info(`A screenshot was captured at ${filename.replace('Screen Shot ', '').replace('.png', '')}`)

  copyFile(filepath, tempFilepath)
  .then(() => {
    return uploadFile(tempFilepath)
  })
  .then(() => {
    if (config.get('deleteAfterUpload')) {
      fs.unlinkSync(filepath)
    }
  })
}
