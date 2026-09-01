import { test, expect } from '@playwright/test'

// The detailed results table (filter/search/pagination) only appears after a
// live run completes — populated from that run's own results, not from the
// checked-in snapshot. Our standard test environment deliberately has no
// backend (to avoid the live runner recursively re-triggering this very
// suite — see the skip guard below), so that table can never be reached
// here. Its filter/search/pagination behavior was verified manually against
// a running backend, the same way the console's live success path was.
test.describe('Seção "A suíte que testa este site"', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.locator('#testes').scrollIntoViewIfNeeded()
  })

  test('mostra 4 stat tiles com o resumo da última execução', async ({ page }) => {
    await expect(page.locator('#testes .stat-tile')).toHaveCount(4)
    await expect(page.locator('#testes').getByText('Taxa de sucesso')).toBeVisible()
  })

  test('painel de resultados detalhados fica oculto até uma execução ao vivo terminar', async ({ page }) => {
    await expect(page.locator('#testes .test-panel')).toHaveCount(0)
    await expect(page.locator('#testes .test-panel-placeholder')).toContainText('Rode os testes ao vivo')
  })

  test('console de execução ao vivo degrada normalmente sem o backend', async ({ page }) => {
    // Quando o backend de execução ao vivo (server/index.mjs) dispara esta
    // própria suíte contra si mesmo, clicar neste botão aqui dentro criaria
    // uma execução recursiva de verdade. PLAYWRIGHT_BASE_URL só é setado
    // nesse cenário (veja playwright.config.ts), então pulamos este teste
    // ali — o caminho de sucesso ao vivo já foi verificado manualmente.
    test.skip(!!process.env.PLAYWRIGHT_BASE_URL, 'evita recursão ao rodar contra a instância ao vivo')

    const playBtn = page.locator('#testes .console-btn', { hasText: 'Rodar testes ao vivo' })
    await expect(page.locator('#testes .console-hint')).toContainText('ao vivo')

    await playBtn.click()

    await expect(page.locator('#testes .console-btn', { hasText: 'Tentar novamente' })).toBeVisible()
    await expect(page.locator('#testes .console-error')).toContainText('execução ao vivo')
    await expect(page.locator('#testes .console-dot')).toHaveClass(/error/)

    // Erro de conexão não deve, por si só, revelar a tabela de resultados.
    await expect(page.locator('#testes .test-panel')).toHaveCount(0)
  })
})
