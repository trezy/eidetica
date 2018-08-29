import React from 'react'
import Config from 'electron-config'





export default class extends React.Component {
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
