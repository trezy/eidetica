const { app } = require('electron')
const fs = require('fs')
const log = require('electron-log')
const path = require('path')
const shorthash = require('shorthash')





const generateTempFilepath = require('./generateTempFilepath')





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
