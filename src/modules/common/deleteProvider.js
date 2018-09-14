// Module imports
import Config from 'electron-store'





// Component constants
const config = new Config





const deleteProvider = id => {
  const providers = config.get('providers')

  config.set('providers', providers.filter(provider => provider.id !== id))
}





export { deleteProvider }
