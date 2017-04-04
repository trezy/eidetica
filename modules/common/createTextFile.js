import { app } from 'electron'
import fs from 'fs'
import log from 'electron-log'
import path from 'path'
import shorthash from 'shorthash'





import generateTempFilepath from './generateTempFilepath'





module.exports = function (text) {
  return new Promise((resolve, reject) => {
    log.info('Creating txt file')

    let filepath = generateTempFilepath('txt')

    fs.writeFile(filepath, text, error => {
      if (error) {
        reject(error)

      } else {
        log.info('Done.')

        resolve(filepath)
      }
    })
  })
}
