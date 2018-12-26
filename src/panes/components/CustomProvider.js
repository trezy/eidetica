// Module imports
import React from 'react'





// Component imports
import { updateCustomProvider } from '../../modules/common'
import Provider from './Provider'





// Component constants
const fieldsToRender = [
  {
    key: 'sshSource',
    title: 'SSH Source',
  },
  {
    key: 'username',
    title: 'Username',
  },
  {
    key: 'host',
    title: 'Host',
  },
  {
    key: 'port',
    title: 'Port',
  },
  {
    key: 'path',
    title: 'Path',
  },
  {
    key: 'url',
    title: 'URL',
  },
]





class CustomProvider extends Provider {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  state = {
    ...this.state,
    editedSettings: {},
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _onChange = ({ target: { name, value } }) => {
    const { editedSettings } = this.state

    this.setState({
      editedSettings: {
        ...editedSettings,
        [name]: value,
      },
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  onCancel = () => {
    this.setState({ editedSettings: {} })
  }

  onEdit = () => {
    const { onEdit } = this.props

    if (onEdit) {
      onEdit()
    }
  }

  onSave = () => {
    const { id } = this.props
    const { editedSettings } = this.state

    updateCustomProvider(id, editedSettings)
  }

  renderBody () {
    const { settings } = this.props
    const {
      editMode,
      editedSettings,
    } = this.state

    const settingsToDisplay = {
      ...settings,
      privateKey: 'REDACTED',
    }

    return (
      <React.Fragment>
        <table>
          <tbody>
            {fieldsToRender.map(({ key, title }) => (
              <tr key={key}>
                <th>{title}:</th>

                <td>
                  <input
                    className="compact"
                    name={key}
                    onChange={this._onChange}
                    readOnly={!editMode}
                    value={editedSettings[key] || settingsToDisplay[key]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    )
  }
}





export default CustomProvider
