// Module Imports
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'





// Component imports
import Menu from './Menu'





class Dialog extends React.Component {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  static defaultProps = {
    controls: [],
    onClose: () => {},
    title: '',
  }

  static propTypes = {
    controls: PropTypes.array,
    onClose: PropTypes.func,
    title: PropTypes.string,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  static _renderControl (control, index) {
    return React.cloneElement(control, { key: index })
  }

  _renderControls () {
    const { controls } = this.props

    return controls.map(Dialog._renderControl)
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      children,
      controls,
      onClose,
      title,
    } = this.props

    const id = title.toLowerCase().replace(/\s/g, '-')

    const dialog = (
      <dialog
        aria-labelledby={`${id}-title`}
        open>
        <header data-t="dialog:header">
          <h2 id={`${id}-title`}>{title}</h2>

          <button
            className="danger"
            name="close"
            onClick={onClose}>
            &times;
          </button>
        </header>

        <div
          className="content"
          data-t="dialog:content">
          {children}
        </div>

        {Boolean(controls.length) && (
          <footer>
            <Menu>{controls}</Menu>
          </footer>
        )}
      </dialog>
    )

    return ReactDOM.createPortal(dialog, document.querySelector('#dialog-container'))
  }
}





export default Dialog
