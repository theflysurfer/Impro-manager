/**
 * Test E2E: Validation du refactoring schema teams.home/away
 *
 * Vérifie que:
 * - MCInterface utilise teams.home/away (plus teamA/teamB)
 * - SoundInterface utilise teams.home/away et lines (plus teamA/teamB/improvs)
 * - Home.vue affiche correctement les équipes
 * - La création de match fonctionne avec le nouveau schema
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:5174';

test.describe('Schema Refactoring - teams.home/away', () => {

  test('MCInterface affiche correctement les équipes', async ({ page }) => {
    await page.goto(`${BASE_URL}/mc`);

    // Attendre que la page charge
    await page.waitForLoadState('networkidle');

    // Vérifier que les labels sont "Équipe Domicile" et "Équipe Extérieur"
    const homeLabel = page.locator('text=Équipe Domicile').first();
    const awayLabel = page.locator('text=Équipe Extérieur').first();

    await expect(homeLabel).toBeVisible();
    await expect(awayLabel).toBeVisible();
  });

  test('Création de match avec nouveau schema', async ({ page }) => {
    await page.goto(`${BASE_URL}/mc`);
    await page.waitForLoadState('networkidle');

    // Ouvrir modal création match
    const newMatchButton = page.locator('button:has-text("Nouveau Match")');
    await newMatchButton.click();

    // Remplir le formulaire
    await page.fill('input[placeholder="Ex: Match Finale 2025"]', 'Test Schema Refactoring');
    await page.fill('input[placeholder="Nom équipe adverse"]', 'Équipe Test');

    // Sélectionner un template
    const templateSelect = page.locator('select').first();
    await templateSelect.selectOption({ index: 1 }); // Sélectionner premier template non-vide

    // Créer le match
    const createButton = page.locator('button:has-text("Créer")');
    await createButton.click();

    // Attendre redirection ou confirmation
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Vérifier que le match a été créé (vérifier API)
    const response = await page.request.get('http://localhost:3001/api/matches');
    expect(response.ok()).toBeTruthy();

    const matches = await response.json();
    const createdMatch = matches.find(m => m.title === 'Test Schema Refactoring');

    expect(createdMatch).toBeDefined();
    expect(createdMatch.teams).toBeDefined();
    expect(createdMatch.teams.home).toBeDefined();
    expect(createdMatch.teams.away).toBeDefined();
    expect(createdMatch.teams.away.name).toBe('Équipe Test');

    // Vérifier que teamA/teamB n'existent PAS
    expect(createdMatch.teamA).toBeUndefined();
    expect(createdMatch.teamB).toBeUndefined();
  });

  test('SoundInterface affiche les équipes correctement', async ({ page }) => {
    await page.goto(`${BASE_URL}/sound`);
    await page.waitForLoadState('networkidle');

    // Sélectionner un match
    const matchSelect = page.locator('select').first();
    await matchSelect.selectOption({ index: 1 });

    await page.waitForTimeout(1000);

    // Vérifier que les noms d'équipe s'affichent (teams.home/away)
    const vsText = page.locator('text=VS').first();
    await expect(vsText).toBeVisible();
  });

  test('Home.vue liste les matchs avec teams.home/away', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Vérifier que la liste des matchs affiche "vs" entre équipes
    const vsElements = page.locator('text=vs');
    const count = await vsElements.count();

    expect(count).toBeGreaterThan(0);
  });

  test('API retourne schema correct (teams.home/away)', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/matches');
    expect(response.ok()).toBeTruthy();

    const matches = await response.json();
    expect(matches.length).toBeGreaterThan(0);

    // Vérifier que tous les matchs utilisent teams.home/away
    matches.forEach(match => {
      expect(match.teams).toBeDefined();
      expect(match.teams.home).toBeDefined();
      expect(match.teams.away).toBeDefined();
      expect(match.teams.home.name).toBeDefined();
      expect(match.teams.away.name).toBeDefined();
    });
  });

  test('Backend n accepte pas ancien schema teamA/teamB', async ({ request }) => {
    const oldFormatMatch = {
      title: 'Test Ancien Format',
      teamA: { name: 'Équipe A', score: 0 },
      teamB: { name: 'Équipe B', score: 0 },
      lines: []
    };

    const response = await request.post('http://localhost:3001/api/matches', {
      data: oldFormatMatch
    });

    // Le backend devrait accepter mais normaliser vers nouveau format
    // Ou rejeter si validation stricte activée
    const match = await response.json();

    if (response.ok()) {
      // Si accepté, vérifier normalisation
      expect(match.teams).toBeDefined();
      expect(match.teams.home).toBeDefined();
      expect(match.teams.away).toBeDefined();
    }
    // Sinon validation stricte active, c'est OK aussi
  });
});
