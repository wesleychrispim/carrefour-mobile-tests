// src/specs/swipe.vertical.spec.js
const { expect } = require('chai')
const SwipePage = require('../pages/swipe.page')

describe('Swipe - Vertical', () => {
  before(async () => {
    // Se estiver usando o app demo, ativa; ajuste o package se for outro
    try { await driver.activateApp('com.wdiodemoapp') } catch {}
    // Garante contexto nativo
    try { await driver.switchContext('NATIVE_APP') } catch {}
    await SwipePage.open()
  })

  it('deve rolar verticalmente até encontrar "You found me"', async () => {
    let found = await SwipePage.findVertical({
      vMax: 10,        // swipes "contrário" (dedo p/ baixo) dentro do container
      vFallback: 4,    // empurrões curtos via UiScrollable
      pause: 350
    })

    // Retry leve se não encontrou de primeira
    if (!found) {
      await driver.pause(400)
      found = await SwipePage.findVertical({ vMax: 6, vFallback: 2, pause: 300 })
    }

    await driver.saveScreenshot(`reports/allure-results/swipe_vertical_${Date.now()}.png`)
    expect(found, 'Não encontrou "You found me" após rolar verticalmente').to.be.true
  })
})
