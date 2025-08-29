class LoginPage {
  // Navegação
  get tabLogin() { return $('~Login') }

  // Login
  get inputEmail() { return $('~input-email') }
  get inputPassword() { return $('~input-password') }
  get btnLogin() { return $('~button-LOGIN') }

  // Alert
  get alertTitle() { return $('id=android:id/alertTitle') }
  get alertMessage() { return $('id=android:id/message') }
  get alertOk() { return $('id=android:id/button1') }

  // Inline errors
  get inlineEmailError() {
    return $('android=new UiSelector().textContains("valid email address")')
  }
  get inlinePasswordError() {
    return $('android=new UiSelector().textContains("at least 8")')
  }

  // Sign up
  get tabSignup() { return $('android=new UiSelector().textContains("Sign up")') }
  get suInputName() { return $('~input-name') }
  get suInputEmail() { return $('~input-email') }
  get suInputPassword() { return $('~input-password') }
  get suBtnSignup() { return $('~button-SIGN UP') }
  get suInlineEmailError() { return $('android=new UiSelector().textContains("valid email")') }
  get suInlinePasswordError() { return $('android=new UiSelector().textContains("at least 8")') }

  async openLogin() {
    await this.tabLogin.waitForDisplayed({ timeout: 10000 })
    await this.tabLogin.click()
    await this.inputEmail.waitForDisplayed({ timeout: 10000 })
  }

  async login(email, password) {
    await this.inputEmail.setValue(email)
    await this.inputPassword.setValue(password)
    await this.btnLogin.click()
  }

  async waitForAlert() {
    await this.alertMessage.waitForDisplayed({ timeout: 10000 })
  }
  async hasAlert() {
    try { return await this.alertMessage.waitForDisplayed({ timeout: 2000 }) }
    catch { return false }
  }
  async alertText() {
    return (await this.alertMessage.getText()).trim()
  }
  async confirmAlert() {
    if (await this.alertOk.isDisplayed()) {
      await this.alertOk.click()
    }
  }

  async hasInlineEmailError() {
    try { return await this.inlineEmailError.waitForDisplayed({ timeout: 2000 }) }
    catch { return false }
  }
  async hasInlinePasswordError() {
    try { return await this.inlinePasswordError.waitForDisplayed({ timeout: 2000 }) }
    catch { return false }
  }

  // SIGN UP
  async openSignup() {
    await this.openLogin()
    await this.tabSignup.waitForDisplayed({ timeout: 10000 })
    await this.tabSignup.click()
  }

  async signup(name, email, password) {
    const edits = await $$('android.widget.EditText') // fallback
    if (await this.suInputName.isExisting()) await this.suInputName.setValue(name)
    else if (edits[0]) await edits[0].setValue(name)

    if (await this.suInputEmail.isExisting()) await this.suInputEmail.setValue(email)
    else if (edits[1]) await edits[1].setValue(email)

    if (await this.suInputPassword.isExisting()) await this.suInputPassword.setValue(password)
    else if (edits[2]) await edits[2].setValue(password)

    if (await this.suBtnSignup.isExisting()) await this.suBtnSignup.click()
    else await $('android=new UiSelector().textContains("SIGN UP")').click()
  }
}
module.exports = new LoginPage()
