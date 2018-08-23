// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'
import Config from 'electron-config'
import fs from 'fs'
import log from 'electron-log'
import path from 'path'





import {
  copyFile,
  generateTempFilepath,
  uploadFile,
} from '.'





const config = new Config





const handleScreenshot = async filename => {
  log.info('Handling screenshot')

  const filepath = path.resolve(app.getPath('desktop'), filename)
  const tempFilepath = generateTempFilepath(path.extname(filename), filename)

  try {
    fs.readFileSync(filepath)
  } catch (error) {
    log.error('Failed to read file. Aborting.')
    return
  }

  await copyFile(filepath, tempFilepath)
  await uploadFile(tempFilepath)

  if (config.get('deleteAfterUpload')) {
    fs.unlinkSync(filepath)
  }
}





export { handleScreenshot }
