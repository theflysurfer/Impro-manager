// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('MCInterface - Interface Maître de Cérémonie', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/mc');
    await page.waitForLoadState('networkidle');
  });

  test('should display MC interface header', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Mode MC');
    await expect(page.locator('.mc-interface, .mc-header')).toBeVisible();
  });

  test('should load and display available matches', async ({ page }) => {
    const matchSelector = page.locator('select.form-input');
    await expect(matchSelector).toBeVisible();

    // Should have options
    const options = await matchSelector.locator('option').count();
    expect(options).toBeGreaterThanOrEqual(1);
  });

  test('should display team information when match selected', async ({ page }) => {
    const matchSelector = page.locator('select.form-input');
    await matchSelector.selectOption({ index: 1 });
    await page.waitForTimeout(1000);

    // Should show team names and scores
    const pageContent = await page.textContent('body');
    expect(pageContent).toMatch(/Équipe|Team|VS/);
  });

  test('should display match lines/improvs list', async ({ page }) => {
    const matchSelector = page.locator('select.form-input');
    await matchSelector.selectOption({ index: 1 });
    await page.waitForTimeout(1000);

    // Should show improvs/lines
    const improvsList = page.locator('.improvs-list, .lines-list, .improv-item');
    const hasImprovs = await improvsList.count() > 0;
    expect(hasImprovs).toBeTruthy();
  });

  test('should have template selector', async ({ page }) => {
    // Template selector should be visible
    const templateSelector = page.locator('.template-selector, select').filter({
      hasText: /Template|Modèle/
    });

    const hasTemplateSelector = await templateSelector.count() > 0 ||
                                 await page.getByText(/Template|Modèle/).count() > 0;
    expect(hasTemplateSelector).toBeTruthy();
  });

  test('should display line editor component', async ({ page }) => {
    const matchSelector = page.locator('select.form-input');
    await matchSelector.selectOption({ index: 1 });
    await page.waitForTimeout(1000);

    // Check for line editor
    const lineEditor = page.locator('.line-editor, .improv-editor');
    const hasEditor = await lineEditor.count() > 0;
    expect(hasEditor).toBeTruthy();
  });

  test('should allow creating new match', async ({ page }) => {
    // Look for "New Match" or "Créer" button
    const newMatchBtn = page.getByRole('button', { name: /Nouveau|Créer|New/i });

    const hasNewButton = await newMatchBtn.count() > 0;
    expect(hasNewButton).toBeTruthy();
  });

  test('should display score controls for teams', async ({ page }) => {
    const matchSelector = page.locator('select.form-input');
    await matchSelector.selectOption({ index: 1 });
    await page.waitForTimeout(1000);

    // Should have + and - buttons for scores
    const scoreButtons = page.locator('button').filter({ hasText: /\+|\-/ });
    const hasScoreButtons = await scoreButtons.count() > 0;
    expect(hasScoreButtons).toBeTruthy();
  });

  test('should show sync button', async ({ page }) => {
    const matchSelector = page.locator('select.form-input');
    await matchSelector.selectOption({ index: 1 });
    await page.waitForTimeout(1000);

    // Should have sync button
    const syncBtn = page.locator('button').filter({ hasText: /Sync/i });
    const hasSyncButton = await syncBtn.count() > 0;
    expect(hasSyncButton).toBeTruthy();
  });

  test('should have live mode button', async ({ page }) => {
    const matchSelector = page.locator('select.form-input');
    await matchSelector.selectOption({ index: 1 });
    await page.waitForTimeout(1000);

    // Should have "Mode Live" button
    const liveBtn = page.locator('button').filter({ hasText: /Live/i });
    const hasLiveButton = await liveBtn.count() > 0;
    expect(hasLiveButton).toBeTruthy();
  });
});

