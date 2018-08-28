import PropTypes from 'prop-types'
import React from 'react'





class KBDContainer extends React.Component {
  /***************************************************************************\
    Local properties
  \***************************************************************************/

  static defaultProps = {
    keys: [],
    onCancel: () => {},
    onChange: () => {},
    recording: false,
  }

  static propTypes = {
    keys: PropTypes.array,
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
    recording: PropTypes.bool,
  }

  state = {}





  /***************************************************************************\
    Private methods
  \***************************************************************************/

  static _renderKey (key) {
    let renderedKey

    switch (key.toLowerCase()) {
      case 'alt':
      case 'option':
        renderedKey = '⌥ Opt'
        break

      case 'backspace':
      case 'delete':
        renderedKey = '⌫ Del'
        break

      case 'command':
      case 'meta':
      case 'super':
        renderedKey = '⌘ Cmd'
        break

      case 'control':
        renderedKey = 'Ctrl'
        break

      case 'enter':
      case 'return':
        renderedKey = `⏎ ${key}`
        break

      case 'shift':
        renderedKey = `⇧ ${key}`
        break

      case 'plus':
        renderedKey = '+'
        break

      default:
        renderedKey = key.toUpperCase()
    }

    return renderedKey
  }

  static _renderKeys (keys) {
    return KBDContainer._reorderKeys(keys).map(key => {
      const renderedKey = KBDContainer._renderKey(key)

      return (
        <kbd key={renderedKey}>{renderedKey}</kbd>
      )
    })
  }

  static _reorderKeys (keys) {
    const reorderedKeys = []

    // Clone the array so we're not affecting the original array that's stored in the state
    // keys = keys.slice(0)
    const keysClone = keys.slice(0)

    const superIndex = keysClone.indexOf('Super')
    if (superIndex !== -1) {
      reorderedKeys.push(keysClone.splice(superIndex, 1)[0])
    }

    const altIndex = keysClone.indexOf('Alt')
    if (altIndex !== -1) {
      reorderedKeys.push(keysClone.splice(altIndex, 1)[0])
    }

    const controlIndex = keysClone.indexOf('Control')
    if (controlIndex !== -1) {
      reorderedKeys.push(keysClone.splice(controlIndex, 1)[0])
    }

    const shiftIndex = keysClone.indexOf('Shift')
    if (shiftIndex !== -1) {
      reorderedKeys.push(keysClone.splice(shiftIndex, 1)[0])
    }

    return reorderedKeys.concat(keysClone)
  }





  /***************************************************************************\
    Public methods
  \***************************************************************************/

  render = () => {
    const {
      editable,
      keys,
      onCancel,
      onChange,
      recording,
    } = this.props

    return (
      <div className="kbd-container">
        {KBDContainer._renderKeys(keys)}

        {editable && (
          <footer>
            {recording && (
              <React.Fragment>
                <span>Recording...</span>
                <button
                  className="link"
                  onClick={onCancel}>
                  Cancel
                </button>
              </React.Fragment>
            )}

            {!recording && (
              <React.Fragment>
                <button
                  className="link"
                  onClick={onChange}>
                  Change
                </button>
              </React.Fragment>
            )}
          </footer>
        )}
      </div>
    )
  }
}





export default KBDContainer
