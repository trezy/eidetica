import Config from 'electron-config'





const generateShortlink = filename => `${new Config().get('url')}/${filename}`





export { generateShortlink }
