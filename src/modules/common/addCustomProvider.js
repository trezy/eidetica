// Module imports
import Config from 'electron-store'
import uuid from 'uuid/v4'





// Component constants
const config = new Config





const addCustomProvider = settings => {
  const providers = config.get('providers')
  const filteredSettings = {}

  for (const [setting, value] of Object.entries(settings)) {
    if (value) {
      filteredSettings[setting] = value
    }
  }

  config.set('providers', [
    ...providers,
    {
      settings: filteredSettings,
      id: uuid(),
      type: 'custom',
    },
  ])
}





export { addCustomProvider }
