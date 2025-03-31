import { test, expect } from '@playwright/test';

test.describe('Calculatrice E2E Testes', () => {
  test.beforeEach(async ({ page }) => {
    // Aller à l'URL de base avant chaque test
    await page.goto('/');

    await page.waitForSelector('[data-testid="display"]', { timeout: 10000 });

  });

  test('Vérifier que les élements principaux sont visibles', async ({ page }) => {
    await expect(page.locator('[data-testid="display"]')).toBeVisible();
    for (let i = 0; i <= 9; i++) {
      await expect(page.locator(`[data-testid="button-${i}"]`)).toBeVisible();
    }
    for (const op of ['+', '-', '*', '/']) {
      await expect(page.locator(`[data-testid="button-${op}"]`)).toBeVisible();
    }
  });

  test('Teste de base d\'addition de 2 + 3 = 5', async ({ page }) => {
    await page.click('[data-testid="button-2"]');
    await page.click('[data-testid="button-+"]');
    await page.click('[data-testid="button-3"]');
    await page.click('[data-testid="button-="]');
    
    const display = await page.locator('[data-testid="display"]');
    await expect(display).toBeVisible('5');
  });

  test('Test de soustraction : 8 - 3 = 5', async ({ page }) => {
    await page.click('[data-testid="button-8"]');
    await page.click('[data-testid="button--"]');
    await page.click('[data-testid="button-3"]');
    await page.click('[data-testid="button-="]');
    
    const display = await page.locator('[data-testid="display"]');
    await expect(display).toHaveText('5');
  });

  test('Test de multiplication : 4 * 5 = 20', async ({ page }) => {
    
    await page.click('[data-testid="button-4"]');
    await page.click('[data-testid="button-*"]');
    await page.click('[data-testid="button-5"]');
    await page.click('[data-testid="button-="]');
    
    const display = await page.locator('[data-testid="display"]');
    await expect(display).toHaveText('20');
  });

  test('Test de division : 15 / 3 = 5', async ({ page }) => {
    
    await page.click('[data-testid="button-1"]');
    await page.click('[data-testid="button-5"]');
    await page.click('[data-testid="button-/"]');
    await page.click('[data-testid="button-3"]');
    await page.click('[data-testid="button-="]');
    
    const display = await page.locator('[data-testid="display"]');
    await expect(display).toHaveText('5');
  });

  test('Test du bouton Clear', async ({ page }) => {

    await page.click('[data-testid="button-1"]');
    await page.click('[data-testid="button-2"]');
    await page.click('[data-testid="button-3"]');
    await page.click('[data-testid="button-C"]');
    
    const display = await page.locator('[data-testid="display"]');
    await expect(display).toHaveText('0');
  });

  test('Test de l\'historique', async ({ page }) => {
    
    await page.click('[data-testid="button-2"]');
    await page.click('[data-testid="button-+"]');
    await page.click('[data-testid="button-3"]');
    await page.click('[data-testid="button-="]');
    
    // Vérifier que l'opération apparaît dans l'historique
    const historyItem = await page.locator('.MuiPaper-root').nth(1); // Le premier est l'affichage
    await expect(historyItem).toContainText('2 + 3 = 5');
  });

  test('Effectuer une opération', async ({ page }) => {

    await page.click('[data-testid="button-2"]');
    await page.click('[data-testid="button-+"]');
    await page.click('[data-testid="button-3"]');
    await page.click('[data-testid="button-="]');
    
    await page.waitForTimeout(500);
    await page.click('[data-testid="clear-history"]');
    await page.waitForTimeout(500);
    
    
    const historyItems = await page.locator('.history-item').all();
    expect(historyItems.length).toBe(0);
  });

  test('Test d\'opérations multiples : 2 + 3 * 4 = 20', async ({ page }) => {
    // Test d'opérations multiples : 2 + 3 * 4 = 20
    await page.click('[data-testid="button-2"]');
    await page.click('[data-testid="button-+"]');
    await page.click('[data-testid="button-3"]');
    await page.click('[data-testid="button-="]'); 
    await page.click('[data-testid="button-*"]');
    await page.click('[data-testid="button-4"]');
    await page.click('[data-testid="button-="]'); 
    
    const display = await page.locator('[data-testid="display"]');
    await expect(display).toHaveText('20');
  });

  test('Test de division par zéro', async ({ page }) => {
    await page.click('[data-testid="button-5"]');
    await page.click('[data-testid="button-/"]');
    await page.click('[data-testid="button-0"]');
    await page.click('[data-testid="button-="]');
    
    const display = await page.locator('[data-testid="display"]');
    await expect(display).toHaveText('Error');
  });

  test('Test effacer l’historique', async ({ page }) => {
    await page.click('[data-testid="button-2"]');
    await page.click('[data-testid="button-+"]');
    await page.click('[data-testid="button-3"]');
    await page.click('[data-testid="button-="]');
    
    await page.waitForTimeout(500);
    await page.click('[data-testid="clear-history"]');
    await page.waitForTimeout(500);
    
    const historyItems = await page.locator('.history-item').all();
    expect(historyItems.length).toBe(0);
  });
});
