import { readFileSync } from 'fs'
import { homedir } from 'os'
import { resolve } from 'path'
import ElectronConfig from 'electron-config'
import SSHConfig from 'ssh-config'
import untildify from 'untildify'





const config = new ElectronConfig





const getSCPConfig = () => {
  const { host } = config.get()
  const sshConfig = SSHConfig.parse(readFileSync(resolve(homedir(), '.ssh', 'config'), 'utf8'))
  const hostConfig = sshConfig.compute(host)

  const scpConfig = {}

  if (hostConfig.IdentityFile) {
    scpConfig.privateKey = readFileSync(resolve(untildify(hostConfig.IdentityFile[0])))
  }

  scpConfig.host = hostConfig.HostName || host
  scpConfig.path = config.get('path')
  scpConfig.port = hostConfig.Port || 22
  scpConfig.username = hostConfig.User || config.get('username')

  const password = config.get('password')

  if (password) {
    scpConfig.password = password
  }

  return scpConfig
}





export { getSCPConfig }
