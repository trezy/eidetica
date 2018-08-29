import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'





const render = () => {
  /* eslint-disable global-require */
  const { Preferences } = require('./components/Preferences')
  /* eslint-enable */

  ReactDOM.render(<AppContainer><Preferences /></AppContainer>, document.querySelector('#root'))
}





render()

if (module.hot) {
  module.hot.accept(render)
}
