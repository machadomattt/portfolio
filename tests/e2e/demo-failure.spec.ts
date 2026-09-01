import { test, expect } from '@playwright/test'

// This test fails on purpose. Real dashboards don't only show green — the
// "Testes" section on the site should also demonstrate what a genuine
// failure (with its error) and a genuine skip (with its reason) look like,
// not just a suspiciously perfect 100%. Do not "fix" this test; that's not
// a bug, it's the point of the file.
test.describe('Demonstração de estados', () => {
  test('demonstração proposital: este teste falha para mostrar o estado "falhou" na suíte ao vivo', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Este texto não existe de propósito, para provar que a suíte relata falhas reais')).toBeVisible()
  })
})
