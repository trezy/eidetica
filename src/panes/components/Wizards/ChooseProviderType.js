// Module imports
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import OptionGroup from '../OptionGroup'





class SSHSourcePicker extends React.Component {
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

  providerTypeOptions = [
    {
      description: 'Custom providers require a server set up with SSH, as well as a web server to serve the files being uploaded.',
      title: 'Custom SSH Server',
      value: 'custom',
    },
  ]





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      onChange,
      value,
    } = this.props

    return (
      <section
        className="column-12 setting stacked"
        data-open={!value}>
        <header>
          <label htmlFor="provider-type">What type of provider are we adding?</label>
        </header>

        <OptionGroup
          id="provider-type"
          onChange={onChange}
          options={this.providerTypeOptions}
          required
          value={value} />
      </section>
    )
  }
}





export default SSHSourcePicker
