import { app } from 'electron'
import Config from 'electron-config'
import fs from 'fs'
import log from 'electron-log'
import path from 'path'
import shorthash from 'shorthash'





import copyFile from './copyFile'
import generateShortlink from './generateShortlink'
import generateTempFilepath from './generateTempFilepath'
import uploadFile from './uploadFile'





let config = new Config





module.exports = function (filename) {
  log.info('Handling screenshot')

  let filepath = path.resolve(app.getPath('desktop'), filename)
  let tempFilepath = generateTempFilepath(path.extname(filename), filename)
  let shortlink = generateShortlink(path.basename(tempFilepath))

  try {
    fs.readFileSync(filepath)
  } catch (error) {
    log.error('Failed to read file. Aborting.')
    return
  }

  log.info(`A screenshot was captured at ${filename.replace('Screen Shot ', '').replace('.png', '')}`)

  copyFile(filepath, tempFilepath)
  .then(uploadFile)
  .then(() => {
    if (config.get('deleteAfterUpload')) {
      fs.unlinkSync(filepath)
    }
  })
}
