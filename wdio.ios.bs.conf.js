// Rodar no BrowserStack App Automate (iOS)
// Requer env vars: BROWSERSTACK_USERNAME e BROWSERSTACK_ACCESS_KEY
// E o ID do app enviado para o BS: BS_IOS_APP (e.g. bs://<hash>)
// Upload do app: curl -u "USER:KEY" -X POST "https://api-cloud.browserstack.com/app-automate/upload" -F "file=@/path/app.ipa"

const buildName = process.env.BUILD_NAME || `Mobile iOS - ${new Date().toISOString().slice(0,10)}`
const bsUser = process.env.BROWSERSTACK_USERNAME
const bsKey = process.env.BROWSERSTACK_ACCESS_KEY
const bsAppId = process.env.BS_IOS_APP // ex.: bs://abcd1234...

if (!bsUser || !bsKey) {
  console.warn('Defina BROWSERSTACK_USERNAME e BROWSERSTACK_ACCESS_KEY para rodar no iOS/BS.')
}

const config = {
  user: bsUser,
  key: bsKey,

  runner: 'local',
  specs: ['./src/specs/**/*.spec.js'], // você pode filtrar por arquivo para iOS
  maxInstances: 1,
  logLevel: 'info',
  framework: 'mocha',
  mochaOpts: { timeout: 240000 },

  services: [], // não usa appium local no BS

  reporters: [
    'spec',
    ['allure', {
      outputDir: 'reports/allure-results',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false
    }]
  ],

  hostname: 'hub.browserstack.com',
  port: 443,
  protocol: 'https',
  path: '/wd/hub',

  capabilities: [{
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': process.env.IOS_DEVICE || 'iPhone 15',
    'appium:platformVersion': process.env.IOS_VERSION || '17',
    'appium:app': bsAppId || 'bs://YOUR_APP_ID', // defina BS_IOS_APP no ambiente
    'appium:newCommandTimeout': 180,
    'bstack:options': {
      projectName: 'Carrefour Mobile',
      buildName,
      sessionName: 'E2E iOS',
      debug: true,
      networkLogs: true
    }
  }],

  afterTest: async (_test, _ctx, { passed }) => {
    if (!passed && global.browser) {
      await browser.saveScreenshot(`./reports/allure-results/FAIL_IOS_${Date.now()}.png`)
    }
  }
}

module.exports = { config }
