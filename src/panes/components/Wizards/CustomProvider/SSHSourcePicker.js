// Module imports
import PropTypes from 'prop-types'
import React from 'react'





// Component imports
import OptionGroup from '../../OptionGroup'





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

  sshSourceOptions = [
    {
      description: 'Your SSH config file &mdash; usually located at ~/.ssh/config &mdash; is a great way to make it easier to access servers you connect to regularly. If you don\'t already have one, we recommend looking into it.',
      title: 'SSH Config (Recommended)',
      value: 'config',
    },

    {
      description: 'Manually enter the details to connect to your server.',
      title: 'Manual Entry',
      value: 'manual',
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
          <label htmlFor="ssh-source">Where should we get this provider's settings from?</label>
        </header>

        <OptionGroup
          id="ssh-source"
          onChange={onChange}
          options={this.sshSourceOptions}
          required
          value={value} />
      </section>
    )
  }
}





export default SSHSourcePicker
