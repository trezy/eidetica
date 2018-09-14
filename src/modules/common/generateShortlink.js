import Config from 'electron-store'





const generateShortlink = filename => `${new Config().get('url')}/${filename}`





export { generateShortlink }
