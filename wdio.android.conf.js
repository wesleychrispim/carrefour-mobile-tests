const { join } = require('path')

const config = {
  runner: 'local',
  specs: ['./src/specs/**/*.spec.js'],
  maxInstances: 1,
  logLevel: 'info',
  framework: 'mocha',
  mochaOpts: { timeout: 180000 }, // 3 min

  reporters: [
    'spec',
    ['allure', {
      outputDir: 'reports/allure-results',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false
    }]
  ],

  // Appium 2 via service (basePath '/')
  services: [['appium', { args: { basePath: '/' }, loglevel: 'warn' }]],

  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.WDIO_DEVICE || 'emulator-5554',
    'appium:udid': process.env.WDIO_UDID || 'emulator-5554',
    'appium:app': join(process.cwd(), 'app/android/NativeDemoApp.apk'),
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': 180
  }],

  afterTest: async (_test, _ctx, { passed }) => {
    if (!passed && global.browser) {
      await browser.saveScreenshot(`./reports/allure-results/FAIL_${Date.now()}.png`)
    }
  }
}

module.exports = { config }
