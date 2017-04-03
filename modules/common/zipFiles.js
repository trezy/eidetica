const { app } = require('electron')
const archiver = require('archiver')
const fs = require('fs')
const log = require('electron-log')
const path = require('path')
const shorthash = require('shorthash')





module.exports = function (files) {
  return new Promise((resolve, reject) => {
    log.info('Zipping files:', files.join(', '))

    let archive = archiver('zip', {
      store: true
    })
    let hash = shorthash.unique((new Date()).toString())
    let hashedFilepath = path.resolve(app.getPath('temp'), hash + '.zip')
    let output = fs.createWriteStream(hashedFilepath)

    output.on('close', () => {
      resolve(hashedFilepath)

      log.info('Finished archiving files.')
    })

    archive.on('error', error => {
      reject(error)
    })

    archive.pipe(output)

    files.forEach(file => {
      let isDir = false

      try {
        fs.readdirSync(file)
        isDir = true
      } catch (error) {}

      if (isDir) {
        archive.directory(file, path.basename(file))

      } else {
        archive.file(file, {
          name: path.basename(file)
        })
      }
    })

    archive.finalize()
  })
}
