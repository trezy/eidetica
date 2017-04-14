let {
  app,
  BrowserWindow,
  globalShortcut
} = require('electron').remote
import {
  Checkbox,
  Label,
  Link,
  TextInput
} from 'react-desktop/macOs'
import React from 'react'





import Pane from './Pane'





let config = new (require('electron-config'))





export default class extends Pane {

  /***************************************************************************\
    Private methods
  \***************************************************************************/

  _cancelRecording () {
    this.setState({
      recordingShortcut: false,
    })

    BrowserWindow.getFocusedWindow().emit('shortcut-reset')
  }

  _handleKeydown (event) {
    if (this.state.recordingShortcut) {
      let addToShortcut
      let key
      let newState = {
        recordedShortcut: this.state.recordedShortcut.slice(0),
        recordingShortcut: true
      }
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

      if (this.state.recordedShortcut.indexOf(addToShortcut) === -1) {
        newState.recordedShortcut.push(addToShortcut)

        if (!newState.recordingShortcut) {
          newState.shortcut = newState.recordedShortcut.join('+')
        }

        this.setState(newState)
      }
    }
  }

  _handleKeyup (event) {
    if (this.state.recordingShortcut) {
      let key
      let newState = {
        recordedShortcut: this.state.recordedShortcut.slice(0)
      }
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

  _renderKey (key) {
    switch (key.toLowerCase()) {
      case 'alt':
      case 'option':
        key = `⌥ Opt`
        break

      case 'backspace':
      case 'delete':
        key = `⌫ Del`
        break

      case 'command':
      case 'meta':
      case 'super':
        key = `⌘ Cmd`
        break

      case 'control':
        key = `Ctrl`
        break

      case 'enter':
      case 'return':
        key = `⏎ ${key}`

      case 'shift':
        key = `⇧ ${key}`
        break

      case 'plus':
        key = `+`
        break

      default:
        key = key.toUpperCase()
    }

    return key
  }

  _renderKeys (keys) {
    keys = this._reorderKeys(keys)

    return keys.map(key => {
      key = this._renderKey(key)

      return (
        <kbd key={key}>{key}</kbd>
      )
    })
  }

  _reorderKeys (keys) {
    let reorderedKeys = []

    // Clone the array so we're not affecting the original array that's stored in the state
    keys = keys.slice(0)

    let superIndex = keys.indexOf('Super')
    if (superIndex !== -1) {
      reorderedKeys.push(keys.splice(superIndex, 1)[0])
    }

    let altIndex = keys.indexOf('Alt')
    if (altIndex !== -1) {
      reorderedKeys.push(keys.splice(altIndex, 1)[0])
    }

    let controlIndex = keys.indexOf('Control')
    if (controlIndex !== -1) {
      reorderedKeys.push(keys.splice(controlIndex, 1)[0])
    }

    let shiftIndex = keys.indexOf('Shift')
    if (shiftIndex !== -1) {
      reorderedKeys.push(keys.splice(shiftIndex, 1)[0])
    }

    reorderedKeys = reorderedKeys.concat(keys)

    return reorderedKeys
  }

  _startRecording () {
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





  /***************************************************************************\
    Public methods
  \***************************************************************************/

  componentWillUpdate (nextProps, nextState) {
    let settings = [
      'autoUpdate',
      'filenameHandling',
      'launchAtLogin',
      'shortcut',
    ]

    // Diff the settings and only update the config if the setting has actually changed
    settings.forEach(setting => {
      if (this.state[setting] !== nextState[setting]) {
        config.set(setting, nextState[setting])

        if (setting === 'shortcut') {
          BrowserWindow.getFocusedWindow().emit('shortcut-updated')
        }
      }
    })

    if (this.state.launchAtLogin !== nextState.launchAtLogin) {
      app.setLoginItemSettings({
        openAtLogin: nextState.launchAtLogin
      })
    }
  }

  constructor (props) {
    super(props)

    this._handleKeydown = this._handleKeydown.bind(this)
    this._handleKeyup = this._handleKeyup.bind(this)

    window.addEventListener('keydown', this._handleKeydown)
    window.addEventListener('keyup', this._handleKeyup)

    this.state = {
      altIsPressed: false,
      commandIsPressed: false,
      controlIsPressed: false,
      keyIsPressed: false,
      recordedShortcut: [],
      recordingShortcut: false,
      shiftIsPressed: false,

      autoUpdate: config.get('autoUpdate'),
      filenameHandling: config.get('filenameHandling'),
      launchAtLogin: app.getLoginItemSettings().openAtLogin,
      shortcut: config.get('shortcut'),
    }
  }

  render () {
    let shortcutFooter
    let keys

    if (this.state.recordingShortcut) {
      keys = this.state.recordedShortcut

      shortcutFooter = (
        <div>
          <Label>
            Recording shortcut...

            &nbsp;
            &nbsp;
            &nbsp;

            <Link
              onClick={() => this._cancelRecording()} >
              Cancel
            </Link>
          </Label>
        </div>
      )

    } else {
      keys = this.state.shortcut.split('+')

      shortcutFooter = (
        <div>
          <Link
            onClick={() => this._startRecording()} >
            Change
          </Link>
        </div>
      )
    }

    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th style={{ verticalAlign: 'text-top' }} >
                <Label>Shortcut:</Label>
              </th>

              <td>
                <div className="kbd-container">
                  {this._renderKeys(keys)}
                </div>
                {shortcutFooter}
              </td>
            </tr>

            <tr>
              <th>
                <Label>Filenames:</Label>
              </th>

              <td>
                <select
                  onChange={event => this.setState({ filenameHandling: event.target.value })}
                  value={this.state.filenameHandling}>
                  <option value="original">Original Filename</option>
                  <option value="hash">Random Hash</option>
                  <option value="original+hash">Original Filename + Random Hash</option>
                </select>
              </td>
            </tr>

            <tr>
              <th style={{ verticalAlign: 'text-top' }}>
                <Label>Startup:</Label>
              </th>

              <td>
                <Checkbox
                  defaultChecked={this.state.launchAtLogin}
                  label="Launch at login"
                  onChange={event => this.setState({ launchAtLogin: event.target.checked })}
                  />

                <Checkbox
                  defaultChecked={this.state.autoUpdate}
                  label="Automatically check for updates"
                  onChange={event => this.setState({ autoUpdate: event.target.checked })}
                  />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return 'General'
  }
}
