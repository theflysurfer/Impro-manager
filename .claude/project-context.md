# 🎭 Impro Manager v2.0 - Context Complet pour LLM

*Dernière mise à jour : 22 octobre 2025*
*Statut : Phase 1-2 en cours (15% complété)*

---

## 1️⃣ Projet en 30 Secondes

**Quoi** : Application web PWA pour gérer matchs d'improvisation théâtrale avec musique live
**Pour qui** : MC (maître de cérémonie) + Régisseur Son
**Besoin critique** : Synchronisation temps réel pendant spectacles live (chrono, musiques)

**Stack** : Vue 3 + Express.js + Socket.IO + JSON storage
**Déploiement** : Hostinger Cloud (Docker)

---

## 2️⃣ Architecture Technique

### Frontend
- **Framework** : Vue 3 (Composition API) + Vite
- **State** : Composition API pure (pas de Pinia)
- **Routing** : Vue Router
- **WebSocket** : Socket.IO Client
- **Audio** : HTML5 Audio API
- **Cache** : IndexedDB (musiques) + Cache Storage (bruitages)
- **Styling** : CSS custom (glassmorphisme) + classes utilitaires

### Backend
- **Server** : Express.js (Node 18+)
- **Storage** : JSON files (`/data/*.json`)
- **WebSocket** : Socket.IO v4
- **Audio** : Fichiers statiques servis par Express

### Data Models (Simplifié)
```json
Match {
  "match_id": "match_001",
  "teams": { "home": {...}, "away": {...} },
  "lines": [
    {
      "line_id": "line_001",
      "type": "SEQUENCE",
      "title": "Comparée 3min",
      "duration_planned": 180,
      "music": {
        "intro": { "music_id": "...", "settings": {...} },
        "outro": {...},
        "transition": {...}
      }
    }
  ]
}

Music {
  "id": "music_042",
  "title": "Western Showdown",
  "artist": "...",
  "duration": 165,
  "scenarios": ["Western", "Action"],
  "tempo": 140,
  "sections": {...}
}
```

---

## 3️⃣ État Actuel vs Cible

### ✅ Ce qui fonctionne (15%)
- API CRUD `/api/matches` + `/api/music`
- Interface MCInterface.vue (création feuille basique)
- Interface SoundInterface.vue (bibliothèque + assignation simple)
- Bibliothèque musicale ~30 pistes

### 🔴 Bloquants Critiques (0% implémenté)
1. **Mode Live** (MC + Son) - RIEN
2. **WebSocket sync temps réel** - RIEN
3. **3 points musicaux** (INTRO/OUTRO/TRANSITION) - Seul 1 point simple
4. **PWA offline** (IndexedDB cache) - RIEN
5. **8 types de lignes** - Seul SEQUENCE

### 🟡 Limitations Actuelles
- Schema backend incompatible frontend (patches temporaires)
- Pas de filtres fonctionnels bibliothèque
- Pas de drag & drop assignation
- Pas de templates matchs standard

---

## 4️⃣ Workflow Utilisateur Cible

### Mode Préparation (Avant spectacle)
**MC** :
1. Crée feuille de match (infos générales, équipes, personnel)
2. Ajoute 19 lignes (template standard) : ARRIVÉE, ÉCHAUFFEMENT, 8 SÉQUENCES, PAUSE, ANNONCES, FIN
3. Configure chaque séquence (type, durée, thème, contrainte)
4. Notifie le Son
5. Active Mode Live

**Son** :
1. Ouvre match assigné
2. Assigne musiques aux 3 points (INTRO/OUTRO/TRANSITION) de chaque séquence
3. Configure settings : clip (start/end), fade in/out, volume
4. Télécharge toutes musiques offline
5. Passe en Mode Live

### Mode Live (Pendant spectacle)
**MC** :
- Démarre chrono chaque impro
- Passe ligne suivante (manuel ou auto à 0:00)
- Gère score équipes
- → Events WebSocket émis en temps réel

**Son** :
- Voit chrono + ligne active synchronisés
- Joue musiques assignées (INTRO au début, OUTRO à la fin)
- Recherche rapide bruitages pour imprévus
- → Reçoit events WebSocket

---

## 5️⃣ Prochaines Étapes Immédiates

### Sprint 1-2 semaines (MVP Live)
**Priorité P0** :
1. Setup Socket.IO (server + client)
2. Page `/matches/:id/live/mc` + composants :
   - LiveTimer.vue (chronomètre)
   - ProgressionList.vue (liste lignes)
   - ScoreBoard.vue (score)
3. Page `/matches/:id/live/sound` + composants :
   - SoundLivePlayer.vue (lecteur audio)
   - LiveMusicAssignments.vue (musiques ligne actuelle)
4. Sync WebSocket : `line_started`, `chrono_update`
5. Extension schema 3 points musicaux

**Effort estimé** : ~12 jours dev

---

## 6️⃣ Références Complètes

### Documentation Détaillée
- **Architecture complète** : `docs/ARCHITECTURE.md` (à créer)
- **Features + user stories** : `docs/FEATURES.md` (à créer)
- **Design system + wireframes** : `docs/UI-SYSTEM.md` (à créer)
- **Roadmap + gap analysis** : `FEATURE_GAP_ANALYSIS.md` ✅
- **Recherches techniques** : `RESEARCH_FINDINGS.md` ✅

### Documentation Source (à refacto après MVP)
- **PRD complet** : `PRD.md` (1818 lignes)
- **Action Plan** : `ACTION_PLAN.md` (1310 lignes)
- **Wireframes** : `WIREFRAMES.md` (1525 lignes)
- **Frontend Rules** : `FRONTEND_RULES.md` (1073 lignes)

### Code Clés
- **Backend** : `backend/server.js`, `backend/routes/`, `backend/data/`
- **Frontend** : `client/src/components/`, `client/src/views/`
- **Schémas** : `backend/schemas/match.schema.json`

### URLs Production
- **App** : https://impro-manager.ludo-impro.fr (si déployé)
- **API** : https://impro-manager.ludo-impro.fr/api
- **Server SSH** : root@69.62.108.82

---

## 7️⃣ Conventions Projet

### Git Commits
Format : `<type>: <description>` ou `<emoji> <description>`
- Types : feat, fix, refactor, docs, style, test, chore
- Emojis : ✨ feat, 🐛 fix, ♻️ refactor, 📝 docs, 🎨 style

### Code Style
- **Vue** : Composition API, `<script setup>`
- **CSS** : Scoped + classes utilitaires, design tokens (variables CSS)
- **Naming** : PascalCase composants, camelCase variables, kebab-case CSS

### Testing
- Playwright E2E (configuré mais peu de tests)
- Tests manuels prioritaires actuellement

---

## 8️⃣ Problèmes Techniques Connus

### Schema Incompatibilité Frontend/Backend
**Problème** : Backend utilise nouveau schema, frontend attend ancien
**Solution temporaire** : Vue watchers dans MCInterface.vue, SoundInterface.vue, Home.vue
**À faire** : Refacto frontend pour utiliser directement nouveau schema

### Socket.IO Non Configuré
**Problème** : Client configuré mais serveur pas implémenté
**Impact** : Mode Live impossible
**Priorité** : P0 (bloquant)

### Music Library Incomplète
**Problème** : ~30 pistes vs 777+ prévues, métadonnées limitées
**Solution** : Pipeline Python analyse musicale (Librosa, Essentia)
**Priorité** : P2 (nice-to-have pour MVP)

---

*Ce document est la source de vérité. Lire en premier avant toute tâche.*
