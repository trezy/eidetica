// Module imports
import React from 'react'





// Component imports
import AddProviderDialog from './AddProviderDialog'
import CustomProvider from './CustomProvider'
import OptionGroup from './OptionGroup'
import Pane from './Pane'
import Switch from './Switch'





class UploadPane extends Pane {
  /***************************************************************************\
    Local properties
  \***************************************************************************/

  state = {
    host: this.config.get('host'),
    port: this.config.get('port'),
    password: this.config.get('password'),
    path: this.config.get('path'),
    url: this.config.get('url'),
    username: this.config.get('username'),

    addingProvider: false,
    deleteAfterUpload: this.config.get('deleteAfterUpload'),
    filenameHandling: this.config.get('filenameHandling'),
    providers: this.config.get('providers'),
  }





  /***************************************************************************\
    Private methods
  \***************************************************************************/

  _handleChange = ({ target }) => {
    this.setState({ [target.getAttribute('name')]: target.value })
  }

  _onProviderDialogClose = () => {
    this.setState({
      addingProvider: false,
      providers: this.config.get('providers'),
    })
  }

  _renderProvider = provider => (
    <li key={provider.id}>
      {(provider.type === 'custom') && (
        <CustomProvider
          {...provider}
          onDelete={this._updateProviders}
          onEdit={this._updateProviders} />
      )}
    </li>
  )

  _renderProviders () {
    const { providers } = this.state

    const providersAsArray = (Array.isArray(providers) ? providers : [providers])

    return (
      <ul className="grid">
        {providersAsArray.map(this._renderProvider)}

        <li className="card">
          <button
            className="primary"
            onClick={() => this.setState({ addingProvider: true })}>
            ✚ &nbsp; Add a new provider
          </button>
        </li>
      </ul>
    )
  }

  _updateProviders = () => {
    const providers = this.config.get('providers')

    this.setState({ providers })
  }





  /***************************************************************************\
    Public methods
  \***************************************************************************/

  render () {
    const {
      addingProvider,
      deleteAfterUpload,
      filenameHandling,
    } = this.state

    return (
      <React.Fragment>
        <header>
          <h1>Upload Settings</h1>
        </header>

        <section className="setting stacked">
          <header><label htmlFor="filenameHandling">Filename Handling</label></header>

          <OptionGroup
            onChange={value => this._updateSetting('filenameHandling', value)}
            options={[
              {
                description: 'All files will be uploaded with their original filename.',
                title: 'Original Filename',
                value: 'originalFilename',
              },
              {
                description: 'Uploads will be given a random filename to help prevent overwriting other files.',
                title: 'Random Hash',
                value: 'hash',
              },
              {
                title: 'Original Filename + Random Hash',
                description: 'Uploads will keep their  original filename, but a random has will be added to the end of the filename to help prevent overwriting other files.',
                value: 'original+hash',
              },
            ]}
            value={filenameHandling} />
        </section>

        <section className="setting">
          <header><label htmlFor="deleteAfterUpload">Delete Files After Upload</label></header>

          <div className="control">
            <Switch
              checked={deleteAfterUpload}
              id="deleteAfterUpload"
              onChange={({ target: { checked } }) => this._updateSetting('deleteAfterUpload', checked)} />
          </div>

          <div className="body">
            <p>This is the description!</p>
          </div>
        </section>

        <section className="setting stacked" data-field="providers">
          <header>Upload Providers</header>

          <div className="body">
            <p>Manage your upload providers.</p>
          </div>

          {this._renderProviders()}
        </section>

        {addingProvider && (
          <AddProviderDialog onClose={this._onProviderDialogClose} />
        )}
      </React.Fragment>
    )
  }
}





export default UploadPane
