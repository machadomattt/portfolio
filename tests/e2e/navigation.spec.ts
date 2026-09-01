import { test, expect, devices } from '@playwright/test'

test.describe('Navegação desktop (sidebar)', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Sidebar fica oculta em drawer no viewport mobile')
  })

  test('clicar em um item da sidebar rola até a seção correspondente', async ({ page }) => {
    await page.goto('/')
    await page.locator('.sidebar-nav a[href="#projetos"]').click()
    await page.waitForTimeout(400)
    await expect(page.locator('#projetos')).toBeInViewport()
  })

  test('item ativo da sidebar muda conforme o scroll', async ({ page }) => {
    await page.goto('/')
    await page.locator('#skills').scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
    await expect(page.locator('.nav-item.active')).toHaveAttribute('href', '#skills')
  })

  test('CTA "Ver evidências" do topo leva até a seção de projetos', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Ver evidências/ }).click()
    await page.waitForTimeout(400)
    await expect(page.locator('#projetos')).toBeInViewport()
  })
})

const { defaultBrowserType: _unused, ...pixel7 } = devices['Pixel 7']

test.describe('Navegação mobile (drawer)', () => {
  test.use(pixel7)

  test('drawer abre e fecha ao clicar no botão hambúrguer', async ({ page }) => {
    await page.goto('/')
    const sidebar = page.locator('.sidebar')
    const burger = page.getByRole('button', { name: 'Abrir menu' })

    await expect(sidebar).not.toHaveClass(/open/)
    await burger.click()
    await expect(sidebar).toHaveClass(/open/)
    await expect(sidebar.locator('a[href="#contato"]')).toBeVisible()

    await burger.click()
    await expect(sidebar).not.toHaveClass(/open/)
  })

  test('selecionar um item no drawer fecha o menu', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await page.locator('.sidebar a[href="#contato"]').click()
    await expect(page.locator('.sidebar')).not.toHaveClass(/open/)
  })

  test('não há overflow horizontal em viewport mobile', async ({ page }) => {
    await page.goto('/')
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(hasOverflow).toBe(false)
  })
})
