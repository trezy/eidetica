import PropTypes from 'prop-types'
import React from 'react'





class OptionGroup extends React.Component {
  /***************************************************************************\
    Local properties
  \***************************************************************************/

  static defaultProps = {
    id: 'blep',
    onChange: () => {},
    options: [],
    required: false,
    value: null,
  }

  static propTypes = {
    id: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.exact({
      description: PropTypes.string,
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })),
    required: PropTypes.bool,
    value: PropTypes.any,
  }

  state = {
    currentValue: this.props.value || null,
  }





  /***************************************************************************\
    Private methods
  \***************************************************************************/

  _onChange = event => {
    const { onChange } = this.props
    const { currentValue } = this.state
    const { target: { checked, value } } = event

    if ((value !== currentValue) && checked) {
      this.setState({ currentValue: value })
      onChange(value)
    }
  }

  _onClick = value => {
    const { onChange } = this.props
    const { currentValue } = this.state

    if (value !== currentValue) {
      this.setState({ currentValue: value })
      onChange(value)
    }
  }

  _renderOption = option => {
    const {
      description,
      title,
      value,
    } = option
    const {
      id,
      required,
    } = this.props
    const { currentValue } = this.state

    const key = `${id}-${value}`
    const isSelected = currentValue === value

    return (
      <li
        className="card"
        data-selected={isSelected}
        onClick={() => this._onClick(value)}
        onKeyPress={() => this._onClick(value)}
        key={key}>
        <div className="control">
          <input
            checked={isSelected}
            className="checkbox-control"
            hidden
            id={key}
            name={id}
            onChange={this._onChange}
            required={required}
            type="radio"
            value={value} />

          <label
            className="checkbox"
            htmlFor={key} />
        </div>

        <header>
          <label htmlFor={key}>
            {title}
          </label>
        </header>

        <div className="body">
          <p>{description}</p>
        </div>
      </li>
    )
  }





  /***************************************************************************\
    Public methods
  \***************************************************************************/

  render () {
    const { options } = this.props

    return (
      <ul className="option-group">
        {options.map(this._renderOption)}
      </ul>
    )
  }
}





export default OptionGroup
