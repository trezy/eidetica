// Module imports
// import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import Provider from './Provider'





class CustomProvider extends Provider {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  static defaultProps = {}

  static propTypes = {}





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  renderBody () {
    const {
      id,
      name,
      settings,
    } = this.props

    const settingsToDisplay = {
      ...settings,
      privateKey: 'REDACTED',
    }

    return (
      <React.Fragment>
        <table>
          <tbody>
            <tr>
              <th>ID:</th>

              <td>{id}</td>
            </tr>

            <tr>
              <th>Name:</th>

              <td>{name}</td>
            </tr>

            <tr>
              <th>Setting:</th>

              <td>
                <pre>{JSON.stringify(settingsToDisplay, null, 2)}</pre>
              </td>
            </tr>
          </tbody>
        </table>
      </React.Fragment>
    )
  }
}





export default CustomProvider
