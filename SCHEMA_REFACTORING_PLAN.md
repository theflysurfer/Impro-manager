# Plan de Refactoring : Schema Frontend/Backend

**Date** : 24 octobre 2025
**Priorité** : P1 (Haute - Technique Debt)
**Estimation** : 4h

---

## Problème

**Incompatibilité schema entre Backend et Frontend**

### Backend (API /api/matches)
```json
{
  "match_id": "match_001",
  "teams": {
    "home": { "name": "...", "score": 0 },
    "away": { "name": "...", "score": 0 }
  },
  "lines": [...]
}
```

### Frontend (actuellement attendu)
```json
{
  "match_id": "match_001",
  "teamA": { "name": "...", "score": 0 },
  "teamB": { "name": "...", "score": 0 },
  "improvs": [...]  // ou "lines"
}
```

### Solution Actuelle (Temporaire)
**MCInterface.vue:296-299** - Conversion manuelle via watcher :
```javascript
if (newMatch.teams && !newMatch.teamA) {
  newMatch.teamA = newMatch.teams.home || { name: 'Équipe A', score: 0 };
  newMatch.teamB = newMatch.teams.away || { name: 'Équipe B', score: 0 };
}
```

**Problème** : Cette approche crée des doublons de données et maintien de synchronisation.

---

## Analyse des Fichiers Impactés

### 1. MCInterface.vue
**Lignes impactées** :
- `52-53` : `v-model="currentMatch.teamA.name"` + `score`
- `58-59` : `v-model="currentMatch.teamB.name"` + `score`
- `186` : `v-model="newMatch.teamB"` (création)
- `250-253` : data() newMatch
- `296-299` : ⚠️ **Watcher temporaire** à supprimer
- `449` : Validation `!this.newMatch.teamB`

**Action** :
- Remplacer `teamA/teamB` par `teams.home/teams.away`
- Supprimer watcher ligne 296-299
- Adapter validation et formulaire

### 2. SoundInterface.vue
**Usage** : Utilise `currentMatch.lines` (déjà correct)

**Lignes impactées** :
- `144` : `v-for="(line, index) in (currentMatch.lines || currentMatch.improvs || [])"`
- Support `improvs` comme fallback

**Action** :
- Vérifier si `improvs` est encore utilisé
- Si non, supprimer fallback `|| currentMatch.improvs ||`

### 3. Home.vue
**À vérifier** : Affichage liste des matchs

---

## Plan d'Implémentation

### Phase 1 : Analyse Complète (30 min)
- [ ] Grep tous les usages de `teamA`, `teamB`, `improvs` dans `/client/src`
- [ ] Lister tous les composants impactés
- [ ] Identifier les computed properties et watchers à modifier

### Phase 2 : Refactoring MCInterface.vue (1h30)
- [ ] Remplacer `teamA` par `teams.home` dans template
- [ ] Remplacer `teamB` par `teams.away` dans template
- [ ] Adapter `newMatch` data structure :
  ```javascript
  newMatch: {
    title: '',
    teams: {
      home: { name: 'Notre Troupe', score: 0 },
      away: { name: '', score: 0 }
    },
    template: ''
  }
  ```
- [ ] Supprimer watcher temporaire (ligne 296-299)
- [ ] Adapter `createMatch()` pour utiliser nouveau schema
- [ ] Tester formulaire création match

### Phase 3 : Refactoring SoundInterface.vue (45 min)
- [ ] Supprimer fallback `|| currentMatch.improvs ||` si inutilisé
- [ ] Vérifier tous les accès à `currentMatch.lines`
- [ ] Adapter toute référence à teams si nécessaire

### Phase 4 : Refactoring Home.vue (30 min)
- [ ] Adapter affichage noms d'équipes
- [ ] Vérifier liste des matchs utilise bon schema

### Phase 5 : Tests (45 min)
- [ ] Test manuel : Créer nouveau match
- [ ] Test manuel : Modifier match existant
- [ ] Test manuel : Mode Live MC
- [ ] Test manuel : Mode Live Son
- [ ] Playwright tests (si nécessaire adapter)

### Phase 6 : Documentation et Déploiement (30 min)
- [ ] Mettre à jour CLAUDE.md
- [ ] Commit avec message détaillé
- [ ] Push vers GitHub
- [ ] Déploiement production
- [ ] Tests production

---

## Risques et Mitigation

### Risque 1 : Breaking Changes
**Impact** : Matchs existants peuvent ne pas s'afficher correctement
**Mitigation** : Garder fallback temporaire pendant transition, puis supprimer

### Risque 2 : Tests Playwright cassés
**Impact** : CI/CD peut échouer
**Mitigation** : Adapter les sélecteurs dans tests E2E si nécessaire

### Risque 3 : Mode Live cassé
**Impact** : Bloquant pour spectacles
**Mitigation** : Tester exhaustivement MCLive.vue et SoundLive.vue

---

## Avantages Attendus

1. **Code plus propre** : Suppression de code temporaire
2. **Maintenance facilitée** : Un seul schema à maintenir
3. **Performances** : Moins de watchers et conversions
4. **Moins de bugs** : Pas de désynchronisation teamA/teamB vs teams.home/away

---

## Commande Grep Utiles

```bash
# Trouver tous les usages
grep -rn "teamA" client/src/
grep -rn "teamB" client/src/
grep -rn "improvs" client/src/
grep -rn "teams\.home" client/src/
grep -rn "teams\.away" client/src/

# Trouver watchers
grep -rn "watch.*team" client/src/
```

---

## Notes Importantes

⚠️ **Ce refactoring doit être fait APRÈS validation complète du système 3 points musicaux**

✅ **Pré-requis complétés** :
- Mode Live fonctionnel
- 3 points musicaux déployés
- Tests production passants

🎯 **Prochaine étape** : Commencer Phase 1 (Analyse Complète)

---

*Document créé le 24 octobre 2025*
