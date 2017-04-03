const {
  clipboard,
  globalShortcut
} = require('electron')
const log = require('electron-log')





let createTextFile = require('./createTextFile')
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
        uploadFile(files[0])
      }

    } else {
      createTextFile(clipboard.readText())
      .then(uploadFile)
    }
  })
}
