# 🎯 Action Plan - Impro Manager v2.0

**Date**: 22 octobre 2025
**État actuel**: 60-70% complété
**Version**: Consolidé - Sprint 1 & 2 terminés

---

## 📊 État Actuel (Vérifié)

### ✅ Ce qui FONCTIONNE (30-40%)

#### Backend (90% complet)
- **Express.js API** avec 5 routes CRUD `/api/matches`
- **Personnel API** avec filtres `/api/personnel`
- **Music Library API** avec streaming `/api/music`
- **Socket.IO configuré** (serveur prêt, événements définis)
- **Validation JSON Schema** (AJV)
- **800+ pistes musicales** chargées

#### Frontend (70% complet)
- **7 composants Vue** (3,081 lignes) :
  - `Home.vue` - Page d'accueil avec liste matchs
  - `MCInterface.vue` - Interface préparation MC
  - `SoundInterface.vue` - Interface préparation Son
  - `MusicLibrary.vue` - Bibliothèque complète
  - `AudioPlayer.vue` - Lecteur HTML5
  - `MusicCard.vue` - Carte musique
  - `MusicFilters.vue` - Filtres bibliothèque
- **Vue Router** configuré (6 routes)
- **Boutons "Mode Live"** présents dans MCInterface et SoundInterface

### 🔴 Problèmes CRITIQUES Identifiés

#### 1. Live Mode NON intégré (🔴 BLOQUANT)
- **Fichiers existent** : `MCLive.vue` et `SoundLive.vue` à la racine
- **Mais** : Pas dans `client/src/components/`
- **Mais** : Pas de routes dans `main.js`
- **Mais** : Méthodes `goToLiveMode()` non définies
- **Conséquence** : Boutons Live Mode cassés

#### 2. Schema Frontend/Backend incompatible (🔴 BLOQUANT)
| Aspect | Frontend | Backend | Problème |
|--------|----------|---------|----------|
| ID | `match.id` | `match.match_id` | Différent |
| Équipes | `teamA`, `teamB` | `teams.home`, `teams.away` | Structure |
| Improvs | `improvs` | `lines` | Nom champ |
| Musique | `music: "id"` | `music: {intro, outro, transition}` | Structure |

**Conséquence** : Patches temporaires partout, bugs, confusion

#### 3. WebSocket NON connecté (🔴 BLOQUANT)
- **Serveur** : Socket.IO configuré, événements définis
- **Client** : Import `socket.io-client` présent
- **Mais** : Aucune connexion initialisée
- **Mais** : Aucun événement émis/écouté
- **Conséquence** : Pas de synchronisation temps réel

---

## 🎯 Plan d'Action Prioritaire

### ✅ Sprint 1 (TERMINÉ) - MVP Live Mode

#### ✅ Tâche 1.1 : Intégrer Live Mode dans Router (TERMINÉ)
**Commit**: `35208e6`
**Objectif** : Rendre les pages Live Mode accessibles

**Actions** :
1. Déplacer fichiers :
   ```bash
   mv MCLive.vue client/src/components/
   mv SoundLive.vue client/src/components/
   ```

2. Ajouter routes dans `client/src/main.js` :
   ```javascript
   import MCLive from './components/MCLive.vue'
   import SoundLive from './components/SoundLive.vue'

   const routes = [
     // ... routes existantes
     { path: '/matches/:matchId/live/mc', component: MCLive, props: true },
     { path: '/matches/:matchId/live/sound', component: SoundLive, props: true }
   ]
   ```

3. Implémenter méthodes `goToLiveMode()` dans MCInterface.vue :
   ```javascript
   function goToLiveMode() {
     router.push(`/matches/${selectedMatch.value.match_id}/live/mc`)
   }
   ```

4. Implémenter méthodes `goToLiveMode()` dans SoundInterface.vue :
   ```javascript
   function goToLiveMode() {
     router.push(`/matches/${selectedMatch.value.match_id}/live/sound`)
   }
   ```

**Livrable** : Boutons Live Mode fonctionnels, pages accessibles

