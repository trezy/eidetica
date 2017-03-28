const fs = require('fs')
const path = require('path')
const sshpk = require('sshpk')





module.exports = function () {
  let privateKeyPath = path.resolve(process.env.HOME, '.ssh', 'id_rsa')
  let sshPath = path.resolve(process.env.HOME, '.ssh')
  let privateKeys = []

  fs.readdirSync(sshPath).forEach(file => {
    let keyPath = path.resolve(sshPath, file)

    try {
      let key = fs.readFileSync(keyPath, 'utf8')

      sshpk.parsePrivateKey(key)

      privateKeys.push(key)

    } catch (error) {}
  })

  return privateKeys
}