const { expect } = require('chai')
const WebviewPage = require('../pages/webview.page')

describe('Navegação - Webview', () => {
  it('deve abrir a aba Webview e exibir conteúdo', async () => {
    await WebviewPage.open()
    expect(await WebviewPage.header.waitForDisplayed({ timeout: 10000 })).to.be.true
  })
})
