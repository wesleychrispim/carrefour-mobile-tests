const { expect } = require('chai')
const LoginPage = require('../pages/login.page')
const data = require('../data/login.json')

describe('Login', () => {
  beforeEach(async () => {
    await LoginPage.openLogin()
  })

  afterEach(async () => {
    try { if (await LoginPage.hasAlert()) await LoginPage.confirmAlert() } catch {}
  })

  it('deve logar com credenciais válidas (formato ok, senha ≥ 8) e fechar o OK', async () => {
    await LoginPage.login('demo@wdio.app', 'wdiodemo1')
    await LoginPage.waitForAlert()
    const msg = await LoginPage.alertText()
    expect(msg.toLowerCase()).to.contain('logged in')
    await LoginPage.confirmAlert()
  })

  // data-driven para negativos (email inválido, senha curta)
  data
    .filter(t => t.expect !== 'success')
    .forEach(tc => {
      it(`deve validar erro de ${tc.name}`, async () => {
        await LoginPage.login(tc.email, tc.password)

        // primeiro tenta inline; se não houver, cai pro alerta (compatibilidade)
        if (tc.expect === 'email') {
          if (await LoginPage.hasInlineEmailError()) {
            expect(await LoginPage.hasInlineEmailError()).to.equal(true)
          } else {
            await LoginPage.waitForAlert()
            const msg = await LoginPage.alertText()
            expect(msg.toLowerCase()).to.contain('valid email')
            await LoginPage.confirmAlert()
          }
        }

        if (tc.expect === 'password') {
          if (await LoginPage.hasInlinePasswordError()) {
            expect(await LoginPage.hasInlinePasswordError()).to.equal(true)
          } else {
            await LoginPage.waitForAlert()
            const msg = await LoginPage.alertText()
            expect(msg.toLowerCase()).to.contain('at least 8')
            await LoginPage.confirmAlert()
          }
        }
      })
    })
})
