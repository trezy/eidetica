// Module imports
import Config from 'electron-store'





// Component constants
const config = new Config





const updateCustomProvider = (id, settings) => {
  const providers = config.get('providers')
  const providerIndex = providers.findIndex(provider => provider.id === id)
  const provider = providers[providerIndex]

  const filteredSettings = {}

  for (const [setting, value] of Object.entries(settings)) {
    if (value) {
      filteredSettings[setting] = value
    }
  }

  provider.settings = {
    ...provider.settings,
    ...filteredSettings,
  }

  config.set('providers', providers)
}





export { updateCustomProvider }