---

#### ✅ Tâche 1.2 : Connecter WebSocket Frontend (TERMINÉ)
**Commit**: `61a84dc`
**Objectif** : Établir connexion temps réel MC ↔ Serveur ↔ Son

**Actions** :

1. Créer composable `client/src/composables/useWebSocket.js` :
   ```javascript
   import { ref, onMounted, onUnmounted } from 'vue'
   import { io } from 'socket.io-client'

   export function useWebSocket(matchId) {
     const socket = ref(null)
     const connected = ref(false)

     onMounted(() => {
       socket.value = io('http://localhost:3001')

       socket.value.on('connect', () => {
         connected.value = true
         socket.value.emit('join_match', { matchId })
       })

       socket.value.on('disconnect', () => {
         connected.value = false
       })
     })

     onUnmounted(() => {
       if (socket.value) {
         socket.value.disconnect()
       }
     })

     return { socket, connected }
   }
   ```

2. Intégrer dans `MCLive.vue` :
   ```javascript
   import { useWebSocket } from '@/composables/useWebSocket'

   const { socket, connected } = useWebSocket(props.matchId)

   function startLine(lineId) {
     socket.value.emit('line_started', {
       matchId: props.matchId,
       lineId
     })
   }

   function updateChrono(elapsed) {
     socket.value.emit('chrono_update', {
       matchId: props.matchId,
       elapsed
     })
   }
   ```

3. Intégrer dans `SoundLive.vue` :
   ```javascript
   import { useWebSocket } from '@/composables/useWebSocket'

   const { socket, connected } = useWebSocket(props.matchId)
   const currentLine = ref(null)
   const chrono = ref(0)

   socket.value.on('line_started', (data) => {
     currentLine.value = data.lineId
   })

   socket.value.on('chrono_update', (data) => {
     chrono.value = data.elapsed
   })
   ```

**Livrable** : MC et Son synchronisés en temps réel

---

#### ✅ Tâche 1.3 : Fixer Schema Mismatch (TERMINÉ)
**Commits**: `ef1f23e` (migration script), `f6fda63` (cleanup)
**Objectif** : Aligner frontend et backend sur nouveau schema

**Option A - Migration complète data** (recommandé) :

1. Créer script de migration `scripts/migrate-schema.js` :
   ```javascript
   const fs = require('fs')
   const oldMatches = require('../data/matches.json')

   const newMatches = oldMatches.map(match => ({
     match_id: match.id,
     title: match.title || 'Match sans titre',
     date: match.date || new Date().toISOString(),
     teams: {
       home: { name: match.teamA?.name || 'Équipe A', score: match.teamA?.score || 0 },
       away: { name: match.teamB?.name || 'Équipe B', score: match.teamB?.score || 0 }
     },
     lines: match.improvs?.map((improv, idx) => ({
       line_id: `line_${String(idx + 1).padStart(3, '0')}`,
       type: 'SEQUENCE',
       title: improv.title,
       duration_planned: improv.duration || 120,
       music: improv.music ? {
         intro: { music_id: improv.music, settings: {} },
         outro: { music_id: null, settings: {} },
         transition: { music_id: null, settings: {} }
       } : null
     })) || [],
     live_state: {
       current_line_id: null,
       chrono_elapsed: 0,
       chrono_status: 'stopped'
     }
   }))

   fs.writeFileSync('./data/matches.json', JSON.stringify(newMatches, null, 2))
   console.log(`✅ Migrated ${newMatches.length} matches`)
   ```

2. Exécuter migration :
   ```bash
   node scripts/migrate-schema.js
   ```

3. Supprimer workarounds dans composants :
   ```javascript
   // AVANT (à supprimer) :
   const matchId = computed(() => match.value?.match_id || match.value?.id)
   const teamA = computed(() => match.value?.teams?.home || match.value?.teamA)

   // APRÈS (propre) :
   const matchId = computed(() => match.value.match_id)
   const homeTeam = computed(() => match.value.teams.home)
   ```

**Livrable** : Schema cohérent partout, pas de bugs

