import archiver from 'archiver'
import fs from 'fs'
import log from 'electron-log'
import path from 'path'





import {
  generateTempFilepath,
  isDirectory,
} from '.'





const zipFiles = files => new Promise((resolve, reject) => {
  log.info('Zipping files:', files.join(', '))

  const archive = archiver('zip', { store: true })
  const filepath = generateTempFilepath('zip')
  const output = fs.createWriteStream(filepath)

  output.on('close', () => {
    log.info('Finished archiving files.')
    resolve(filepath)
  })

  archive.on('warning', warning => {
    log.warn(warning)
  })

  archive.on('error', error => {
    log.error(error)
    reject(error)
  })

  archive.pipe(output)

  files.forEach(file => {
    const fileBasename = path.basename(file)

    if (isDirectory(isDirectory)) {
      archive.directory(file, fileBasename)
    } else {
      archive.file(file, { name: fileBasename })
    }
  })

  archive.finalize()
})





export { zipFiles }
