const { expect } = require('chai')
const DragPage = require('../pages/drag.page')

describe('Drag and Drop', () => {
  beforeEach(async () => {
    await DragPage.open()
  })

  it('deve arrastar um item para a área destino com sucesso', async () => {
    const ok = await DragPage.dragOnce()
    expect(ok, 'Não foi possível executar o gesto de drag').to.be.true
    // Se o seu APK exibir alguma confirmação, me diga o seletor/texto e eu reforço a asserção.
  })
})
