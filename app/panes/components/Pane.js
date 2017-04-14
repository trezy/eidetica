import React from 'react'





export default class extends React.Component {
  get safeTitle () {
    return this.title.toLowerCase().replace(' ', '-')
  }
}
