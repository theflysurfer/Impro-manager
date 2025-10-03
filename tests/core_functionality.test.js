/**
 * 🎭 Impro Manager - Core Functionality Test
 *
 * Test unique actif pour validation des fonctionnalités critiques
 * Seul test à maintenir par étape de développement
 *
 * Focus actuel: Mode Live + Synchronisation MC ↔ Son
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Impro Manager - Core Functionality', () => {

  /**
   * Test 1: Validation des fichiers critiques
   */
  it('should have all critical files present', () => {
    const criticalFiles = [
      'static/app-fixed.js',
      'static/index.html',
      'static/style.css',
      'static/style-sound.css',
      'server/app.js',
      'package.json'
    ];

    criticalFiles.forEach(file => {
      const filePath = path.join(__dirname, '..', file);
      assert(fs.existsSync(filePath), `Critical file missing: ${file}`);
    });
  });

  /**
   * Test 2: Validation app-fixed.js contient Mode Live
   */
  it('should contain Live Mode functionality in app-fixed.js', () => {
    const appFixedPath = path.join(__dirname, '..', 'static', 'app-fixed.js');
    const content = fs.readFileSync(appFixedPath, 'utf8');

    // Variables essentielles Mode Live
    assert(content.includes('liveMode'), 'Missing liveMode variable');
    assert(content.includes('soundSet'), 'Missing soundSet variable');
    assert(content.includes('liveSearchQuery'), 'Missing liveSearchQuery variable');

    // Fonctions essentielles Mode Live
    assert(content.includes('prepareSoundSet'), 'Missing prepareSoundSet function');
    assert(content.includes('quickPlaySound'), 'Missing quickPlaySound function');
    assert(content.includes('performLiveSearch'), 'Missing performLiveSearch function');

    // Template avec toggle
    assert(content.includes('mode-toggle'), 'Missing mode toggle in template');
    assert(content.includes('live-mode'), 'Missing live-mode class usage');
  });

  /**
   * Test 3: Validation bibliothèque musicale
   */
  it('should have music library properly loaded', () => {
    const musicLibraryPath = path.join(__dirname, '..', 'music_library.json');

    if (fs.existsSync(musicLibraryPath)) {
      const musicLibrary = JSON.parse(fs.readFileSync(musicLibraryPath, 'utf8'));
      assert(Array.isArray(musicLibrary), 'Music library should be an array');
      assert(musicLibrary.length > 0, 'Music library should not be empty');

      // Validation structure première piste
      if (musicLibrary.length > 0) {
        const firstTrack = musicLibrary[0];
        assert(firstTrack.hasOwnProperty('title'), 'Music track should have title');
        assert(firstTrack.hasOwnProperty('genre'), 'Music track should have genre');
        assert(firstTrack.hasOwnProperty('mood'), 'Music track should have mood');
      }
    }
  });

  /**
   * Test 4: Validation structure HTML
   */
  it('should have proper HTML structure', () => {
    const indexPath = path.join(__dirname, '..', 'static', 'index.html');
    const content = fs.readFileSync(indexPath, 'utf8');

    // Navigation structure
    assert(content.includes('router-link to="/"'), 'Missing home navigation');
    assert(content.includes('router-link to="/mc"'), 'Missing MC navigation');
    assert(content.includes('router-link to="/sound"'), 'Missing Sound navigation');

    // Scripts essentiels
    assert(content.includes('vue@3'), 'Missing Vue.js 3');
    assert(content.includes('socket.io'), 'Missing Socket.IO');
    assert(content.includes('app-fixed.js'), 'Missing app-fixed.js reference');
  });

  /**
   * Test 5: Validation package.json
   */
  it('should have proper package.json configuration', () => {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    // Dependencies critiques
    assert(packageJson.dependencies.hasOwnProperty('express'), 'Missing express dependency');
    assert(packageJson.dependencies.hasOwnProperty('socket.io'), 'Missing socket.io dependency');
    assert(packageJson.dependencies.hasOwnProperty('cors'), 'Missing cors dependency');

    // Scripts
    assert(packageJson.scripts.hasOwnProperty('start'), 'Missing start script');
  });

});

/**
 * LOG de test pour debugging LLM
 *
 * Ce test valide les 5 éléments critiques identifiés comme
 * sources de régression :
 *
 * 1. Présence fichiers critiques
 * 2. Mode Live complet dans app-fixed.js
 * 3. Bibliothèque musicale valide
 * 4. Structure HTML correcte
 * 5. Configuration package.json
 *
 * En cas d'échec, vérifier :
 * - Régression dans app-fixed.js
 * - Fichiers manquants après restructuration
 * - Corruption de la bibliothèque musicale
 *
 * Dernière validation: 2025-10-03
 */