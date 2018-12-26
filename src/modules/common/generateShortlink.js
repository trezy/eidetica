import Config from 'electron-store'

const config = new Config





const generateShortlink = filename => {
  const providers = config.get('providers')

  console.log('providers', providers)

  return `${providers[0].settings.url}/${filename}`
}





export { generateShortlink }
