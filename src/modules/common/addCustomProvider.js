// Module imports
import Config from 'electron-store'
import uuid from 'uuid/v4'





// Component constants
const config = new Config





const addCustomProvider = (name, settings) => {
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
      id: uuid(),
      name,
      settings: filteredSettings,
      type: 'custom',
    },
  ])
}





export { addCustomProvider }