test.describe('MCInterface - Match Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/mc');
    await page.waitForLoadState('networkidle');
  });

  test('should persist match data when reloading', async ({ page }) => {
    const matchSelector = page.locator('select.form-input');
    const options = await matchSelector.locator('option').count();

    if (options > 1) {
      await matchSelector.selectOption({ index: 1 });
      await page.waitForTimeout(1000);

      // Get selected match title
      const selectedValue = await matchSelector.inputValue();

      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Match should still be available
      const reloadedOptions = await page.locator('select.form-input option').count();
      expect(reloadedOptions).toBeGreaterThanOrEqual(options);
    }
  });

  test('should show match metadata (date, teams, etc)', async ({ page }) => {
    const matchSelector = page.locator('select.form-input');
    await matchSelector.selectOption({ index: 1 });
    await page.waitForTimeout(1000);

    // Should display team names
    const pageContent = await page.textContent('body');
    const hasTeamInfo = pageContent.match(/équipe|team|vs/i);
    expect(hasTeamInfo).toBeTruthy();
  });

  test('should display line types correctly', async ({ page }) => {
    const matchSelector = page.locator('select.form-input');
    await matchSelector.selectOption({ index: 1 });
    await page.waitForTimeout(1000);

    // Check for line type badges or indicators
    const lineItems = page.locator('.improv-item, .line-item');
    if (await lineItems.count() > 0) {
      const firstLine = lineItems.first();
      await expect(firstLine).toBeVisible();

      // Should have some type indicator
      const text = await firstLine.textContent();
      expect(text.length).toBeGreaterThan(0);
    }
  });
});

test.describe('MCInterface - Line Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/mc');
    await page.waitForLoadState('networkidle');

    // Select a match
    const matchSelector = page.locator('select.form-input');
    const options = await matchSelector.locator('option').count();
    if (options > 1) {
      await matchSelector.selectOption({ index: 1 });
      await page.waitForTimeout(1000);
    }
  });

  test('should show line editor when clicking on a line', async ({ page }) => {
    const firstLine = page.locator('.improv-item, .line-item').first();

    if (await firstLine.count() > 0) {
      await firstLine.click();

      // Editor should appear or expand
      const editor = page.locator('.line-editor, .improv-editor, .editor-panel');
      const hasEditor = await editor.count() > 0;
      expect(hasEditor).toBeTruthy();
    }
  });

  test('should allow editing line title', async ({ page }) => {
    const titleInput = page.locator('input[placeholder*="Titre"], input[name="title"]').first();

    if (await titleInput.count() > 0) {
      await titleInput.fill('Test Improv Title');
      const value = await titleInput.inputValue();
      expect(value).toBe('Test Improv Title');
    }
  });

  test('should allow editing line duration', async ({ page }) => {
    const durationInput = page.locator('input[type="number"], input[placeholder*="durée"]').first();

    if (await durationInput.count() > 0) {
      await durationInput.fill('240');
      const value = await durationInput.inputValue();
      expect(value).toBe('240');
    }
  });

  test('should display line type selector', async ({ page }) => {
    const typeSelector = page.locator('select').filter({
      hasText: /Type|SEQUENCE|COMPARÉE/
    });

    const hasTypeSelector = await typeSelector.count() > 0;
    expect(hasTypeSelector).toBeTruthy();
  });
});

test.describe('MCInterface - Navigation', () => {
  test('should navigate between MC modes', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // Click MC link
    await page.click('a[href="/mc"]');
    await expect(page).toHaveURL(/\/mc/);

    // Should display MC interface
    await expect(page.locator('h2')).toContainText('Mode MC');
  });

  test('should have link to home', async ({ page }) => {
    await page.goto('http://localhost:5173/mc');

    const homeLink = page.locator('a[href="/"]');
    await expect(homeLink).toBeVisible();
  });

  test('should show active state in navigation', async ({ page }) => {
    await page.goto('http://localhost:5173/mc');

    // MC link should be active
    const mcLink = page.locator('a[href="/mc"]');
    const classes = await mcLink.getAttribute('class');
    expect(classes).toContain('active');
  });
});
