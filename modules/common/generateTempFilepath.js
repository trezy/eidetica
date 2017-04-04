const { app } = require('electron')
const path = require('path')
const shorthash = require('shorthash')





module.exports = function (extension) {
  if (extension.indexOf('.') !== 0) {
    extension = '.' + extension
  }

  let hash = shorthash.unique((new Date()).toString())
  let filename = hash + extension
  let hashedFilepath = path.resolve(app.getPath('temp'), filename)

  return hashedFilepath
}
