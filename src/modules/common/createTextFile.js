import fs from 'fs'
import log from 'electron-log'





import { generateTempFilepath } from '.'





const createTextFile = text => new Promise((resolve, reject) => {
  log.info('Creating txt file')

  const filepath = generateTempFilepath('txt')

  fs.writeFile(filepath, text, error => {
    if (error) {
      reject(error)
    } else {
      log.info('Done.')

      resolve(filepath)
    }
  })
})





export { createTextFile }
