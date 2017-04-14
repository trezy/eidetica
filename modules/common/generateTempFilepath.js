import { app } from 'electron'
import path from 'path'
import shorthash from 'shorthash'





let config = new (require('electron-config'))





module.exports = function (extension, filename) {
  let filenameHandling = config.get('filenameHandling')
  let filepath
  let newFilename
  let originalFilename

  if (filename) {
    originalFilename = path.parse(filename)
  }

  if (!filename || filenameHandling.indexOf('hash') !== -1) {
    filename = `${shorthash.unique((new Date()).toString())}`

    if (filenameHandling === 'original+hash' && originalFilename) {
      filename = `${originalFilename.name}-${filename}`
    }

    if (extension) {
      if (extension.indexOf('.') === 0) {
        extension = extension.replace(/^\./, '')
      }

      filename += `.${extension}`
    }
  }

  filepath = path.resolve(app.getPath('temp'), filename)

  return filepath
}
