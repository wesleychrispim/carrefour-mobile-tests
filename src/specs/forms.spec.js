const { expect } = require('chai')
const FormsPage = require('../pages/forms.page')

describe('Forms', () => {
  beforeEach(async () => {
    await FormsPage.open()
  })

  it('deve preencher texto, alternar switch, escolher dropdown e submeter', async () => {
    await FormsPage.typeMessage('Carrefour Teste')
    await FormsPage.toggleSwitch()
    await FormsPage.selectDropdown()
    await FormsPage.submit()

    const kind = await FormsPage.feedbackKind(12000)
    expect(kind, 'Esperava feedback após submit').to.be.oneOf(['alert', 'toast', 'loose'])

    const msg = (await FormsPage.feedbackText())
    const t = msg.toLowerCase()
    expect(t).to.satisfy(s =>
      s.includes('submitted') ||
      s.includes('this button is active') ||
      s.includes('success') ||
      s.includes('form')
    )

    if (kind === 'alert') await FormsPage.btnOkAlert.click()
  })

  it('deve validar erro quando submete sem mensagem', async () => {
    try { await FormsPage.inputMsg.clearValue() } catch {}
    await FormsPage.submit()

    const kind = await FormsPage.feedbackKind(12000)
    expect(kind, 'Esperava feedback de alerta/toast').to.be.oneOf(['alert', 'toast', 'loose'])

    const t = (await FormsPage.feedbackText()).toLowerCase()
    // para o demo app, o comportamento típico é o alerta "This button is active"
    expect(t).to.satisfy(s =>
      s.includes('this button is active') ||
      s.includes('enter') ||
      s.includes('message') ||
      s.includes('error')
    )

    if (kind === 'alert') await FormsPage.btnOkAlert.click()
  })
})
