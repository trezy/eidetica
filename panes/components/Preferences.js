const { app } = require('electron').remote
import React from 'react'
import {
  SegmentedControl,
  SegmentedControlItem,
  Text,
  TitleBar,
  Window
} from 'react-desktop/macOs'





import AdvancedPane from './AdvancedPane'
import GeneralPane from './GeneralPane'
import UploadPane from './UploadPane'





export default class extends React.Component {
  componentDidMount () {
    this.resizeWindow()
  }

  componentDidUpdate () {
    this.resizeWindow()
  }

  constructor (props) {
    super(props)

    this.handleClose = this.handleClose.bind(this)
    this.handleMinimize = this.handleMinimize.bind(this)
    this.handleResize = this.handleResize.bind(this)

//    this.componentDidMount = this.resizeWindow
//    this.componentDidUpdate = this.resizeWindow

    this.state = {
      isFullscreen: false,
      selected: 'general'
    }
  }

  handleClose () {
    app.pane.hide()
  }

  handleMinimize () {
    app.pane.minimize()
  }

  handleResize () {
    if (app.pane.isMaximized()) {
      app.pane.unmaximize()
    } else {
      app.pane.maximize()
    }
  }

  render () {
    return (
      <Window>
        <TitleBar
          controls
          onCloseClick={this.handleClose}
          onMinimizeClick={this.handleMinimize}
          onResizeClick={this.handleResize}
          title="Eidetica Settings"
          />

        <SegmentedControl box>
          {this.renderItem('General', <GeneralPane />)}
          {this.renderItem('Uploads', <UploadPane />)}
          {this.renderItem('Advanced', <AdvancedPane />)}
        </SegmentedControl>
      </Window>
    )
  }

  renderItem (title, component) {
    let safeTitle = title.toLowerCase().replace(' ', '-')

    return (
      <SegmentedControlItem
        title={title}
        selected={this.state.selected === safeTitle}
        onSelect={() => this.setState({ selected: safeTitle })} >
        {component}
      </SegmentedControlItem>
    )
  }

  resizeWindow () {
    let height = document.querySelector('#root').clientHeight
    let width = app.pane.getSize()[0]

    app.pane.setSize(width, height, true)
  }
}
