// Module imports
import { AppContainer } from 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'





// Component constants
/* eslint-disable import/no-extraneous-dependencies */
const {
  getCurrentWindow,
  globalShortcut,
} = require('electron').remote
/* eslint-enable */





const reload = () => {
  getCurrentWindow().reload()
}

const render = () => {
  /* eslint-disable global-require */
  const { Preferences } = require('./components/Preferences')
  /* eslint-enable */

  ReactDOM.render(<AppContainer><Preferences /></AppContainer>, document.querySelector('#root'))
}

globalShortcut.register('F5', reload)
globalShortcut.register('CommandOrControl+R', reload)





window.addEventListener('beforeunload', () => {
  globalShortcut.unregister('F5', reload)
  globalShortcut.unregister('CommandOrControl+R', reload)
})





render()

if (module.hot) {
  module.hot.accept(render)
}
