import { readdirSync } from 'fs'
import { extname } from 'path'





const exports = {}
const modules = readdirSync(__dirname)

for (const module of modules) {
  const extension = extname(module)

  if (extension === '.js') {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    exports[module.replace(extension, '')] = require(`./${module}`)
  }
}





export default exports
