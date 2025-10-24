// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('SoundInterface - Interface Régisseur Son', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/sound');
    await page.waitForLoadState('networkidle');
  });

  test('should display sound interface header', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Mode Son');
    await expect(page.locator('.sound-header')).toBeVisible();
  });

  test('should load and display available matches', async ({ page }) => {
    const matchSelector = page.locator('select.form-input');
    await expect(matchSelector).toBeVisible();

    // Should have at least the placeholder option
    const options = await matchSelector.locator('option').count();
    expect(options).toBeGreaterThanOrEqual(1);
  });

  test('should display music library with filters', async ({ page }) => {
    // Check music library section
    await expect(page.getByText('Bibliothèque Musicale')).toBeVisible();

    // Check filter controls
    await expect(page.locator('input[placeholder*="Recherche"]')).toBeVisible();
    await expect(page.locator('select').first()).toBeVisible(); // Mood filter
  });

  test('should display waveform player when track is selected', async ({ page }) => {
    // Wait for music library to load
    await page.waitForTimeout(2000);

    // Click on first track in library
    const firstTrack = page.locator('.music-card').first();
    if (await firstTrack.count() > 0) {
      await firstTrack.locator('button').first().click();

      // Waveform player should appear
      await expect(page.locator('.waveform-player')).toBeVisible();
      await expect(page.locator('.waveform')).toBeVisible();
    }
  });

  test('should display music history section', async ({ page }) => {
    // Select a match first
    const matchSelector = page.locator('select.form-input');
    await matchSelector.selectOption({ index: 1 });
    await page.waitForTimeout(1000);

    // Check for history section
    const historySection = page.locator('.music-history');
    if (await historySection.count() > 0) {
      await expect(historySection).toBeVisible();
      await expect(page.getByText('Historique')).toBeVisible();
    }
  });

  test('should allow adding tracks to favorites', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Find and click star button on first track
    const firstStar = page.locator('.music-card .btn').filter({ hasText: /⭐/ }).first();
    if (await firstStar.count() > 0) {
      await firstStar.click();

      // Check favorites count increased
      const favCount = page.locator('.favorites-list h3');
      await expect(favCount).toContainText(/Favoris.*\(1\)/);
    }
  });

  test('should filter music by search query', async ({ page }) => {
    await page.waitForTimeout(2000);

    const searchInput = page.locator('input[placeholder*="Recherche"]');
    await searchInput.fill('western');
    await page.waitForTimeout(500);

    // All visible tracks should match search
    const visibleTracks = page.locator('.music-card:visible');
    const count = await visibleTracks.count();

    if (count > 0) {
      const firstTrack = visibleTracks.first();
      const text = await firstTrack.textContent();
      expect(text.toLowerCase()).toContain('western');
    }
  });

  test('should display 2-column layout with match sheet and library', async ({ page }) => {
    // Select a match
    const matchSelector = page.locator('select.form-input');
    await matchSelector.selectOption({ index: 1 });
    await page.waitForTimeout(1000);

    // Check for 2-column layout
    const layout = page.locator('.two-column-layout');
    await expect(layout).toBeVisible();

    // Check left column (match sheet + favorites)
    await expect(page.locator('.left-column')).toBeVisible();
    await expect(page.locator('.mc-sync')).toBeVisible();
    await expect(page.locator('.favorites-list')).toBeVisible();

    // Check right column (music library)
    await expect(page.locator('.right-column')).toBeVisible();
  });

  test('should have quick action buttons', async ({ page }) => {
    const quickActions = page.locator('.quick-actions');
    await expect(quickActions).toBeVisible();

    // Check for some quick action buttons
    await expect(page.getByRole('button', { name: /Applause/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Gong/i })).toBeVisible();
  });

  test('should allow clearing favorites', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Add a favorite first
    const firstStar = page.locator('.music-card .btn').filter({ hasText: /⭐/ }).first();
    if (await firstStar.count() > 0) {
      await firstStar.click();
      await page.waitForTimeout(500);

      // Click clear button
      const clearBtn = page.getByRole('button', { name: /Vider/i });
      if (await clearBtn.count() > 0) {
        await clearBtn.click();

        // Favorites should be empty
        await expect(page.locator('.favorites-list h3')).toContainText('Favoris (0)');
      }
    }
  });

  test('should refresh music history when button clicked', async ({ page }) => {
    // Select a match
    const matchSelector = page.locator('select.form-input');
    await matchSelector.selectOption({ index: 1 });
    await page.waitForTimeout(1000);

    const refreshBtn = page.locator('.music-history button').filter({ hasText: /Rafraîchir/i });
    if (await refreshBtn.count() > 0) {
      await refreshBtn.click();

      // Should show loading state briefly
      await expect(page.locator('.music-history')).toBeVisible();
    }
  });
});
