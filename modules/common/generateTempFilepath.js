import { app } from 'electron'
import path from 'path'
import shorthash from 'shorthash'





module.exports = function (extension) {
  if (extension.indexOf('.') !== 0) {
    extension = '.' + extension
  }

  let hash = shorthash.unique((new Date()).toString())
  let filename = hash + extension
  let hashedFilepath = path.resolve(app.getPath('temp'), filename)

  return hashedFilepath
}
