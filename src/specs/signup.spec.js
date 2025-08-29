import { expect } from 'chai'

describe('Sign up', () => {

  beforeEach(async () => {
    // Abre a tela Login / Sign up
    const loginTab = await $('~Login')
    await loginTab.click()

    // Abre a aba Sign up
    const signupTab = await $('~button-sign-up-container')
    await signupTab.click()
  })

  it('deve cadastrar com dados válidos e fechar o OK', async () => {
    const email = await $('~input-email')
    const password = await $('~input-password')
    const confirmPassword = await $('~input-repeat-password')
    const btnCadastrar = await $('~button-SIGN UP')

    await email.setValue('novo@wdio.app')
    await password.setValue('12345678')
    await confirmPassword.setValue('12345678')
    await btnCadastrar.click()

    // Aguarda alerta de sucesso
    const alertMsg = await $('id=android:id/message')
    await alertMsg.waitForDisplayed({ timeout: 10000 })

    expect(await alertMsg.getText()).to.contain('You successfully signed up!')

    const okBtn = await $('id=android:id/button1')
    await okBtn.click()
  })

  it('deve exibir validações com e-mail inválido e/ou senha curta', async () => {
    const email = await $('~input-email')
    const password = await $('~input-password')
    const confirmPassword = await $('~input-repeat-password')
    const btnCadastrar = await $('~button-SIGN UP')

    await email.setValue('demo') // inválido
    await password.setValue('123') // curto
    await confirmPassword.setValue('123')
    await btnCadastrar.click()

    // Verifica mensagens inline
    const emailError = await $('//*[@text="Please enter a valid email address"]')
    const passError = await $('//*[@text="Please enter at least 8 characters"]')

    expect(await emailError.isDisplayed()).to.be.true
    expect(await passError.isDisplayed()).to.be.true
  })
})
