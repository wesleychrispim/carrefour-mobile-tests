// wdio.bs.ios.conf.js
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
  specs: ['./src/specs/**/*.spec.js'],
  maxInstances: 1,
  logLevel: 'info',
  framework: 'mocha',
  mochaOpts: { timeout: 240000 },

  services: [], // no BS não usa appium local

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
    'appium:app': bsAppId || 'bs://YOUR_APP_ID',
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
