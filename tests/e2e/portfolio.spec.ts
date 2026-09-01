import { test, expect } from '@playwright/test'

test.describe('Página principal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('carrega com título e metadados corretos', async ({ page }) => {
    await expect(page).toHaveTitle(/Matheus Machado/)
  })

  test('visão geral exibe nome, cargo e stats', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Matheus Machado')
    await expect(page.getByText('QA Pleno | Automação de Testes | Desenvolvimento e CI/CD')).toBeVisible()
    await expect(page.locator('#top .stat-tile')).toHaveCount(4)
  })

  test('todas as seções principais estão presentes', async ({ page }) => {
    const sectionIds = ['top', 'experiencia', 'projetos', 'skills', 'testes', 'contato']
    for (const id of sectionIds) {
      await expect(page.locator(`#${id}`)).toBeAttached()
    }
  })

  test('histórico de progressão mostra as 4 etapas de carreira', async ({ page }) => {
    const stages = page.locator('.stage-card')
    await expect(stages).toHaveCount(4)
    await expect(stages.last()).toHaveClass(/current/)
    await expect(stages.last()).toContainText('Pleno')
  })

  test('experiência atual lista as responsabilidades da Pedbot', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Pedbot' })).toBeVisible()
    await expect(page.locator('.run-log li')).toHaveCount(6)
  })

  test('formação acadêmica aparece dentro da trajetória, concluída', async ({ page }) => {
    const experiencia = page.locator('#experiencia')
    await expect(experiencia.getByText('Universidade de Marília - UNIMAR')).toBeVisible()
    await expect(experiencia.getByText('concluído', { exact: true })).toBeVisible()
  })

  test('exibe os 3 projetos técnicos em destaque', async ({ page }) => {
    const cards = page.locator('.project-card')
    await expect(cards).toHaveCount(3)
    await expect(cards.nth(0)).toContainText('CI Failure Intelligence')
    await expect(cards.nth(1)).toContainText('Alert Data Integrity')
    await expect(cards.nth(2)).toContainText('Automated Tests')
    await expect(cards.first().getByText('passou')).toBeVisible()
  })

  test('exibe os 4 grupos de competências técnicas', async ({ page }) => {
    const groups = page.locator('.skill-card')
    await expect(groups).toHaveCount(4)
    await expect(groups.filter({ hasText: 'QA e Testes' }).getByText('Playwright')).toBeVisible()
    await expect(groups.filter({ hasText: 'Desenvolvimento' }).getByText('TypeScript')).toBeVisible()
    await expect(groups.filter({ hasText: 'Infraestrutura e Dados' }).getByText('Docker')).toBeVisible()
    await expect(groups.filter({ hasText: 'IA Aplicada' }).getByText('Claude Code')).toBeVisible()
  })
})
