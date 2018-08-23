import path from 'path'

import { isDevelopmentMode } from './'





const getAssetPath = () => {
  if (isDevelopmentMode()) {
    return path.resolve(__dirname, '..', '..', 'assets')
  }

  return path.resolve(process.resourcesPath, 'app', 'src', 'assets')
}





export { getAssetPath }
