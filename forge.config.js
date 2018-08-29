module.exports = {
  make_targets: {
    win32: ['squirrel'],
    darwin: ['zip'],
    linux: [
      'deb',
      'rpm',
    ],
  },
  publish_targets: {
    win32: ['github'],
    darwin: ['github'],
    linux: ['github'],
  },
  electronPackagerConfig: {
    appBundleId: 'eidetica',
    appCategoryType: 'public.app-category.productivity',
    appCopyright: 'Copyright © 2018 Trezy.com',
    dir: './src',
    icon: './src/assets/icon',
    osxSign: true,
    packageManager: 'yarn',
  },
  electronWinstallerConfig: { name: 'blep' },
  electronInstallerDebian: {},
  electronInstallerRedhat: {},
  github_repository: {
    owner: 'trezy',
    name: 'eidetica',
  },
  windowsStoreConfig: {
    packageName: '',
    name: 'blep',
  },
}