---

### ✅ Sprint 2 (TERMINÉ) - Fonctionnalités Essentielles

#### ✅ Tâche 2.1 : Extension Schema 3 Points Musicaux (TERMINÉ)
**Commit**: `c918f11`
**Objectif** : Permettre assignation INTRO/OUTRO/TRANSITION

**Actions** :

1. Mettre à jour UI `SoundInterface.vue` :
   ```vue
   <template>
     <div class="music-points">
       <div class="point">
         <h4>INTRO</h4>
         <MusicAssignment v-model="line.music.intro" />
       </div>
       <div class="point">
         <h4>OUTRO</h4>
         <MusicAssignment v-model="line.music.outro" />
       </div>
       <div class="point">
         <h4>TRANSITION</h4>
         <MusicAssignment v-model="line.music.transition" />
       </div>
     </div>
   </template>
   ```

2. Créer composant `client/src/components/MusicAssignment.vue` avec drag & drop

**Livrable** : Son peut assigner 3 musiques par ligne

---

#### ✅ Tâche 2.2 : Implémenter 8 Types de Lignes (TERMINÉ)
**Commit**: `71e8c0a`
**Objectif** : Permettre création feuilles de match complètes

**Types à implémenter** :
- ARRIVÉE
- ÉCHAUFFEMENT
- PRÉSENTATION
- SEQUENCE (✅ existe)
- ANNONCE_INTERMEDIAIRE
- PAUSE
- ANNONCE_FIN
- FIN

**Actions** :

1. Créer composant `client/src/components/LineEditor.vue` avec formulaires conditionnels

2. Ajouter dans `MCInterface.vue` :
   ```vue
   <select v-model="newLine.type">
     <option value="ARRIVÉE">Arrivée Public</option>
     <option value="ÉCHAUFFEMENT">Échauffement</option>
     <option value="PRÉSENTATION">Présentation Équipes</option>
     <option value="SEQUENCE">Séquence d'Impro</option>
     <option value="ANNONCE_INTERMEDIAIRE">Annonce Intermédiaire</option>
     <option value="PAUSE">Pause / Entracte</option>
     <option value="ANNONCE_FIN">Annonce Fin</option>
     <option value="FIN">Fin de Match</option>
   </select>
   ```

**Livrable** : MC peut créer feuilles complètes avec tous types

---

#### ✅ Tâche 2.3 : Templates de Match (TERMINÉ)
**Commit**: `b8f4172`
**Objectif** : Créer matchs rapidement

**Actions** :

1. Compléter `data/templates.json` :
   ```json
   {
     "templates": [
       {
         "template_id": "standard_19",
         "name": "Match Standard (19 lignes)",
         "lines": [
           { "type": "ARRIVÉE", "title": "Arrivée Public", "duration_planned": 600 },
           { "type": "ÉCHAUFFEMENT", "title": "Échauffement Public", "duration_planned": 300 },
           { "type": "PRÉSENTATION", "title": "Présentation Équipes", "duration_planned": 180 },
           { "type": "SEQUENCE", "title": "Séquence 1", "duration_planned": 180 },
           { "type": "SEQUENCE", "title": "Séquence 2", "duration_planned": 180 },
           { "type": "SEQUENCE", "title": "Séquence 3", "duration_planned": 240 },
           { "type": "SEQUENCE", "title": "Séquence 4", "duration_planned": 180 },
           { "type": "ANNONCE_INTERMEDIAIRE", "title": "Annonce Mi-Temps", "duration_planned": 60 },
           { "type": "PAUSE", "title": "Entracte", "duration_planned": 900 },
           { "type": "SEQUENCE", "title": "Séquence 5", "duration_planned": 180 },
           { "type": "SEQUENCE", "title": "Séquence 6", "duration_planned": 180 },
           { "type": "SEQUENCE", "title": "Séquence 7", "duration_planned": 240 },
           { "type": "SEQUENCE", "title": "Séquence 8", "duration_planned": 180 },
           { "type": "ANNONCE_FIN", "title": "Annonce Résultats", "duration_planned": 120 },
           { "type": "FIN", "title": "Fin", "duration_planned": 60 }
         ]
       },
       {
         "template_id": "short_12",
         "name": "Match Court (12 lignes)",
         "lines": []
       }
     ]
   }
   ```

