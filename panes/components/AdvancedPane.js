import React from 'react'
import {
  Label
} from 'react-desktop/macOs'





import Pane from './Pane'





export default class extends Pane {
  render () {
    return (
      <div>
        <form>
          <table>
            <tbody>
              <tr>
                <th><label htmlFor="host">Host:</label></th>
                <td><input id="host" name="host" placeholder="eidetica.io" type="url" /></td>
              </tr>

              <tr>
                <th><label htmlFor="port">Port:</label></th>
                <td><input id="port" name="port" placeholder="22" type="number" /></td>
              </tr>

              <tr>
                <th><label htmlFor="username">Username:</label></th>
                <td><input id="username" name="username" placeholder="eidetica-user" type="text" /></td>
              </tr>

              <tr>
                <th><label htmlFor="password">Password:</label></th>
                <td><input id="password" name="password" placeholder="Using SSH private key" type="password" /></td>
              </tr>

              <tr>
                <th><label htmlFor="path">Path:</label></th>
                <td><input id="path" name="path" placeholder="/var/www/uploads/" type="text" /></td>
              </tr>

              <tr>
                <th><label htmlFor="url">URL:</label></th>
                <td><input id="url" name="url" placeholder="http://eidetica.io/screenshot" type="url" /></td>
              </tr>

              <tr>
                <th><label htmlFor="hashBeforeUpload">Hash filenames before upload?</label></th>
                <td><input id="hashBeforeUpload" name="hashBeforeUpload" type="checkbox" /></td>
              </tr>

              <tr>
                <th><label htmlFor="deleteAfterUpload">Delete screenshots after upload?</label></th>
                <td><input id="deleteAfterUpload" name="deleteAfterUpload" type="checkbox" /></td>
              </tr>

              <tr>
                <th><label htmlFor="launchAtLogin">Launch at login?</label></th>
                <td><input id="launchAtLogin" name="launchAtLogin" type="checkbox" /></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    )
  }
}
