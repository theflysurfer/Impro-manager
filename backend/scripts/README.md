# Scripts Backend

Scripts utilitaires pour la maintenance et la migration de données.

## migrate-music-3-points.js

### Description
Script de migration pour convertir l'ancien format d'assignation musicale (string simple) vers le nouveau format 3 points (INTRO/OUTRO/TRANSITION).

### Format Migration

**Ancien format** (obsolète) :
```json
{
  "line_id": "line_001",
  "music": "music_042"
}
```

**Nouveau format** (actuel) :
```json
{
  "line_id": "line_001",
  "music": {
    "intro": {
      "music_id": "music_042",
      "settings": {
        "play_type": "full",
        "clip_start": null,
        "clip_end": null,
        "fade_in": 2,
        "fade_out": 2,
        "volume": 80
      }
    },
    "outro": null,
    "transition": null
  }
}
```

### Usage

#### Dry-run (sans modification)
Test la migration sans sauvegarder les changements :
```bash
cd backend
node scripts/migrate-music-3-points.js
```

#### Migration réelle
Applique les changements et sauvegarde :
```bash
cd backend
node scripts/migrate-music-3-points.js --apply
```

### Sécurité
- Un backup est automatiquement créé avant toute modification (`matches.backup-{timestamp}.json`)
- Le script détecte automatiquement les lignes déjà au nouveau format
- Mode dry-run par défaut pour éviter les erreurs

### Output
```
========================================
🔄 Migration Musique: Format 3 Points
========================================

Mode: DRY RUN (aucune sauvegarde)

📁 Fichier: .../data/matches.json
📊 Nombre de matchs: 6

📋 Match: Match Final avec Template Correct
  ✓ Ligne "SÉQUENCE #1" déjà au nouveau format
  → Migration ligne "SÉQUENCE #2": "music_042" → format 3 points

========================================
📊 Résumé Migration
========================================
Matchs analysés: 6
Lignes migrées: 1

⚠️  DRY RUN: Aucune modification sauvegardée
Lancez avec --apply pour appliquer les changements
```

### Quand utiliser ce script ?
- Après import de données legacy
- Si des matchs utilisent encore l'ancien format string
- Pour standardiser tous les matchs au nouveau schema

### Notes
- Les lignes sans musique assignée (`music: null`) sont ignorées
- Les default settings sont appliqués automatiquement
- Le script est idempotent (peut être lancé plusieurs fois sans danger)
