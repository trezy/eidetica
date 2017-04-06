import React from 'react'
import {
  Label,
  TextInput
} from 'react-desktop/macOs'





import Pane from './Pane'





export default class extends Pane {
  render () {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th>
                <Label className="label">Upload Shortcut:</Label>
              </th>

              <td>
                <TextInput className="input" />
              </td>
            </tr>

            <tr>
              <th>
                <Label className="label">Filenames:</Label>
              </th>

              <td>
                <TextInput className="input" />
              </td>
            </tr>

            <tr>
              <th>
                <Label className="label">Startup:</Label>
              </th>

              <td>
                <TextInput className="input" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  get title () {
    return 'General'
  }
}
