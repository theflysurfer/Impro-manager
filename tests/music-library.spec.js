// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Bibliothèque Musicale', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/music');
  });

  test('devrait afficher la page de bibliothèque musicale', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Bibliothèque Musicale');
  });

  test('devrait afficher les statistiques de pistes', async ({ page }) => {
    const stats = page.locator('.library-stats');
    await expect(stats).toBeVisible();
    await expect(stats).toContainText('pistes');
  });

  test('devrait afficher la grille de musiques', async ({ page }) => {
    const grid = page.locator('.music-grid');
    await expect(grid).toBeVisible();

    // Attendre que les cartes de musique se chargent
    await page.waitForSelector('.music-card', { timeout: 10000 });

    const cards = page.locator('.music-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('devrait afficher les filtres', async ({ page }) => {
    const filters = page.locator('.music-filters');
    await expect(filters).toBeVisible();

    // Vérifier que le champ de recherche existe
    const searchInput = page.locator('input[placeholder*="Titre"]');
    await expect(searchInput).toBeVisible();
  });

  test('devrait filtrer par recherche texte', async ({ page }) => {
    await page.waitForSelector('.music-card', { timeout: 10000 });

    const searchInput = page.locator('input[placeholder*="Titre"]');
    await searchInput.fill('Queen');

    // Attendre que le debounce se termine (300ms)
    await page.waitForTimeout(500);

    // Vérifier qu'il y a des résultats filtrés
    const cards = page.locator('.music-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('devrait afficher le lecteur audio', async ({ page }) => {
    const player = page.locator('.audio-player');
    await expect(player).toBeVisible();
  });

  test('devrait avoir des boutons de contrôle audio', async ({ page }) => {
    // Boutons play, stop, etc.
    const playButton = page.locator('.btn-control').first();
    await expect(playButton).toBeVisible();
  });

  test('devrait pouvoir cliquer sur une carte de musique', async ({ page }) => {
    await page.waitForSelector('.music-card', { timeout: 10000 });

    const firstCard = page.locator('.music-card').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // Le lecteur devrait être actif
    const player = page.locator('.audio-player.player-active');
    await expect(player).toBeVisible({ timeout: 5000 });
  });

  test('devrait avoir une pagination si nécessaire', async ({ page }) => {
    await page.waitForSelector('.music-card', { timeout: 10000 });

    // Si plus de 24 pistes, pagination devrait être visible
    const pagination = page.locator('.pagination');
    const isVisible = await pagination.isVisible().catch(() => false);

    if (isVisible) {
      const pageInfo = page.locator('.page-info');
      await expect(pageInfo).toContainText('Page');
    }
  });

  test('devrait être responsive', async ({ page }) => {
    // Tester sur mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    const grid = page.locator('.music-grid');
    await expect(grid).toBeVisible();
  });
});
