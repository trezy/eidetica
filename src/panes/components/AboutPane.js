// Module imports
import React from 'react'





/* eslint-disable import/no-extraneous-dependencies */
const { app } = require('electron').remote
/* eslint-enable */





const AboutPane = () => (
  <React.Fragment>
    <header><h1>About</h1></header>

    <table>
      <tbody>
        <tr>
          <th>Version:</th>

          <td>{app.getVersion()}</td>
        </tr>

        <tr>
          <th>Author:</th>

          <td><a href="http://trezy.com">Trezy</a></td>
        </tr>

        <tr>
          <th />

          <td>Copyright &copy; {(new Date).getFullYear()} Trezy.com</td>
        </tr>
      </tbody>
    </table>
  </React.Fragment>
)





export default AboutPane
