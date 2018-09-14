// Module imports
import PropTypes from 'prop-types'
import React from 'react'





class ManualSSHSettings extends React.Component {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  static defaultProps = {
    onChange: () => {},
    value: {
      host: '',
      password: '',
      path: '',
      port: 22,
      privateKey: '',
      username: '',
      url: '',
    },
  }

  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.shape({
      host: PropTypes.string,
      password: PropTypes.string,
      path: PropTypes.string,
      port: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      privateKey: PropTypes.string,
      username: PropTypes.string,
      url: PropTypes.string,
    }),
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _onChange = ({ target: { name, value } }) => {
    const { onChange } = this.props

    onChange(name, value)
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const { value } = this.props
    const {
      host,
      password,
      path,
      privateKey,
      port,
      url,
      username,
    } = value

    return (
      <React.Fragment>
        <div className="column-8 input-group">
          <label htmlFor="ssh-host">Hostname</label>

          <input
            id="ssh-host"
            name="host"
            onChange={this._onChange}
            placeholder="eidetica.io"
            required
            type="text"
            value={host} />

          <sub>
            Either the URL or IP address of your server. <strong>Do not</strong> include a protocol (Like <code>https://</code>.
          </sub>
        </div>

        <div
          className="column-4 input-group"
          data-optional>
          <label htmlFor="ssh-port">Port</label>

          <input
            id="ssh-port"
            min={1}
            max={65535}
            name="port"
            onChange={this._onChange}
            type="number"
            value={port} />
        </div>

        <div
          className="column-12 input-group"
          data-optional>
          <label htmlFor="ssh-path">Path</label>

          <input
            id="ssh-path"
            name="path"
            onChange={this._onChange}
            type="text"
            value={path} />

          <sub>
            <p>The path to upload your files to on the server, e.g. <code>~/uploads/</code>, or <code>/var/www/eidetica.io/uploads/</code></p>
          </sub>
        </div>

        <div
          className="column-12 input-group"
          data-optional>
          <label htmlFor="ssh-url">URL</label>

          <input
            id="ssh-url"
            name="url"
            onChange={this._onChange}
            type="url"
            value={url} />

          <sub>
            <p>This is the URL that will be used to build your links.</p>
          </sub>
        </div>

        <div
          className="column-12 input-group"
          data-optional>
          <label htmlFor="ssh-username">Username</label>

          <input
            id="ssh-username"
            name="username"
            onChange={this._onChange}
            type="text"
            value={username} />

          <sub>
            <p>It's usually a good idea to explicitly set the username to log in with, though this is <em>technically</em> unnecessary if your username on this machine and your username on the remote machine are the same.</p>
          </sub>
        </div>

        <div
          className="column-12 input-group"
          data-optional>
          <label htmlFor="ssh-password">Password</label>

          <input
            id="ssh-password"
            name="password"
            onChange={this._onChange}
            type="password"
            value={password} />

          <sub>
            <p>Use this field if you connect to your server with a password. Keep in mind that this is much less secure than using a public/private key combo.</p>
          </sub>
        </div>

        <div
          className="column-12 input-group"
          data-optional>
          <label htmlFor="ssh-private-key">Private Key</label>

          <textarea
            className="code"
            id="ssh-private-key"
            name="privateKey"
            onChange={this._onChange}
            placeholder={'-----BEGIN RSA PRIVATE KEY-----\nqwertyuiopasdfghjklzxcvbnm1234567890+qwertyuiopasdfghjklzxcvb...\n-----END RSA PRIVATE KEY-----\n'}
            type="privateKey"
            value={privateKey} />
        </div>
      </React.Fragment>
    )
  }
}





export default ManualSSHSettings
