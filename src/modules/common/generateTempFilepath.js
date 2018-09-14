// Module imports
// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'
import Config from 'electron-store'
import path from 'path'
import shorthash from 'shorthash'





const config = new Config





const generateTempFilepath = (extension, filename) => {
  const filenameHandling = config.get('filenameHandling')
  let filepath = null
  let newFilename = null
  let originalFilename = null

  if (filename) {
    originalFilename = path.parse(filename)
  }

  if (!filename || filenameHandling.indexOf('hash') !== -1) {
    newFilename = `${shorthash.unique((new Date()).toString())}`

    if (filenameHandling === 'original+hash' && originalFilename) {
      newFilename = `${originalFilename.name}-${newFilename}`
    }

    if (extension) {
      let newExtension = extension

      if (extension.indexOf('.') === 0) {
        newExtension = newExtension.replace(/^\./, '')
      }

      newFilename += `.${newExtension}`
    }
  }

  filepath = path.resolve(app.getPath('temp'), newFilename)

  return filepath
}





export { generateTempFilepath }
