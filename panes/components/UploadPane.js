import React from 'react'
import {
  Label
} from 'react-desktop/macOs'





import Pane from './Pane'





let config = new (require('electron-config'))





export default class extends Pane {

  /***************************************************************************\
    Private methods
  \***************************************************************************/

  _handleChange (event) {
    let newState = {}

    newState[event.target.getAttribute('name')] = event.target.value

    this.setState(newState)
  }





  /***************************************************************************\
    Public methods
  \***************************************************************************/

  componentWillUpdate (nextProps, nextState) {
    for (let setting of nextState) {
      if (nextState[setting] !== this.state[setting]) {
        config.set(setting, nextState[setting])
      }
    }
  }

  constructor (props) {
    super(props)

    this._handleChange = this._handleChange.bind(this)

    this.state = {
      host: config.get('host'),
      port: config.get('port'),
      password: config.get('password'),
      path: config.get('path'),
      url: config.get('url'),
      username: config.get('username'),
    }
  }

  render () {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th>
                <Label>Host:</Label>
              </th>

              <td>
                <input
                  name="host"
                  onChange={this._handleChange}
                  placeholder="eidetica.io"
                  type="url"
                  value={this.state.host} />
              </td>
            </tr>

            <tr>
              <th>
                <Label>Port:</Label>
              </th>
              <td>
                <input
                  onChange={this._handleChange}
                  name="port"
                  placeholder="22"
                  type="number"
                  value={this.state.port} />
              </td>
            </tr>

            <tr>
              <th>
                <Label>Username:</Label>
              </th>
              <td>
                <input
                  onChange={this._handleChange}
                  name="username"
                  placeholder="eidetica-user"
                  type="text"
                  value={this.state.username} />
              </td>
            </tr>

            <tr>
              <th>
                <Label>Password:</Label>
              </th>
              <td>
                <input
                  onChange={this._handleChange}
                  name="password"
                  placeholder="Using SSH private key"
                  type="password"
                  value={this.state.password} />
              </td>
            </tr>

            <tr>
              <th>
                <Label>Path:</Label>
              </th>
              <td>
                <input
                  onChange={this._handleChange}
                  name="path"
                  placeholder="/var/www/uploads/"
                  type="text"
                  value={this.state.path} />
              </td>
            </tr>

            <tr>
              <th>
                <Label>URL:</Label>
              </th>
              <td>
                <input
                  onChange={this._handleChange}
                  name="url"
                  placeholder="http://eidetica.io/screenshot"
                  type="url"
                  value={this.state.url} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
