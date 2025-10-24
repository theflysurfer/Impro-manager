import { test, expect } from '@playwright/test';

const PRODUCTION_URL = 'http://69.62.108.82:8504';

test.describe('Production Health Check', () => {
  test('API health endpoint returns OK', async ({ request }) => {
    const response = await request.get(`${PRODUCTION_URL}/api/health`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.status).toBe('ok');
    expect(data.version).toBe('2.0.0');
    expect(data.musicLibraryLoaded).toBe(true);
    expect(data.musicCount).toBe(777);
  });

  test('Homepage loads correctly', async ({ page }) => {
    await page.goto(PRODUCTION_URL);
    await expect(page).toHaveTitle(/Impro Manager/i);
  });

  test('Music library endpoint returns data', async ({ request }) => {
    const response = await request.get(`${PRODUCTION_URL}/api/music`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });

  test('Matches endpoint returns data', async ({ request }) => {
    const response = await request.get(`${PRODUCTION_URL}/api/matches`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });
});
