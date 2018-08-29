// Module imports
import React from 'react'





// Component imports
import KBDContainer from './KBDContainer'
import Pane from './Pane'
import Switch from './Switch'





// Component constants
/* eslint-disable import/no-extraneous-dependencies */
const {
  app,
  BrowserWindow,
  globalShortcut,
} = require('electron').remote
/* eslint-enable */





class GeneralPane extends Pane {
  /***************************************************************************\
    Private methods
  \***************************************************************************/

  state = {
    altIsPressed: false,
    commandIsPressed: false,
    controlIsPressed: false,
    keyIsPressed: false,
    recordedShortcut: [],
    recordingShortcut: false,
    shiftIsPressed: false,

    autoUpdate: this.config.get('autoUpdate'),
    deleteAfterUpload: this.config.get('deleteAfterUpload'),
    filenameHandling: this.config.get('filenameHandling'),
    launchAtLogin: app.getLoginItemSettings().openAtLogin,
    shortcut: this.config.get('shortcut'),
  }





  /***************************************************************************\
    Private methods
  \***************************************************************************/

  _cancelRecording = () => {
    this.setState({ recordingShortcut: false })

    BrowserWindow.getFocusedWindow().emit('shortcut-reset')
  }

  _handleKeydown = event => {
    const {
      recordedShortcut,
      recordingShortcut,
    } = this.state

    if (recordingShortcut) {
      const newState = {
        recordedShortcut: recordedShortcut.slice(0),
        recordingShortcut: true,
      }

      let addToShortcut
      let shouldCancel = false

      switch (event.key) {
        case '+':
          addToShortcut = 'Plus'
          newState.keyIsPressed = '+'
          newState.recordingShortcut = false
          break

        case 'Alt':
          addToShortcut = 'Alt'
          newState.altIsPressed = true
          break

        case 'Control':
          addToShortcut = 'Control'
          newState.controlIsPressed = true
          break

        case 'Escape':
          shouldCancel = true
          break

        case 'Meta':
          addToShortcut = 'Super'
          newState.commandIsPressed = true
          break

        case 'Shift':
          addToShortcut = 'Shift'
          newState.shiftIsPressed = true
          break

        default:
          if (event.code.indexOf('Key') !== -1) {
            addToShortcut = event.code.replace('Key', '')
          } else {
            addToShortcut = event.key
          }
          newState.keyIsPressed = addToShortcut
          newState.recordingShortcut = false
      }

      if (shouldCancel) {
        return this._cancelRecording()
      }

      if (recordedShortcut.indexOf(addToShortcut) === -1) {
        newState.recordedShortcut.push(addToShortcut)

        if (!newState.recordingShortcut) {
          this._updateShortcut(newState.recordedShortcut.join('+'))
        }

        this.setState(newState)
      }
    }

    return false
  }

  _handleKeyup = event => {
    const { recordedShortcut } = this.state

    if (this.state.recordingShortcut) {
      const newState = { recordedShortcut: recordedShortcut.slice(0) }
      let removeFromShortcut

      switch (event.key) {
        case '+':
          removeFromShortcut = 'Plus'
          newState.keyIsPressed = false
          break

        case 'Alt':
          removeFromShortcut = 'Alt'
          newState.altIsPressed = false
          break

        case 'Control':
          removeFromShortcut = 'Control'
          newState.controlIsPressed = false
          break

        case 'Meta':
          removeFromShortcut = 'Super'
          newState.commandIsPressed = false
          break

        case 'Shift':
          removeFromShortcut = 'Shift'
          newState.shiftIsPressed = false
          break

        default:
          removeFromShortcut = this.state.keyIsPressed
          newState.keyIsPressed = false
      }

      newState.recordedShortcut.splice(newState.recordedShortcut.indexOf(removeFromShortcut), 1)

      this.setState(newState)
    }
  }

  _startRecording = () => {
    globalShortcut.unregister(this.state.shortcut)

    this.setState({
      altIsPressed: false,
      commandIsPressed: false,
      controlIsPressed: false,
      keyIsPressed: false,
      recordedShortcut: [],
      recordingShortcut: true,
      shiftIsPressed: false,
    })
  }

  _toggleLaunchAtLogin = ({ target: { checked: shouldLaunchAtLogin } }) => {
    this.setState({ launchAtLogin: shouldLaunchAtLogin })
    app.setLoginItemSettings({ openAtLogin: shouldLaunchAtLogin })
  }

  _updateShortcut (shortcut) {
    this.setState({ shortcut })
    this.config.set('shortcut', shortcut)
    BrowserWindow.getFocusedWindow().emit('shortcut-updated')
  }





  /***************************************************************************\
    Public methods
  \***************************************************************************/

  constructor (props) {
    super(props)

    window.addEventListener('keydown', this._handleKeydown)
    window.addEventListener('keyup', this._handleKeyup)
  }

  render () {
    const {
      autoUpdate,
      deleteAfterUpload,
      filenameHandling,
      launchAtLogin,
      recordedShortcut,
      recordingShortcut,
      shortcut,
    } = this.state
    const keys = recordingShortcut ? recordedShortcut : shortcut.split('+')

    return (
      <React.Fragment>
        <header>
          <h1>General Settings</h1>
        </header>

        <section className="setting">
          <header>Keyboard Shortcut</header>

          <div className="control">
            <KBDContainer
              editable
              keys={keys}
              onCancel={this._cancelRecording}
              onChange={this._startRecording}
              recording={recordingShortcut} />
          </div>

          <p>This is the decription!</p>
        </section>

        <section className="setting">
          <header><label htmlFor="filenameHandling">Filenames</label></header>

          <div className="control">
            <select
              onChange={({ target: { value } }) => this._updateSetting('filenameHandling', value)}
              value={filenameHandling}>
              <option value="original">Original Filename</option>
              <option value="hash">Random Hash</option>
              <option value="original+hash">Original Filename + Random Hash</option>
            </select>
          </div>

          <p>This is the decription!</p>
        </section>

        <section className="setting">
          <header><label htmlFor="deleteAfterUpload">Delete Files After Upload</label></header>

          <div className="control">
            <Switch
              checked={deleteAfterUpload}
              id="deleteAfterUpload"
              onChange={({ target: { checked } }) => this._updateSetting('deleteAfterUpload', checked)} />
          </div>

          <p>This is the decription!</p>
        </section>

        <section className="setting">
          <header>Launch at Login</header>

          <div className="control">
            <Switch
              checked={launchAtLogin}
              id="launchAtLogin"
              onChange={this._toggleLaunchAtLogin} />
          </div>

          <p>This is the decription!</p>
        </section>

        <section className="setting">
          <header>Automatically Check for Updates</header>

          <div className="control">
            <Switch
              checked={autoUpdate}
              id="autoUpdate"
              onChange={({ target: { checked } }) => this._updateSetting('autoUpdate', checked)} />
          </div>

          <p>This is the decription!</p>
        </section>
      </React.Fragment>
    )
  }
}





export default GeneralPane
