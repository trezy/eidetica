/* eslint-disable import/no-extraneous-dependencies */
// Module imports
import {
  clipboard,
  globalShortcut,
} from 'electron'
/* eslint-enable */
import Entities from 'html-entities'
import ElectronConfig from 'electron-config'
import log from 'electron-log'
import path from 'path'





// Component imports
import {
  copyFile,
  createTextFile,
  generateTempFilepath,
  isDirectory,
  uploadFile,
  zipFiles,
} from '.'





// Component constants
const config = new ElectronConfig
const entities = new Entities.XmlEntities()





const setupUploadListener = () => {
  globalShortcut.register(config.get('shortcut'), async () => {
    const clipboardFileContents = clipboard.readBuffer('NSFilenamesPboardType').toString('utf8')

    const pasteboardTypes = [
      'NSFileContentsPboardType',
      'NSFilenamesPasteboardType',
      'NSFilenamesPboardType',
      'NSPasteboardTypeColor',
      'NSPasteboardTypeFileURL',
      'NSPasteboardTypeFont',
      'NSPasteboardTypeHTML',
      'NSPasteboardTypeMultipleTextSelection',
      'NSPasteboardTypePDF',
      'NSPasteboardTypePNG',
      'NSPasteboardTypeRTF',
      'NSPasteboardTypeRTFD',
      'NSPasteboardTypeRuler',
      'NSPasteboardTypeSound',
      'NSPasteboardTypeString',
      'NSPasteboardTypeTabularText',
      'NSPasteboardTypeTextFinderOptions',
      'NSPasteboardTypeTIFF',
      'NSPasteboardTypeURL',
    ]

    for (const pasteboardType of pasteboardTypes) {
      console.log(`${pasteboardType}:`, clipboard.readBuffer(pasteboardType).toString('utf8'))
      console.log('')
    }
    console.log('=== Clipboard data ===')

    if (clipboardFileContents) {
      const matches = clipboardFileContents.match(/<string>.*<\/string>/gi)
      const files = matches.map(string => entities.decode(string.replace(/<\/*string>/gi, '')))
      let fileToUpload = null

      if ((files.length > 1) || isDirectory(files[0])) {
        try {
          fileToUpload = await zipFiles(files)
        } catch (error) {
          log.info(error)
        }
      } else {
        fileToUpload = await copyFile(files[0], generateTempFilepath(path.extname(files[0]), files[0]))
      }

      try {
        uploadFile(fileToUpload)
      } catch (error) {
        log.error(error)
      }
    } else {
      const file = await createTextFile(clipboard.readText())

      uploadFile(file)
    }
  })
}





export { setupUploadListener }
