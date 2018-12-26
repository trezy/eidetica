// Module imports
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import { deleteProvider } from '../../modules/common'
import Menu from './Menu'





class Provider extends React.Component {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  static defaultProps = {
    onDelete: () => {},
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    onDelete: PropTypes.func,
    type: PropTypes.string.isRequired,
  }

  state = {
    editMode: false,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _onCancel = () => {
    if (this.onCancel) {
      this.onCancel()
    }

    this.setState({ editMode: false })
  }

  _onDelete = () => {
    const {
      id,
      onDelete,
    } = this.props

    deleteProvider(id)

    onDelete()
  }

  _onEdit = () => {
    if (this.onEdit) {
      this.onEdit()
    }

    this.setState({ editMode: true })
  }

  _onSave = () => {
    if (this.onSave) {
      this.onSave()
    }

    this.setState({ editMode: false })
  }

  static _renderType (type) {
    switch (type) {
      case 'custom':
      default:
        return 'Custom Server'
    }
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      name,
      type,
    } = this.props
    const { editMode } = this.state

    return (
      <div className="card">
        <header>
          {name}

          <span className="sub-header">
            {Provider._renderType(type)}
          </span>
        </header>

        {this.renderBody()}

        <footer>
          <Menu>
            {!editMode && (
              <button
                className="primary"
                data-menu-primary
                onClick={this._onEdit}>
                Edit
              </button>
            )}

            {editMode && (
              <button
                className="secondary outline"
                data-menu-primary
                onClick={this._onCancel}>
                Cancel
              </button>
            )}

            {editMode && (
              <button
                className="primary"
                data-menu-primary
                onClick={this._onSave}>
                Save
              </button>
            )}

            <button
              className="danger outline"
              data-menu-secondary
              disabled={editMode}
              onClick={this._onDelete}>
              Delete
            </button>
          </Menu>
        </footer>
      </div>
    )
  }
}





export default Provider
