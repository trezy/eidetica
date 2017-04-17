const { app } = require('electron').remote
import {
  Label,
  Text
} from 'react-desktop/macOs'
import React from 'react'





import Pane from './Pane'





export default class extends Pane {
  render () {
    return (
      <table>
        <tbody>
          <tr>
            <th>
              <Label>Version:</Label>
            </th>

            <td><Text>{app.getVersion()}</Text></td>
          </tr>

          <tr>
            <th>
              <Label>Author:</Label>
            </th>

            <td><Text><a href="http://trezy.com">Trezy</a></Text></td>
          </tr>

          <tr>
            <th></th>

            <td>
              <Text>Copyright &copy; {(new Date).getFullYear()} Trezy.com</Text>
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}