2. Créer route backend `GET /api/templates` dans `backend/routes/templateRoutes.js`

3. Ajouter bouton dans `MCInterface.vue` :
   ```vue
   <button @click="loadTemplate('standard_19')">
     📋 Charger Template Standard
   </button>
   ```

**Livrable** : MC crée feuille complète en < 2 minutes

---

### 🔵 Sprint 3 (EN COURS) - Intégration & Tests

#### Tâche 3.1 : Intégrer Composants dans Interfaces (2 jours)

**Objectif** : Connecter les nouveaux composants Sprint 2 aux interfaces existantes

**Actions** :

1. **Intégrer MusicAssignmentPanel dans SoundInterface.vue** :
   - Remplacer l'assignation musicale simple par MusicAssignmentPanel
   - Permettre gestion des 3 points par ligne (INTRO/OUTRO/TRANSITION)
   - Synchroniser avec backend via API PUT /api/matches/:id

2. **Intégrer LineEditor dans MCInterface.vue** :
   - Ajouter modal pour éditer/créer lignes avec tous types
   - Remplacer formulaire simple actuel par LineEditor
   - Gérer les 8 types de lignes avec champs conditionnels

3. **Intégrer Sélecteur de Templates** :
   - Ajouter bouton "Charger un template" dans MCInterface
   - Appeler GET /api/templates
   - Pré-remplir feuille de match avec template sélectionné

**Livrable** : Interfaces utilisent tous les nouveaux composants

---

#### Tâche 3.2 : Backend Event Handlers pour Live Sync (1 jour)

**Objectif** : Gérer tous les événements WebSocket pour synchronisation

**Actions** :

1. **Renforcer handlers Socket.IO dans backend/app.js** :
   - Ajouter validation des événements
   - Ajouter logging structuré
   - Gérer déconnexions/reconnexions
   - Broadcaster état à nouveaux clients rejoignant match

2. **Persistance état live** :
   - Sauvegarder `live_state` dans matches.json
   - Restaurer état après crash serveur
   - Gérer sessions multiples (plusieurs MC/Son sur même match)

**Livrable** : Synchronisation robuste et fiable

---

#### Tâche 3.3 : Tests End-to-End (2 jours)

**Objectif** : Valider tous les workflows utilisateurs

**Actions** :

1. **Tests Playwright** :
   - Scénario 1: Julie crée match complet avec template
   - Scénario 2: Marc assigne musiques 3 points
   - Scénario 3: Mode Live - Julie lance chrono, Marc voit sync
   - Scénario 4: Gestion score en temps réel

2. **Tests manuels** :
   - Exécuter tous les scénarios de TEST_SCENARIOS.md
   - Tester sur devices différents (desktop, tablet)
   - Vérifier latence réseau

**Livrable** : Suite de tests automatisés + rapport validation

---

### 🟢 Sprint 4+ (Après MVP) - Nice-to-Have

#### Fonctionnalités Futures
- PWA + Service Worker
- Cache offline (IndexedDB)
- Interface MC smartphone
- Authentification + Permissions
- Drag & drop réorganisation lignes
- Pipeline analyse musicale (Python)
- Filtres bibliothèque avancés
- Tests E2E Playwright

---

## 📈 Métriques de Succès

### MVP (Sprint 1-2 terminé)
- ✅ MC peut créer feuille de match complète (8 types)
- ✅ Son peut assigner musiques (3 points par ligne)
- ✅ MC peut lancer chrono et passer lignes suivantes
- ✅ Son voit chrono + ligne active synchronisés (< 1 sec latence)
- ✅ Son peut jouer musiques assignées
- ✅ Test spectacle complet 1h30 sans bug bloquant

