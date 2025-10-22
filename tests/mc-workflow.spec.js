// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * E2E Tests for MC (Master of Ceremonies) Workflow
 * Based on Julie persona from TEST_SCENARIOS.md
 */

test.describe('MC Workflow - Match Creation and Management', () => {

  test('MC can create a match using a template', async ({ page }) => {
    // Navigate to MC interface
    await page.goto('/mc');
    await expect(page.locator('h2')).toContainText('Mode MC');

    // Click "Nouveau Match" button
    await page.getByRole('button', { name: /nouveau match/i }).click();

    // Fill match details in modal
    await page.fill('input[placeholder*="titre"]', 'Test Match - Standard');
    await page.fill('input[placeholder*="Équipe A"]', 'Les Improvisateurs');
    await page.fill('input[placeholder*="Équipe B"]', 'Les Comédiens');

    // Create the match
    await page.getByRole('button', { name: /créer/i }).click();

    // Wait for match to be created and loaded
    await page.waitForTimeout(500);

    // Verify match is loaded
    await expect(page.locator('h3')).toContainText('Test Match - Standard');

    // Select a template from dropdown
    const templateSelect = page.locator('select').filter({ hasText: /choisir un template/i });
    await templateSelect.selectOption({ label: /Match Standard/i });

    // Wait for template to apply
    await page.waitForTimeout(1000);

    // Verify template was applied (should have 19 lines for standard_19)
    const lineItems = page.locator('.improv-item');
    const lineCount = await lineItems.count();
    expect(lineCount).toBeGreaterThan(15); // At least 15 lines expected

    // Verify first line has a title
    const firstLineTitle = await lineItems.first().locator('.improv-title').textContent();
    expect(firstLineTitle).toBeTruthy();
    expect(firstLineTitle?.trim()).not.toBe('');
  });

  test('MC can add a new line using LineEditor', async ({ page }) => {
    // Assuming a match is already created (could use beforeEach to set this up)
    await page.goto('/mc');

    // Create a basic match first
    await page.getByRole('button', { name: /nouveau match/i }).click();
    await page.fill('input[placeholder*="titre"]', 'Test Match - Line Editor');
    await page.getByRole('button', { name: /créer/i }).click();
    await page.waitForTimeout(500);

    // Click "Ajouter" button to open LineEditor
    await page.getByRole('button', { name: /ajouter/i }).click();

    // Verify LineEditor modal is open
    await expect(page.locator('.modal-overlay')).toBeVisible();
    await expect(page.locator('.modal-header h3')).toContainText('Ajouter une Ligne');

    // Select line type: SEQUENCE
    await page.selectOption('select[id*="type"]', 'SEQUENCE');

    // Fill in line details
    await page.fill('input[placeholder*="titre"]', 'Improvisation Western');
    await page.fill('input[type="number"]', '180'); // duration
    await page.fill('input[placeholder*="thème"]', 'Western');
    await page.fill('input[placeholder*="contrainte"]', 'Avec accent texan');

    // Select format
    await page.selectOption('select', { label: /Comparée/i });

    // Save the line
    await page.getByRole('button', { name: /sauvegarder/i }).click();

    // Verify modal is closed
    await expect(page.locator('.modal-overlay')).not.toBeVisible();

    // Verify new line appears in list
    await expect(page.locator('.improv-item')).toContainText('Improvisation Western');
  });

  test('MC can edit team names and scores', async ({ page }) => {
    await page.goto('/mc');

    // Create match
    await page.getByRole('button', { name: /nouveau match/i }).click();
    await page.fill('input[placeholder*="titre"]', 'Test Match - Teams');
    await page.getByRole('button', { name: /créer/i }).click();
    await page.waitForTimeout(500);

    // Edit team A name
    const teamAInput = page.locator('input').filter({ hasText: /Équipe A/i }).or(
      page.locator('label:has-text("Équipe A")').locator('~ input').first()
    );
    await teamAInput.fill('Les Dragons');

    // Edit team B name
    const teamBInput = page.locator('input').filter({ hasText: /Équipe B/i }).or(
      page.locator('label:has-text("Équipe B")').locator('~ input').first()
    );
    await teamBInput.fill('Les Phénix');

    // Save match
    await page.getByRole('button', { name: /sauvegarder/i }).click();

    // Wait for save
    await page.waitForTimeout(500);

    // Verify values persist (reload and check)
    await page.reload();
    await page.waitForTimeout(500);

    // Check team names are still there
    await expect(page.locator('text=Les Dragons')).toBeVisible();
    await expect(page.locator('text=Les Phénix')).toBeVisible();
  });

  test('MC can navigate to Live Mode', async ({ page }) => {
    await page.goto('/mc');

    // Create match with template
    await page.getByRole('button', { name: /nouveau match/i }).click();
    await page.fill('input[placeholder*="titre"]', 'Test Match - Live Mode');
    await page.getByRole('button', { name: /créer/i }).click();
    await page.waitForTimeout(500);

    // Apply template
    const templateSelect = page.locator('select').filter({ hasText: /choisir un template/i });
    await templateSelect.selectOption({ label: /Match Court/i });
    await page.waitForTimeout(1000);

    // Save match first
    await page.getByRole('button', { name: /sauvegarder/i }).click();
    await page.waitForTimeout(500);

    // Click "Passer en Mode Live" button
    const liveModeButton = page.getByRole('button', { name: /mode live/i });
    await expect(liveModeButton).toBeVisible();
    await liveModeButton.click();

    // Verify navigation to Live Mode page
    await page.waitForTimeout(1000);
    await expect(page.url()).toContain('/live/mc');

    // Verify Live Mode interface is loaded
    await expect(page.locator('h2, h3')).toContainText(/Mode Live|MC Live/i);
  });
});

test.describe('MC Workflow - Timer and Line Management', () => {

  test('MC can start and stop timer', async ({ page }) => {
    await page.goto('/mc');

    // Create match with template
    await page.getByRole('button', { name: /nouveau match/i }).click();
    await page.fill('input[placeholder*="titre"]', 'Test Match - Timer');
    await page.getByRole('button', { name: /créer/i }).click();
    await page.waitForTimeout(500);

    // Apply template to have lines
    const templateSelect = page.locator('select').filter({ hasText: /choisir un template/i });
    await templateSelect.selectOption({ label: /Démo/i });
    await page.waitForTimeout(1000);

    // Find timer display
    const timer = page.locator('.timer').first();
    await expect(timer).toBeVisible();

    // Initial timer should show 0:00
    const initialTime = await timer.textContent();
    expect(initialTime).toContain('0:00');

    // Start timer
    await page.getByRole('button', { name: /démarrer/i }).click();

    // Wait 2 seconds
    await page.waitForTimeout(2000);

    // Timer should have advanced
    const runningTime = await timer.textContent();
    expect(runningTime).not.toBe(initialTime);

    // Pause timer
    await page.getByRole('button', { name: /pause/i }).click();

    // Wait 1 second
    await page.waitForTimeout(1000);

    // Timer should be paused (not advancing)
    const pausedTime = await timer.textContent();

    await page.waitForTimeout(1000);
    const stillPausedTime = await timer.textContent();
    expect(stillPausedTime).toBe(pausedTime);

    // Reset timer
    await page.getByRole('button', { name: /reset/i }).click();

    // Timer should be back to 0
    const resetTime = await timer.textContent();
    expect(resetTime).toContain('0:00');
  });
});
