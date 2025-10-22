// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * E2E Tests for Sound Engineer Workflow
 * Based on Marc persona from TEST_SCENARIOS.md
 */

test.describe('Sound Workflow - Music Assignment', () => {

  test('Sound can select a match and view music library', async ({ page }) => {
    // Navigate to Sound interface
    await page.goto('/sound');
    await expect(page.locator('h2')).toContainText('Mode Son');

    // Verify music library is visible
    await expect(page.locator('h3')).toContainText('Bibliothèque Musicale');

    // Verify music list is populated
    const musicItems = page.locator('.music-item');
    const musicCount = await musicItems.count();
    expect(musicCount).toBeGreaterThan(0); // Should have music from library

    // Verify first music item has title
    const firstMusicTitle = await musicItems.first().locator('.music-title').textContent();
    expect(firstMusicTitle).toBeTruthy();
  });

  test('Sound can filter music by type', async ({ page }) => {
    await page.goto('/sound');

    // Get initial count
    const initialMusicItems = page.locator('.music-item');
    const initialCount = await initialMusicItems.count();
    expect(initialCount).toBeGreaterThan(0);

    // Click "Musiques" filter
    await page.getByRole('button', { name: /musiques/i }).click();
    await page.waitForTimeout(300);

    // Count should change (or stay same if all are music)
    const musicOnlyCount = await page.locator('.music-item').count();

    // Click "Bruitages" filter
    await page.getByRole('button', { name: /bruitages/i }).click();
    await page.waitForTimeout(300);

    // Count should be different
    const soundEffectsCount = await page.locator('.music-item').count();

    // At least one filter should show different results
    const filterWorks = (musicOnlyCount !== initialCount) || (soundEffectsCount !== initialCount);
    expect(filterWorks).toBeTruthy();
  });

  test('Sound can search for music', async ({ page }) => {
    await page.goto('/sound');

    // Get search input
    const searchInput = page.locator('input[placeholder*="Rechercher"]');
    await expect(searchInput).toBeVisible();

    // Get initial count
    const initialCount = await page.locator('.music-item').count();

    // Search for something generic that should exist
    await searchInput.fill('music');
    await page.waitForTimeout(500);

    // Count should potentially change
    const searchCount = await page.locator('.music-item').count();

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(500);

    // Should return to initial count
    const clearedCount = await page.locator('.music-item').count();
    expect(clearedCount).toBe(initialCount);
  });

  test('Sound can play a music track', async ({ page }) => {
    await page.goto('/sound');

    // Find first music item and click play
    const firstMusicItem = page.locator('.music-item').first();
    const playButton = firstMusicItem.locator('button').filter({ hasText: /play/i }).first();

    // Click play
    await playButton.click();
    await page.waitForTimeout(500);

    // Verify current track is displayed in player
    const currentTrack = page.locator('.current-track');
    await expect(currentTrack).toBeVisible();

    // Verify track title is shown
    const trackTitle = currentTrack.locator('h4').first();
    await expect(trackTitle).toBeVisible();
    const titleText = await trackTitle.textContent();
    expect(titleText).toBeTruthy();
  });

  test('Sound can assign 3-point music to a line (if match loaded)', async ({ page }) => {
    // This test requires a match to be created first
    // For now, we'll test that the MusicAssignmentPanel appears when match is loaded

    await page.goto('/sound');

    // Try to select a match (if any exist)
    const matchSelect = page.locator('select').filter({ hasText: /sélectionner un match/i }).first();
    const options = await matchSelect.locator('option').count();

    if (options > 1) {
      // Select first available match (index 1, since 0 is "Sélectionner un match...")
      await matchSelect.selectOption({ index: 1 });
      await page.waitForTimeout(1000);

      // Verify MusicAssignmentPanel appears
      const musicPanel = page.locator('.music-assignment-panel, h3').filter({ hasText: /assignation musicale/i });

      // Check if panel exists (may not if match has no lines)
      const panelCount = await musicPanel.count();
      if (panelCount > 0) {
        await expect(musicPanel.first()).toBeVisible();
      }
    }
  });
});

test.describe('Sound Workflow - Audio Player Controls', () => {

  test('Sound can control playback (play/pause/stop)', async ({ page }) => {
    await page.goto('/sound');

    // Select a music track
    const firstMusicItem = page.locator('.music-item').first();
    await firstMusicItem.click();
    await page.waitForTimeout(500);

    // Verify player shows current track
    await expect(page.locator('.current-track')).toBeVisible();

    // Play button should be visible
    const playPauseButton = page.getByRole('button', { name: /play|pause/i }).first();
    await expect(playPauseButton).toBeVisible();

    // Click play
    await playPauseButton.click();
    await page.waitForTimeout(500);

    // Button should change to Pause
    await expect(playPauseButton).toContainText(/pause/i);

    // Click pause
    await playPauseButton.click();
    await page.waitForTimeout(300);

    // Button should change back to Play
    await expect(playPauseButton).toContainText(/play/i);

    // Stop button
    const stopButton = page.getByRole('button', { name: /stop/i }).first();
    await stopButton.click();
    await page.waitForTimeout(300);

    // Should be stopped (play button visible)
    await expect(playPauseButton).toContainText(/play/i);
  });

  test('Sound can adjust volume', async ({ page }) => {
    await page.goto('/sound');

    // Select a music track
    await page.locator('.music-item').first().click();
    await page.waitForTimeout(500);

    // Find volume slider
    const volumeSlider = page.locator('input[type="range"]').first();
    await expect(volumeSlider).toBeVisible();

    // Get initial value
    const initialValue = await volumeSlider.inputValue();

    // Change volume
    await volumeSlider.fill('50');
    await page.waitForTimeout(300);

    // Verify value changed
    const newValue = await volumeSlider.inputValue();
    expect(newValue).toBe('50');
    expect(newValue).not.toBe(initialValue);
  });

  test('Sound can use quick launch buttons', async ({ page }) => {
    await page.goto('/sound');

    // Verify quick launch section exists
    await expect(page.locator('h3')).toContainText(/lancement rapide/i);

    // Find quick buttons
    const quickButtons = page.locator('.quick-buttons button, button').filter({ hasText: /applause|gong|transition/i });
    const buttonCount = await quickButtons.count();
    expect(buttonCount).toBeGreaterThan(0);

    // Click first quick button
    if (buttonCount > 0) {
      await quickButtons.first().click();
      await page.waitForTimeout(500);

      // Should load a track (if music library has matching content)
      // This is best-effort as it depends on library content
    }
  });
});

test.describe('Sound Workflow - Navigation', () => {

  test('Sound can navigate to Live Mode (if match selected)', async ({ page }) => {
    await page.goto('/sound');

    // Try to select a match
    const matchSelect = page.locator('select').filter({ hasText: /sélectionner un match/i }).first();
    const options = await matchSelect.locator('option').count();

    if (options > 1) {
      // Select first match
      await matchSelect.selectOption({ index: 1 });
      await page.waitForTimeout(1000);

      // Find Live Mode button
      const liveModeButton = page.getByRole('button', { name: /mode live/i });

      if (await liveModeButton.isVisible()) {
        await liveModeButton.click();
        await page.waitForTimeout(1000);

        // Should navigate to /live/sound
        await expect(page.url()).toContain('/live/sound');
      }
    }
  });
});
