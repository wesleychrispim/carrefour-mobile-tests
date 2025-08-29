const { expect } = require('chai')
const SwipePage = require('../pages/swipe.page')

describe('Swipe - Horizontal', () => {
  it('deve varrer o carrossel horizontal até o fim e concluir como sucesso', async () => {
    await SwipePage.open()

    const ok = await SwipePage.horizontalToEnd({ hMax: 16, pause: 500 })
    await driver.saveScreenshot(`reports/allure-results/swipe_h_${Date.now()}.png`)

    expect(ok, 'Não concluiu a varredura horizontal do carrossel').to.be.true
  })
})
