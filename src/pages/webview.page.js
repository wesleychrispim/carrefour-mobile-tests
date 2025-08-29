class WebviewPage {
  get tabWebview() { return $('~Webview') }
  get header() { return $('android=new UiSelector().textContains("WebdriverIO")') }

  async open() {
    await this.tabWebview.waitForDisplayed({ timeout: 10000 })
    await this.tabWebview.click()
  }
}
module.exports = new WebviewPage()
