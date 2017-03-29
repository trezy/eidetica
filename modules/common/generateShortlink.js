const Config = require('electron-config')





let config = new Config





module.exports = function (filename) {
  return `${config.get('url')}/${filename}`
}
