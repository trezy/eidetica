// Module imports
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import { deleteProvider } from '../../modules/common'
import Menu from './Menu'





class Provider extends React.Component {
  static defaultProps = {
    onDelete: () => {},
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    onDelete: PropTypes.func,
    type: PropTypes.string.isRequired,
  }

  _onDelete = () => {
    const {
      id,
      onDelete,
    } = this.props

    deleteProvider(id)

    onDelete()
  }

  static _renderType (type) {
    switch (type) {
      case 'custom':
      default:
        return 'Custom Server'
    }
  }

  render () {
    const {
      name,
      type,
    } = this.props

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
            <button
              className="primary"
              data-menu-primary>
              Edit
            </button>

            <button
              className="danger outline"
              data-menu-secondary
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
