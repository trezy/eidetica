import React from 'react'





class Menu extends React.Component {
  _renderChild = (child, index) => (
    <li key={index}>{child}</li>
  )

  _renderChildren () {
    const { children } = this.props
    const childrenAsArray = (Array.isArray(children) ? children : [children]).filter(child => !!child)

    const primaryOptions = childrenAsArray.filter(({ props: { 'data-menu-primary': primary } }) => primary)
    const secondaryOptions = childrenAsArray.filter(({ props: { 'data-menu-secondary': secondary } }) => secondary)

    return (
      <React.Fragment>
        {Boolean(primaryOptions.length) && (
          <ul className="primary">
            {primaryOptions.map(this._renderChild)}
          </ul>
        )}

        {Boolean(secondaryOptions.length) && (
          <ul className="secondary">
            {secondaryOptions.map(this._renderChild)}
          </ul>
        )}
      </React.Fragment>
    )
  }

  render = () => (
    <menu type="toolbar">
      {this._renderChildren()}
    </menu>
  )
}





export default Menu
