/**
 * Script de migration : Ancien format musique → Nouveau format 3 points
 *
 * Convertit:
 *   line.music = "music_id"
 * Vers:
 *   line.music = {
 *     intro: { music_id: "...", settings: {...} },
 *     outro: null,
 *     transition: null
 *   }
 */

const fs = require('fs');
const path = require('path');

// Default settings pour migration
const DEFAULT_SETTINGS = {
  play_type: 'full',
  clip_start: null,
  clip_end: null,
  fade_in: 2,
  fade_out: 2,
  volume: 80
};

/**
 * Migre une ligne d'ancien vers nouveau format
 */
function migrateLine(line) {
  // Si déjà au nouveau format (objet avec intro/outro/transition), skip
  if (line.music && typeof line.music === 'object' && !Array.isArray(line.music)) {
    if ('intro' in line.music || 'outro' in line.music || 'transition' in line.music) {
      console.log(`  ✓ Ligne "${line.title}" déjà au nouveau format`);
      return false; // Pas de changement
    }
  }

  // Si ancien format (string music_id)
  if (typeof line.music === 'string') {
    console.log(`  → Migration ligne "${line.title}": "${line.music}" → format 3 points`);

    line.music = {
      intro: {
        music_id: line.music,
        settings: { ...DEFAULT_SETTINGS }
      },
      outro: null,
      transition: null
    };

    return true; // Changement effectué
  }

  // Si pas de musique assignée
  if (!line.music || line.music === null) {
    console.log(`  ○ Ligne "${line.title}" sans musique assignée`);
    return false;
  }

  console.warn(`  ⚠ Ligne "${line.title}" format inconnu:`, line.music);
  return false;
}

/**
 * Migre un match complet
 */
function migrateMatch(match) {
  console.log(`\n📋 Match: ${match.title || match.match_id}`);

  let changeCount = 0;
  const lines = match.lines || match.improvs || [];

  lines.forEach(line => {
    if (migrateLine(line)) {
      changeCount++;
    }
  });

  return changeCount;
}

/**
 * Migre tous les matchs dans data/matches.json
 */
function migrateAllMatches(dryRun = false) {
  const matchesPath = path.join(__dirname, '../../data/matches.json');

  console.log('========================================');
  console.log('🔄 Migration Musique: Format 3 Points');
  console.log('========================================\n');
  console.log(`Mode: ${dryRun ? 'DRY RUN (aucune sauvegarde)' : 'MIGRATION RÉELLE'}\n`);

  // Lire le fichier
  if (!fs.existsSync(matchesPath)) {
    console.error(`❌ Fichier non trouvé: ${matchesPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(matchesPath, 'utf8');
  const matches = JSON.parse(rawData);

  console.log(`📁 Fichier: ${matchesPath}`);
  console.log(`📊 Nombre de matchs: ${matches.length}\n`);

  // Backup avant migration
  if (!dryRun) {
    const backupPath = matchesPath.replace('.json', `.backup-${Date.now()}.json`);
    fs.writeFileSync(backupPath, rawData, 'utf8');
    console.log(`💾 Backup créé: ${backupPath}\n`);
  }

  // Migrer chaque match
  let totalChanges = 0;
  matches.forEach(match => {
    const changes = migrateMatch(match);
    totalChanges += changes;
  });

  // Sauvegarder si pas dry-run
  if (!dryRun && totalChanges > 0) {
    fs.writeFileSync(matchesPath, JSON.stringify(matches, null, 2), 'utf8');
    console.log(`\n✅ Fichier sauvegardé: ${matchesPath}`);
  }

  // Résumé
  console.log('\n========================================');
  console.log('📊 Résumé Migration');
  console.log('========================================');
  console.log(`Matchs analysés: ${matches.length}`);
  console.log(`Lignes migrées: ${totalChanges}`);

  if (dryRun) {
    console.log('\n⚠️  DRY RUN: Aucune modification sauvegardée');
    console.log('Lancez avec --apply pour appliquer les changements\n');
  } else if (totalChanges > 0) {
    console.log('\n✅ Migration terminée avec succès\n');
  } else {
    console.log('\n✓ Aucune migration nécessaire\n');
  }
}

// CLI
const args = process.argv.slice(2);
const dryRun = !args.includes('--apply');

migrateAllMatches(dryRun);
