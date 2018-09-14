// Module imports
import React from 'react'





// Component imports
import AboutPane from './AboutPane'
import GeneralPane from './GeneralPane'
import UploadPane from './UploadPane'





// Component constants
/* eslint-disable import/no-extraneous-dependencies */
const { app } = require('electron').remote
/* eslint-enable */





class Preferences extends React.Component {
  /***************************************************************************\
    Local properties
  \***************************************************************************/

  state = { currentView: 'general' }





  /***************************************************************************\
    Public methods
  \***************************************************************************/

  static handleClose () {
    app.pane.hide()
  }

  static handleMinimize () {
    app.pane.minimize()
  }

  static handleResize () {
    if (app.pane.isMaximized()) {
      app.pane.unmaximize()
    } else {
      app.pane.maximize()
    }
  }

  render () {
    const { currentView } = this.state

    const currentViewIsAbout = currentView === 'about'
    const currentViewIsGeneral = currentView === 'general'
    const currentViewIsUploads = currentView === 'uploads'

    return (
      <React.Fragment>
        <div className="application-handle" />

        <nav role="banner">
          <header>
            <h1>Useful Stuff</h1>
          </header>

          <ul>
            <li>
              <button
                className="wip"
                disabled>
                Recent Uploads
              </button>
            </li>

            <li>
              <button
                className="wip"
                disabled>
                Devices
              </button>
            </li>
          </ul>

          <header>
            <h1>Settings</h1>
          </header>

          <ul>
            <li>
              <button
                data-selected={currentViewIsGeneral}
                onClick={() => this.setState({ currentView: 'general' })}>
                General
              </button>
            </li>

            <li>
              <button
                data-selected={currentViewIsUploads}
                onClick={() => this.setState({ currentView: 'uploads' })}>
                Uploads
              </button>
            </li>

            <li>
              <button
                className="wip"
                disabled>
                Account
              </button>
            </li>

            <li>
              <button
                data-selected={currentViewIsAbout}
                onClick={() => this.setState({ currentView: 'about' })}>
                About
              </button>
            </li>
          </ul>
        </nav>

        <main>
          {currentViewIsAbout && (
            <AboutPane />
          )}

          {currentViewIsGeneral && (
            <GeneralPane />
          )}

          {currentViewIsUploads && (
            <UploadPane />
          )}
        </main>
      </React.Fragment>
    )
  }
}

export { Preferences }
