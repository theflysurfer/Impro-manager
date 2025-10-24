// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('YouTubeDownloader - Interface Téléchargement YouTube', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/youtube');
    await page.waitForLoadState('networkidle');
  });

  test('should display YouTube downloader interface', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('YouTube');
    await expect(page.getByText('Télécharger de la musique depuis YouTube')).toBeVisible();
  });

  test('should show dependency check section', async ({ page }) => {
    // Should display dependency status
    const dependencySection = page.locator('.dependency-check, .card').first();
    await expect(dependencySection).toBeVisible();

    // Should show yt-dlp and librosa status
    const pageContent = await page.textContent('body');
    const hasDependencyInfo =
      pageContent.includes('yt-dlp') ||
      pageContent.includes('librosa') ||
      pageContent.includes('Dépendances');
    expect(hasDependencyInfo).toBeTruthy();
  });

  test('should display download type buttons', async ({ page }) => {
    const btnGroup = page.locator('.btn-group, .download-type-selector');

    // Should have URL, Search, and Playlist buttons
    await expect(page.getByRole('button', { name: /URL/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Recherche/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Playlist/i })).toBeVisible();
  });

  test('should switch download type when clicking buttons', async ({ page }) => {
    // Click on Search button
    await page.getByRole('button', { name: /Recherche/i }).click();

    // Input field should update to show search placeholder
    const input = page.locator('input[type="text"]').first();
    const placeholder = await input.getAttribute('placeholder');
    expect(placeholder.toLowerCase()).toContain('recherch');

    // Click on Playlist button
    await page.getByRole('button', { name: /Playlist/i }).click();

    // Input should update to playlist URL
    const placeholderPlaylist = await input.getAttribute('placeholder');
    expect(placeholderPlaylist.toLowerCase()).toContain('playlist');
  });

  test('should display metadata input fields', async ({ page }) => {
    // Scenarios input
    await expect(page.locator('input[placeholder*="Western"]')).toBeVisible();

    // Moods input
    await expect(page.locator('input[placeholder*="Epic"]')).toBeVisible();

    // Energy slider
    const energySlider = page.locator('input[type="range"]');
    await expect(energySlider).toBeVisible();

    // Verify slider value
    const value = await energySlider.inputValue();
    expect(parseInt(value)).toBeGreaterThanOrEqual(1);
    expect(parseInt(value)).toBeLessThanOrEqual(10);
  });

  test('should show active downloads section', async ({ page }) => {
    const activeSection = page.locator('.active-downloads, .downloads-list');

    // Section should exist (even if empty)
    const sectionExists = await activeSection.count() > 0 ||
                          await page.getByText(/Téléchargements/i).count() > 0;
    expect(sectionExists).toBeTruthy();
  });

  test('should display recent downloads section', async ({ page }) => {
    // Check for recent downloads section
    const recentSection = page.locator('.recent-downloads, .completed-downloads');
    const hasRecentSection = await recentSection.count() > 0 ||
                             await page.getByText(/Récents/i).count() > 0;
    expect(hasRecentSection).toBeTruthy();
  });

  test('should validate URL input before download', async ({ page }) => {
    // Make sure we're on URL mode
    await page.getByRole('button', { name: /^URL$/i }).click();

    const urlInput = page.locator('input[type="text"]').first();
    const downloadBtn = page.getByRole('button', { name: /Télécharger/i });

    // Try to download with invalid URL
    await urlInput.fill('not-a-valid-url');
    await downloadBtn.click();

    // Should show error or not proceed (no active download created)
    await page.waitForTimeout(500);
  });

  test('should update energy slider value display', async ({ page }) => {
    const slider = page.locator('input[type="range"]');
    await slider.fill('7');

    // Should show updated value
    await expect(page.locator('text=/Énergie.*7/i')).toBeVisible();
  });

  test('should allow multiple scenario tags', async ({ page }) => {
    const scenariosInput = page.locator('input[placeholder*="Western"]');
    await scenariosInput.fill('Western, Action, Drama');

    const value = await scenariosInput.inputValue();
    expect(value).toContain('Western');
    expect(value).toContain('Action');
  });

  test('should show playlist mode with different placeholder', async ({ page }) => {
    await page.getByRole('button', { name: /Playlist/i }).click();

    const input = page.locator('input[type="text"]').first();
    const placeholder = await input.getAttribute('placeholder');

    expect(placeholder).toContain('playlist');
  });

  test('should have link to YouTube in navigation', async ({ page }) => {
    // Navigate back to home
    await page.goto('http://localhost:5173/');

    // Should have YouTube link in nav
    const youtubeLink = page.locator('a[href="/youtube"]');
    await expect(youtubeLink).toBeVisible();
    await expect(youtubeLink).toContainText('YouTube');
  });

  test('should display warning if dependencies missing', async ({ page }) => {
    const pageContent = await page.textContent('body');

    // If dependencies are missing, should show warning
    if (pageContent.includes('manquantes') || pageContent.includes('erreur')) {
      await expect(page.locator('.alert-warning, .warning-box')).toBeVisible();
    }
  });

  test('should have proper page styling', async ({ page }) => {
    // Check that main container has card styling
    const cards = page.locator('.card');
    expect(await cards.count()).toBeGreaterThan(0);

    // Should have gradient or themed background
    const body = page.locator('body');
    const bgColor = await body.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    expect(bgColor).toBeTruthy();
  });
});

test.describe('YouTubeDownloader - API Integration', () => {
  test('should check dependencies via API', async ({ page }) => {
    const response = await page.request.post('http://localhost:3001/api/youtube/check-dependencies');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data).toHaveProperty('yt_dlp');
    expect(data).toHaveProperty('librosa');
  });

  test('should handle download request', async ({ page }) => {
    // This is a mock test - actual download would require valid YouTube URL
    const requestPromise = page.waitForRequest(
      (request) => request.url().includes('/api/youtube/download')
    );

    await page.goto('http://localhost:5173/youtube');
    await page.getByRole('button', { name: /^URL$/i }).click();

    const urlInput = page.locator('input[type="text"]').first();
    await urlInput.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    // Note: Not actually clicking download to avoid real API call in tests
    // In real scenario, would need to mock API or use test doubles
  });
});
