// Module imports
// eslint-disable-next-line import/no-extraneous-dependencies
import { Menu } from 'electron'





const setupApplicationMenu = () => {
  Menu.setApplicationMenu(Menu.buildFromTemplate([{
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' },
    ]
  }]))
}





export { setupApplicationMenu }
