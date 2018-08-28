import Config from 'electron-config'
import React from 'react'





import Pane from './Pane'





const config = new Config





export default class extends Pane {
  /***************************************************************************\
    Local properties
  \***************************************************************************/

  state = {
    host: config.get('host'),
    port: config.get('port'),
    password: config.get('password'),
    path: config.get('path'),
    url: config.get('url'),
    username: config.get('username'),
  }





  /***************************************************************************\
    Private methods
  \***************************************************************************/

  _handleChange = ({ target }) => {
    this.setState({ [target.getAttribute('name')]: target.value })
  }





  /***************************************************************************\
    Public methods
  \***************************************************************************/

  componentWillUpdate (nextProps, nextState) {
    Object.keys(nextState).forEach(setting => {
      if (nextState[setting] !== this.state[setting]) {
        config.set(setting, nextState[setting])
      }
    })
  }

  render () {
    return (
      <React.Fragment>
        <header>
          <h1>Uploads</h1>
        </header>

        <section className="setting" data-field="host">
          <header>Host</header>

          <div className="control">
            <input
              name="host"
              onChange={this._handleChange}
              placeholder="eidetica.io"
              type="url"
              value={this.state.host} />
          </div>

          <p>This is the decription!</p>
        </section>

        <section className="setting" data-field="port">
          <header>Port</header>

          <div className="control">
            <input
              onChange={this._handleChange}
              name="port"
              placeholder="22"
              type="number"
              value={this.state.port} />
          </div>

          <p>This is the decription!</p>
        </section>

        <section className="setting" data-field="username">
          <header>Username</header>

          <div className="control">
            <input
              onChange={this._handleChange}
              name="username"
              placeholder="eidetica-user"
              type="text"
              value={this.state.username} />
          </div>

          <p>This is the decription!</p>
        </section>

        <section className="setting" data-field="password">
          <header>Password</header>

          <div className="control">
            <input
              onChange={this._handleChange}
              name="password"
              placeholder="Using SSH private key"
              type="password"
              value={this.state.password} />
          </div>

          <p>This is the decription!</p>
        </section>

        <section className="setting" data-field="path">
          <header>Path</header>

          <div className="control">
            <input
              onChange={this._handleChange}
              name="path"
              placeholder="/var/www/uploads/"
              type="text"
              value={this.state.path} />
          </div>

          <p>This is the decription!</p>
        </section>

        <section className="setting" data-field="url">
          <header>URL</header>

          <div className="control">
            <input
              onChange={this._handleChange}
              name="url"
              placeholder="http://eidetica.io/screenshot"
              type="url"
              value={this.state.url} />
          </div>

          <p>This is the decription!</p>
        </section>
      </React.Fragment>
    )
  }
}
