import Config from 'electron-config'





let config = new Config





module.exports = function () {
  let ret = {
    host: config.get('host'),
    port: config.get('port') || 22,
    username: config.get('username'),
    path: config.get('path'),
  }
  let password = config.get('password')

  if (password) {
    ret.password = password
  }

  return ret
}
