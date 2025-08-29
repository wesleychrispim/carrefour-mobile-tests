class DragPage {
  get tab() { return $('~Drag') }

  async open() {
    // garante voltar pra home se estiver em tela interna
    for (let i = 0; i < 3; i++) {
      if (await this.tab.isExisting()) break
      await driver.back(); await driver.pause(200)
    }
    await this.tab.waitForDisplayed({ timeout: 10000 })
    await this.tab.click()
  }

  // ---- Gestos inline (sem utils externos) ----
  async dragElementToElement(sourceEl, targetEl, hold = 150, move = 250) {
    const s = await sourceEl.getRect()
    const t = await targetEl.getRect()
    const sx = Math.floor(s.x + s.width / 2)
    const sy = Math.floor(s.y + s.height / 2)
    const tx = Math.floor(t.x + t.width / 2)
    const ty = Math.floor(t.y + t.height / 2)

    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: sx, y: sy },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: hold },
        { type: 'pointerMove', duration: move, x: tx, y: ty },
        { type: 'pointerUp', button: 0 }
      ]
    }])
    await driver.releaseActions()
  }

  async dragByCoords(x1, y1, x2, y2, hold = 150, move = 250) {
    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: x1, y: y1 },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: hold },
        { type: 'pointerMove', duration: move, x: x2, y: y2 },
        { type: 'pointerUp', button: 0 }
      ]
    }])
    await driver.releaseActions()
  }

  /**
   * Tenta identificar um par source/target por múltiplas estratégias.
   * Retorna { source, target } ou null.
   */
  async resolveSourceTarget() {
    // 1) accessibility ids comuns em builds do demo-app
    const srcAcc = await $('~drag-l1').catch(() => null)
    const tgtAcc = await $('~drop-r1').catch(() => null)
    if (srcAcc && await srcAcc.isExisting().catch(() => false) &&
        tgtAcc && await tgtAcc.isExisting().catch(() => false)) {
      return { source: srcAcc, target: tgtAcc }
    }

    // 2) por texto "Drag" / "Drop"
    const srcTxt = await $('android=new UiSelector().textContains("Drag")').catch(() => null)
    const tgtTxt = await $('android=new UiSelector().textContains("Drop")').catch(() => null)
    if (srcTxt && await srcTxt.isExisting().catch(() => false) &&
        tgtTxt && await tgtTxt.isExisting().catch(() => false)) {
      return { source: srcTxt, target: tgtTxt }
    }

    // 3) fallback estrutural: pega dois blocos clicáveis
    const blocks = await $$('//android.view.ViewGroup[.//android.view.View or .//android.widget.TextView]')
    if (blocks && blocks.length >= 2) {
      return { source: blocks[0], target: blocks[blocks.length - 1] }
    }

    return null
  }

  /**
   * Executa um drag & drop uma vez.
   * - Garante que source/target são elementos (têm getRect)
   * - Se não achar, usa fallback por coordenadas
   */
  async dragOnce() {
    const pair = await this.resolveSourceTarget()
    if (pair && pair.source && pair.target) {
      if (typeof pair.source.getRect === 'function' && typeof pair.target.getRect === 'function') {
        await this.dragElementToElement(pair.source, pair.target)
        return true
      }
    }

    // Fallback por coordenadas (30% -> 70% da largura no meio da tela)
    const { width, height } = await driver.getWindowRect()
    const y  = Math.floor(height * 0.5)
    const x1 = Math.floor(width  * 0.30)
    const x2 = Math.floor(width  * 0.70)
    await this.dragByCoords(x1, y, x2, y)
    return true
  }
}

module.exports = new DragPage()
