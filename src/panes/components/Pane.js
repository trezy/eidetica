import React from 'react'
import Config from 'electron-store'





export default class extends React.Component {
  /***************************************************************************\
    Private methods
  \***************************************************************************/

  _updateSetting (setting, value) {
    this.setState({ [setting]: value })
    this.config.set(setting, value)
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get config () {
    return this._config || (this._config = new Config)
  }

  get safeTitle () {
    return this.title.toLowerCase().replace(' ', '-')
  }
}
