const {
  clipboard,
  globalShortcut
} = require('electron')
const Config = require('electron-config')
const log = require('electron-log')
const path = require('path')





let config = new Config
let copyFile = require('./copyFile')
let createTextFile = require('./createTextFile')
let generateTempFilepath = require('./generateTempFilepath')
let uploadFile = require('./uploadFile')
let zipFiles = require('./zipFiles')





module.exports = function () {
  globalShortcut.register('CommandOrControl+Option+U', () => {
    let formats = clipboard.availableFormats()
    let clipboardFileContents = clipboard.readBuffer('NSFilenamesPboardType').toString('utf8')

    if (clipboardFileContents) {
      let matches = clipboardFileContents.match(/<string>.*<\/string>/gi)
      let files = matches.map(string => string.replace(/<\/*string>/gi, ''))

      if (files.length > 1) {
        zipFiles(files)
        .then(uploadFile)

      } else {
        let filepath = files[0]

        if (config.get('hashBeforeUpload')) {
          filepath = generateTempFilepath(path.extname(files[0]))

          copyFile(files[0], filepath)
          .then(uploadFile)

        } else {
          uploadFile(filepath)
        }
      }

    } else {
      createTextFile(clipboard.readText())
      .then(uploadFile)
    }
  })
}
