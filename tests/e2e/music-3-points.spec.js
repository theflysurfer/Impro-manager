import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('3 Points Musicaux (INTRO/OUTRO/TRANSITION)', () => {
  test.beforeEach(async ({ page }) => {
    // Aller sur l'interface Son d'un match
    await page.goto(`${BASE_URL}/sound`);
    await page.waitForLoadState('networkidle');
  });

  test('MusicAssignmentPanel est visible', async ({ page }) => {
    // Vérifier que le panel d'assignation existe
    const panel = page.locator('.music-assignment-panel');
    await expect(panel).toBeVisible();
  });

  test('Chaque ligne affiche 3 points musicaux', async ({ page }) => {
    // Sélectionner un match avec des lignes
    const matchSelect = page.locator('select').first();
    await matchSelect.selectOption({ index: 1 });
    
    await page.waitForTimeout(1000);
    
    // Vérifier qu'une ligne affiche bien 3 sections
    const firstLine = page.locator('.line-panel').first();
    await expect(firstLine).toBeVisible();
    
    // Click pour expand
    await firstLine.locator('.line-header').click();
    await page.waitForTimeout(500);
    
    // Vérifier les 3 composants MusicAssignment
    const introSection = firstLine.locator('[data-point="intro"]');
    const outroSection = firstLine.locator('[data-point="outro"]');
    const transitionSection = firstLine.locator('[data-point="transition"]');
    
    await expect(introSection).toBeVisible();
    await expect(outroSection).toBeVisible();
    await expect(transitionSection).toBeVisible();
  });

  test('Assigner musique INTRO ouvre le sélecteur', async ({ page }) => {
    const matchSelect = page.locator('select').first();
    await matchSelect.selectOption({ index: 1 });
    await page.waitForTimeout(1000);
    
    const firstLine = page.locator('.line-panel').first();
    await firstLine.locator('.line-header').click();
    await page.waitForTimeout(500);
    
    // Cliquer sur "Assigner" pour INTRO
    const assignButton = firstLine.locator('[data-point="intro"] .assign-button').first();
    await assignButton.click();
    
    // Vérifier que la modal de sélection s'ouvre
    const modal = page.locator('.music-selector-modal');
    await expect(modal).toBeVisible();
  });

  test('Settings modal affiche play_type options', async ({ page }) => {
    const matchSelect = page.locator('select').first();
    await matchSelect.selectOption({ index: 1 });
    await page.waitForTimeout(1000);
    
    const firstLine = page.locator('.line-panel').first();
    await firstLine.locator('.line-header').click();
    await page.waitForTimeout(500);
    
    // Si une musique est déjà assignée, ouvrir settings
    const settingsButton = firstLine.locator('[data-point="intro"] .settings-button').first();
    
    if (await settingsButton.isVisible()) {
      await settingsButton.click();
      
      // Vérifier le select play_type
      const playTypeSelect = page.locator('select[name="play_type"]');
      await expect(playTypeSelect).toBeVisible();
      
      // Vérifier les 3 options
      const options = await playTypeSelect.locator('option').allTextContents();
      expect(options).toContain('Lecture entière');
      expect(options).toContain('Clip auto');
      expect(options).toContain('Clip personnalisé');
    }
  });

  test('Status indicator affiche count correct', async ({ page }) => {
    const matchSelect = page.locator('select').first();
    await matchSelect.selectOption({ index: 1 });
    await page.waitForTimeout(1000);
    
    // Vérifier le status indicator (0/3, 1/3, 2/3, ou 3/3)
    const statusIndicator = page.locator('.status-indicator').first();
    
    if (await statusIndicator.isVisible()) {
      const statusText = await statusIndicator.textContent();
      expect(statusText).toMatch(/[0-3]\/3/);
    }
  });

  test('Backend schema validation - API accepte nouveau format', async ({ request }) => {
    // Test que l'API accepte le nouveau schema 3 points
    const testMatch = {
      match_id: 'test_match_3points',
      teams: {
        home: { name: 'Team A', score: 0 },
        away: { name: 'Team B', score: 0 }
      },
      lines: [
        {
          line_id: 'line_001',
          type: 'SEQUENCE',
          title: 'Test Line',
          duration_planned: 180,
          music: {
            intro: {
              music_id: 'music_042',
              settings: {
                play_type: 'clip_custom',
                clip_start: 10,
                clip_end: 40,
                fade_in: 2,
                fade_out: 3,
                volume: 80
              }
            },
            outro: null,
            transition: null
          }
        }
      ]
    };
    
    const response = await request.post('http://localhost:3001/api/matches', {
      data: testMatch
    });
    
    expect(response.ok()).toBeTruthy();
    
    // Cleanup
    await request.delete(`http://localhost:3001/api/matches/${testMatch.match_id}`);
  });
});
