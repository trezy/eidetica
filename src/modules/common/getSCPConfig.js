import ElectronConfig from 'electron-config'





const config = new ElectronConfig





const getSCPConfig = () => {
  const ret = {
    host: config.get('host'),
    path: config.get('path'),
    port: config.get('port') || 22,
    username: config.get('username'),
  }

  const password = config.get('password')

  if (password) {
    ret.password = password
  }

  return ret
}





export { getSCPConfig }