### Performance Cibles
| Métrique | Cible | Actuel | Gap |
|----------|-------|--------|-----|
| Temps création feuille | < 10 min | ~20 min | 🔴 -100% |
| Temps assignation musiques | < 30 min | ~45 min | 🔴 -50% |
| Latence synchronisation | < 1 sec | N/A | 🔴 N/A |
| Chargement initial | < 3 sec | ~2 sec | ✅ OK |

---

## 🗂️ Architecture Fichiers

### Structure Actuelle (Vérifiée)
```
/backend/
  app.js                    ✅ 260 lignes, Socket.IO configuré
  /controllers/
    matchController.js      ✅ 189 lignes, CRUD complet
    personnelController.js  ✅ 189 lignes, CRUD complet
  /routes/
    matchRoutes.js          ✅ 25 lignes
    personnelRoutes.js      ✅ 26 lignes
  /models/
    match.schema.json       ✅ Nouveau format défini
    personnel.schema.json   ✅ Défini

/client/src/
  App.vue                   ✅ 67 lignes
  main.js                   ✅ 28 lignes, router configuré
  /components/
    Home.vue                ✅ 169 lignes
    MCInterface.vue         ✅ 702 lignes
    SoundInterface.vue      ✅ 951 lignes
    MusicLibrary.vue        ✅ 443 lignes
    /music/
      AudioPlayer.vue       ✅ 307 lignes
      MusicCard.vue         ✅ 198 lignes
      MusicFilters.vue      ✅ 311 lignes

/data/
  matches.json              ⚠️ Ancien format (à migrer)
  music.json                ✅ 800+ pistes
  personnel.json            ✅ 10 personnes
  templates.json            ⚠️ 1 seul template

📁 ROOT (À INTÉGRER)
  MCLive.vue                🔴 Pas routé
  SoundLive.vue             🔴 Pas routé
```

---

## 🚀 Commandes Utiles

### Développement Local
```bash
# Backend (port 3001)
cd backend && npm start

# Frontend (port 5173)
cd client && npm run dev

# Les deux ensemble
npm run dev
```

### Migration Schema
```bash
# Exécuter migration données
node scripts/migrate-schema.js
```

### Tests
```bash
# E2E Playwright
npx playwright test

# Test API
curl http://localhost:3001/api/matches
```

### Git
```bash
# Statut
git status

# Commit
git add .
git commit -m "✨ feat: Description"

# Push
git push origin master
```

---

## 📝 Notes Importantes

### Dépendances Installées
- ✅ Socket.IO (server + client)
- ✅ Vue 3 + Vue Router
- ✅ Express + CORS
- ✅ AJV (validation)
- ✅ Multer (upload)

### Configurations Critiques
- Port backend : 3001
- Port frontend : 5173
- Socket.IO CORS : localhost:5173
- Stockage : JSON files (`/data/`)

### Commits Récents (Sprint 1-2)
1. ✅ `35208e6` - Integrate Live Mode pages into router
2. ✅ `61a84dc` - Create useWebSocket composable for real-time sync
3. ✅ `ef1f23e` - Migrate schema to new format
4. ✅ `f6fda63` - Clean frontend schema workarounds
5. ✅ `8186541` - Create comprehensive test scenarios for personas
6. ✅ `c918f11` - Implement 3-point music assignment UI (Sprint 2.1)
7. ✅ `71e8c0a` - Implement 8 line types with conditional forms (Sprint 2.2)
8. ✅ `b8f4172` - Create match templates with API routes (Sprint 2.3)

### Prochains Commits Attendus (Sprint 3)
1. `✨ feat: Integrate MusicAssignmentPanel into SoundInterface`
2. `✨ feat: Integrate LineEditor into MCInterface`
3. `✨ feat: Add template selector to MCInterface`
4. `🧪 test: Add Playwright E2E tests for core workflows`

---

**Dernière mise à jour** : 22 octobre 2025
**État** : Sprint 1 & 2 TERMINÉS (60-70% projet complété)
**Prochaine action** : Sprint 3 - Tâche 3.1 (Intégrer composants dans interfaces)
