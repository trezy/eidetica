import { app } from 'electron'
import archiver from 'archiver'
import fs from 'fs'
import log from 'electron-log'
import path from 'path'
import shorthash from 'shorthash'





import generateTempFilepath from './generateTempFilepath'





module.exports = function (files) {
  return new Promise((resolve, reject) => {
    log.info('Zipping files:', files.join(', '))

    let archive = archiver('zip', {
      store: true
    })
    let filepath = generateTempFilepath('zip')
    let output = fs.createWriteStream(filepath)

    output.on('close', () => {
      resolve(filepath)

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
