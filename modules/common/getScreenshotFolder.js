const { app } = require('electron')





module.exports = function () {
  return app.getPath('desktop')
}
