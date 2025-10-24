# Spécification : 3 Points Musicaux (INTRO/OUTRO/TRANSITION)

## Objectif
Permettre l'assignation de 3 musiques différentes par ligne d'improvisation, avec des réglages individuels pour chaque point.

## Schema Backend

### Avant (actuel)
```json
{
  "line_id": "line_001",
  "music": "music_id_simple"
}
```

### Après (nouveau)
```json
{
  "line_id": "line_001",
  "music": {
    "INTRO": {
      "track_id": "music_042",
      "settings": {
        "clip": {
          "start": 0,
          "end": 30
        },
        "fade": {
          "in": 2,
          "out": 3
        },
        "volume": 0.8
      }
    },
    "OUTRO": {
      "track_id": "music_089",
      "settings": {
        "clip": {
          "start": 45,
          "end": 75
        },
        "fade": {
          "in": 1,
          "out": 2
        },
        "volume": 0.9
      }
    },
    "TRANSITION": {
      "track_id": "music_015",
      "settings": {
        "clip": {
          "start": 0,
          "end": 15
        },
        "fade": {
          "in": 0.5,
          "out": 1
        },
        "volume": 0.7
      }
    }
  }
}
```

## UI Changes

### SoundInterface.vue
- Remplacer l'assignation simple par 3 sections :
  - **INTRO** : Musique jouée au début de la ligne
  - **OUTRO** : Musique jouée à la fin de la ligne
  - **TRANSITION** : Musique pour transition/inter-ligne

Chaque section affiche :
- Musique assignée (titre + artiste)
- Bouton "Assigner" pour ouvrir sélecteur
- Bouton "Retirer" si assignée
- **Settings** : Clip (start/end), Fade (in/out), Volume

### Composant MusicPointAssignment.vue
Créer un nouveau composant réutilisable :

```vue
<MusicPointAssignment
  :point="'INTRO'"
  :track-id="lineMusic.INTRO?.track_id"
  :settings="lineMusic.INTRO?.settings"
  @assign="handleAssign"
  @remove="handleRemove"
  @update-settings="handleUpdateSettings"
/>
```

**Props** :
- `point` : "INTRO" | "OUTRO" | "TRANSITION"
- `trackId` : ID de la musique assignée (ou null)
- `settings` : Objet settings (ou defaults)

**Events** :
- `assign(point)` : Ouvre modal sélection musique
- `remove(point)` : Retire la musique
- `update-settings(point, settings)` : Met à jour settings

## Backend Updates

### matchRoutes.js
Mettre à jour `PUT /api/matches/:id` pour supporter nouveau schema :
- Valider structure `line.music`
- Accepter ancien ET nouveau format (rétrocompatibilité)
- Convertir ancien vers nouveau si nécessaire

### app.js (Socket.IO)
Adapter `music_assigned` event pour inclure le point :
```javascript
socket.emit('music_assigned', {
  matchId,
  lineId,
  point: 'INTRO',  // 'INTRO' | 'OUTRO' | 'TRANSITION'
  trackId,
  settings
})
```

## Migration des Données

### matches.json
Script de migration pour convertir anciennes données :
```javascript
// Si line.music est string → convertir en objet avec INTRO uniquement
if (typeof line.music === 'string') {
  line.music = {
    INTRO: {
      track_id: line.music,
      settings: {
        clip: { start: 0, end: null },
        fade: { in: 2, out: 2 },
        volume: 0.8
      }
    }
  }
}
```

## Tests Playwright

### test/e2e/music-3-points.spec.js
```javascript
test('Assigner musique INTRO', async ({ page }) => {
  await page.goto('/sound/match_001')
  await page.click('[data-testid="assign-intro"]')
  await page.click('[data-music-id="music_042"]')
  await expect(page.locator('[data-point="INTRO"] .track-title')).toContainText('Western Showdown')
})

test('Configurer settings clip', async ({ page }) => {
  await page.fill('[data-testid="intro-clip-start"]', '10')
  await page.fill('[data-testid="intro-clip-end"]', '40')
  await expect(page.locator('[data-testid="intro-clip-start"]')).toHaveValue('10')
})
```

## Ordre d'Implémentation

1. **Backend schema** : Modifier validation + support rétrocompatibilité
2. **Composant MusicPointAssignment.vue** : UI réutilisable
3. **SoundInterface.vue** : Intégrer 3 composants
4. **Migration données** : Script conversion ancien format
5. **Tests Playwright** : Valider fonctionnalités
6. **SoundLive.vue** : Adapter lecteur audio pour gérer 3 points

## Defaults Settings
```javascript
const DEFAULT_SETTINGS = {
  clip: {
    start: 0,
    end: null  // null = fin du track
  },
  fade: {
    in: 2,     // 2 secondes fade in
    out: 2     // 2 secondes fade out
  },
  volume: 0.8  // 80%
}
```

## Notes Implémentation

- **Rétrocompatibilité** : Toujours supporter ancien format (string)
- **UI Progressive** : Phase 1 = assignation, Phase 2 = settings avancés
- **Validation** : `track_id` doit exister dans `music_library.json`
- **Performance** : Charger settings uniquement si ligne sélectionnée
