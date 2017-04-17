import {
  clipboard,
  globalShortcut
} from 'electron'
import fs from 'fs'
import log from 'electron-log'
import path from 'path'





let config = new (require('electron-config'))
let copyFile = require('./copyFile')
let createTextFile = require('./createTextFile')
let generateTempFilepath = require('./generateTempFilepath')
let uploadFile = require('./uploadFile')
let zipFiles = require('./zipFiles')





module.exports = function () {
  globalShortcut.register(config.get('shortcut'), () => {
    let formats = clipboard.availableFormats()
    let clipboardFileContents = clipboard.readBuffer('NSFilenamesPboardType').toString('utf8')

    if (clipboardFileContents) {
      let matches = clipboardFileContents.match(/<string>.*<\/string>/gi)
      let files = matches.map(string => string.replace(/<\/*string>/gi, ''))
      let promise

      if (files.length > 1) {
        promise = zipFiles(files)

      } else {
        let isDir = false

        try {
          fs.readdirSync(files[0])
          isDir = true
        } catch (error) {}

        if (isDir) {
          promise = zipFiles(files)
        } else {
          promise = copyFile(files[0], generateTempFilepath(path.extname(files[0]), files[0]))
        }
      }

      promise
      .then(uploadFile)
      .catch(error => {
        log.error(error)
      })

    } else {
      createTextFile(clipboard.readText())
      .then(uploadFile)
    }
  })
}
