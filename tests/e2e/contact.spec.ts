import { test, expect } from '@playwright/test'

test.describe('Seção de contato', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.locator('#contato').scrollIntoViewIfNeeded()
  })

  test('botões de contato apontam para os canais corretos', async ({ page }) => {
    const actions = page.locator('#contato .contact-actions')
    await expect(actions.getByRole('link', { name: /matheeus\.machado@gmail\.com/ })).toHaveAttribute(
      'href',
      'mailto:matheeus.machado@gmail.com',
    )
    await expect(actions.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/machadomatheus1',
    )
    await expect(actions.getByRole('link', { name: /99607-6901/ })).toHaveAttribute('href', /^tel:/)
  })

  test('link do LinkedIn abre em nova aba com rel seguro', async ({ page }) => {
    const link = page.locator('#contato .contact-actions').getByRole('link', { name: /LinkedIn/ })
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noopener/)
  })

  test('barra de sugestão de disponibilidade tem CTA de e-mail', async ({ page }) => {
    const suggestion = page.locator('#contato .suggestion')
    await expect(suggestion.getByRole('link', { name: 'Enviar e-mail' })).toHaveAttribute(
      'href',
      'mailto:matheeus.machado@gmail.com',
    )
  })

  test('copiar e-mail para a área de transferência dá feedback visual', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'Permissão de clipboard só é confiável no Chromium')
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    const copyButton = page.getByRole('button', { name: /matheeus\.machado@gmail\.com/ })
    await copyButton.click()
    await expect(page.getByRole('button', { name: 'e-mail copiado!' })).toBeVisible()

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardText).toBe('matheeus.machado@gmail.com')
  })
})
