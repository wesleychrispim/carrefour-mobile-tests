class FormsPage {
  // Bottom bar
  get tab() { return $('~Forms') }

  // Campo "Type something" (seu APK não tem ~input-text)
  get inputMsg() { return $('//android.widget.EditText[1]') }

  // Switch
  get switchCtrl() { return $('//android.widget.Switch[1]') }

  // Dropdown (tentamos por content-desc e por texto "Select an item")
  get dropdownByAcc() { return $('~Dropdown') }
  get dropdownByText() { return $('android=new UiSelector().textContains("Select an item")') }

  // Opção do dropdown (ajuste se precisar)
  get optionAwesomeByText() { return $('android=new UiSelector().textContains("awesome")') }
  get optionWdioByText() { return $('android=new UiSelector().textContains("webdriver.io")') }

  // Botões
  get btnActive() { return $('~button-Active') }
  get btnInactive() { return $('~button-Inactive') }

  // Alerta / Toast
  get alertMsg() { return $('id=android:id/message') }          // *** use ID, não CSS
  get btnOkAlert() { return $('id=android:id/button1') }
  get toast() { return $('//android.widget.Toast') }

  async open() {
    // garante estar na tela com a bottom bar (volta se necessário)
    for (let i = 0; i < 3; i++) {
      if (await this.tab.isExisting()) break
      await driver.back()
      await driver.pause(200)
    }
    await this.tab.waitForDisplayed({ timeout: 10000 })
    await this.tab.click()
  }

  async typeMessage(texto) {
    await this.inputMsg.waitForDisplayed({ timeout: 10000 })
    await this.inputMsg.setValue(texto)
    try { await driver.hideKeyboard() } catch {}
  }

  async toggleSwitch() {
    await this.switchCtrl.waitForDisplayed({ timeout: 10000 })
    await this.switchCtrl.click()
  }

  async openDropdown() {
    if (await this.dropdownByAcc.isExisting()) {
      await this.dropdownByAcc.click()
      return
    }
    if (await this.dropdownByText.isExisting()) {
      await this.dropdownByText.click()
      return
    }
    // fallback: tenta um ícone de seta ao lado do texto
    const arrow = await $('//android.widget.ImageView[contains(@content-desc,"Dropdown") or contains(@resource-id,"dropdown")]')
    if (await arrow.isExisting()) {
      await arrow.click()
      return
    }
    throw new Error('Dropdown não encontrado')
  }

  async pickAwesome() {
    if (await this.optionAwesomeByText.isExisting()) {
      await this.optionAwesomeByText.click()
      return
    }
    if (await this.optionWdioByText.isExisting()) {
      await this.optionWdioByText.click()
      return
    }
    // em alguns builds a lista abre como diálogo com um RecyclerView
    const any = await $('//android.widget.CheckedTextView[2]')
    if (await any.isExisting()) {
      await any.click()
      return
    }
    throw new Error('Opção do dropdown não encontrada')
  }

  async selectDropdown() {
    await this.openDropdown()
    await this.pickAwesome()
  }

  async submit() {
    if (await this.btnActive.isExisting()) {
      await this.btnActive.click()
      return
    }
    if (await this.btnInactive.isExisting()) {
      await this.btnInactive.click()
      return
    }
    // fallback por texto
    const anyBtn = await $('android=new UiSelector().textContains("Active").className("android.widget.Button")')
    await anyBtn.click()
  }

  /**
   * Aguarda feedback após submit (alert OU toast OU texto solto do alerta)
   */
  async feedbackKind(timeout = 12000) {
    const start = Date.now()
    while (Date.now() - start < timeout) {
      if (await this.alertMsg.isExisting().catch(() => false)) return 'alert'
      if (await this.toast.isExisting().catch(() => false)) return 'toast'
      // alguns builds mostram o texto do alerta sem id típico
      const loose = await $('android=new UiSelector().textContains("This button is active")')
      if (await loose.isExisting().catch(() => false)) return 'loose'
      await driver.pause(200)
    }
    return null
  }

  async feedbackText() {
    if (await this.alertMsg.isExisting().catch(() => false)) {
      return (await this.alertMsg.getText()).toLowerCase()
    }
    if (await this.toast.isExisting().catch(() => false)) {
      return (await this.toast.getText()).toLowerCase()
    }
    const loose = await $('android=new UiSelector().textContains("This button is active")')
    if (await loose.isExisting().catch(() => false)) {
      return (await loose.getText()).toLowerCase()
    }
    return ''
  }
}

module.exports = new FormsPage()
