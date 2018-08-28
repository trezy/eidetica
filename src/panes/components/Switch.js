import PropTypes from 'prop-types'
import React from 'react'





const Switch = (props) => {
  const {
    checked,
    id,
    onChange,
  } = props

  return (
    <React.Fragment>
      <input
        checked={checked}
        className="switch-control"
        hidden
        id={id}
        onChange={onChange}
        type="checkbox" />

      <label
        className={['switch']}
        htmlFor={id} />
    </React.Fragment>
  )
}





Switch.defaultProps = {
  checked: false,
}

Switch.propTypes = {
  checked: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}





export default Switch
