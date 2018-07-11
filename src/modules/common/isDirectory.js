import { readdirSync } from 'fs'





const isDirectory = (path) => {
  try {
    readdirSync(path)
    return true
  } catch (error) {
    return false
  }
}





export default isDirectory
