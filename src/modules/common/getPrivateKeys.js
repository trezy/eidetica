import fs from 'fs'
import path from 'path'
import sshpk from 'sshpk'





const getPrivateKeys = () => {
  const sshPath = path.resolve(process.env.HOME, '.ssh')
  const privateKeys = []

  fs.readdirSync(sshPath).forEach(file => {
    const keyPath = path.resolve(sshPath, file)

    try {
      const key = fs.readFileSync(keyPath, 'utf8')
      sshpk.parsePrivateKey(key)
      privateKeys.push(key)
    } catch (error) {}
  })

  return privateKeys
}





export { getPrivateKeys }
