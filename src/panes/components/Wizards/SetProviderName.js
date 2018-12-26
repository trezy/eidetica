// Module imports
import PropTypes from 'prop-types'
import React from 'react'





class SetProviderName extends React.Component {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  static defaultProps = {
    onChange: () => {},
    value: null,
  }

  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _onChange = ({ target: { value } }) => {
    const { onChange } = this.props

    onChange(value)
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const { value } = this.props

    return (
      <section
        className="column-12 setting stacked"
        data-open={!value}>
        <header>
          <label htmlFor="provider-name">What should we call this provider?</label>
        </header>

        <input
          id="provider-name"
          type="text"
          onChange={this._onChange}
          value={value} />
      </section>
    )
  }
}





export default SetProviderName
