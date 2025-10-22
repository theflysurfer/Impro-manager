# 🎭 Impro Manager v2.0

Application web PWA pour gérer matchs d'improvisation théâtrale avec musique live synchronisée en temps réel.

---

## Contexte Rapide

**Stack** : Vue 3 + Express.js + Socket.IO + JSON storage
**Déploiement** : Docker sur Hostinger Cloud (root@69.62.108.82)
**État actuel** : Phase 1-2 en cours (~15% du projet)

**Utilisateurs** :
- MC (maître de cérémonie) : Gère feuille de match + chrono pendant spectacle
- Son (régisseur) : Assigne musiques + joue audio pendant spectacle

---

## Architecture Projet

```
/backend          → Express API + Socket.IO server
  /routes         → API endpoints (/api/matches, /api/music)
  /data           → JSON storage (matches.json, music_library.json)
  server.js       → Point d'entrée

/client           → Vue 3 frontend
  /src
    /components   → Composants Vue
    /views        → Pages complètes
    /composables  → Logique réutilisable
    App.vue
    main.js

/docs             → Documentation détaillée
  ARCHITECTURE.md
  FEATURES.md
  UI-SYSTEM.md
  ROADMAP.md

.claude/
  project-context.md  → ⭐ LIRE EN PREMIER pour contexte complet
```

---

## Data Models Essentiels

### Match (backend schema)
```json
{
  "match_id": "match_001",
  "teams": {
    "home": { "name": "...", "score": 0 },
    "away": { "name": "...", "score": 0 }
  },
  "lines": [
    {
      "line_id": "line_001",
      "type": "SEQUENCE",
      "title": "Comparée 3min - Western",
      "duration_planned": 180,
      "music": "music_id_simple"  // ⚠️ À migrer vers 3 points
    }
  ]
}
```

### Music
```json
{
  "id": "music_042",
  "title": "Western Showdown",
  "artist": "The Outlaws",
  "duration": 165,
  "scenarios": ["Western", "Action"]
}
```

---

## 🔴 Problèmes Critiques Actuels

1. **Mode Live absent** (0%) - Bloquant pour production
   - Pas de page `/matches/:id/live/mc`
   - Pas de page `/matches/:id/live/sound`
   - Pas de synchronisation WebSocket

2. **Schema musical incomplet**
   - Actuel : 1 point simple par ligne
   - Attendu : 3 points (INTRO/OUTRO/TRANSITION) avec settings (clip, fade, volume)

3. **Schema incompatibilité frontend/backend**
   - Backend : `teams.home/away`, `lines`
   - Frontend attend : `teamA/teamB`, `improvs`
   - Patches temporaires via Vue watchers

4. **PWA offline absent** - Pas de Service Worker, pas de cache

---

## Conventions Code

### Vue.js
- **Composition API** avec `<script setup>`
- **Naming** : PascalCase composants (MusicCard.vue), camelCase variables
- **Props** : Toujours typer avec defineProps
- **Style** : `<style scoped>` + classes utilitaires

### CSS
- **Design tokens** : Variables CSS (`var(--color-primary)`)
- **BEM** pour composants complexes : `.music-card__header--active`
- **Glassmorphisme** : `background: rgba(255,255,255,0.1); backdrop-filter: blur(10px)`
- **Éviter** : Styles inline, !important, magic numbers

### Git Commits
Format : `🎨 Description` ou `feat: Description`
- ✨ feat, 🐛 fix, ♻️ refactor, 📝 docs, 🎨 style, ✅ test

### API Routes
- `GET /api/matches` - Liste matchs
- `GET /api/matches/:id` - Détails match
- `POST /api/matches` - Créer match
- `PUT /api/matches/:id` - Modifier match
- `GET /api/music` - Liste musiques (avec filtres query params)

---

## Prochaines Étapes Prioritaires

### Sprint Immédiat (P0 - 12 jours)
1. Setup Socket.IO (server + client)
2. Créer pages Mode Live :
   - `/matches/:id/live/mc` (chronomètre, score, progression)
   - `/matches/:id/live/sound` (lecteur audio sync)
3. Synchronisation WebSocket :
   - Events : `line_started`, `chrono_update`
4. Extension schema 3 points musicaux

### Après MVP (P1)
- 8 types de lignes (actuellement seul SEQUENCE)
- Drag & drop assignation musiques
- Filtres bibliothèque fonctionnels
- PWA + cache offline

---

## Commandes Utiles

### Développement Local
```bash
# Backend
cd backend && npm start          # Port 3001

# Frontend
cd client && npm run dev         # Port 5173

# Les deux en parallèle (depuis root)
npm run dev                      # Démarre backend + frontend
```

### Déploiement Production
```bash
# SSH serveur
ssh root@69.62.108.82

# Dans /opt/impro-manager
git pull
docker-compose build
docker-compose down && docker-compose up -d
docker logs impro-manager --tail=50

# Check santé
curl http://localhost:8504/api/health
```

### Tests
```bash
npx playwright test              # E2E tests
```

---

## Ressources Essentielles

### Documentation Complète
📖 **LIRE EN PREMIER** : `.claude/project-context.md`
- Vue d'ensemble exhaustive
- Architecture détaillée
- État actuel vs cible
- Workflows utilisateurs

### Docs Détaillées
- `docs/ARCHITECTURE.md` - Stack + data models + API
- `docs/FEATURES.md` - User stories + workflows
- `docs/UI-SYSTEM.md` - Design system + wireframes + conventions CSS
- `docs/ROADMAP.md` - Phases + gap analysis + priorités
- `RESEARCH_FINDINGS.md` - Recherches PWA/WebSocket/Audio

### Code Clés
- Backend API : `backend/routes/matches.js`, `backend/routes/music.js`
- Composants : `client/src/components/MCInterface.vue`, `SoundInterface.vue`, `Home.vue`
- Schémas : `backend/schemas/match.schema.json`

---

## Notes Importantes

⚠️ **Schema Migration en Cours**
- Frontend utilise ancien schema (teamA/teamB, improvs)
- Backend utilise nouveau schema (teams.home/away, lines)
- Watchers Vue temporaires pour compatibilité
- À refactorer après MVP Live

⚠️ **WebSocket Pas Encore Configuré**
- Hardcoded localhost remplacé par window.location.origin
- Socket.IO client configuré mais serveur pas encore implémenté

⚠️ **Playwright MCP Disponible**
- Peut naviguer et tester l'UI via browser automation
- Useful pour validation end-to-end

---

## Helpful Commands

Si besoin de contexte complet :
```
Read .claude/project-context.md
```

Si besoin d'architecture détaillée :
```
Read docs/ARCHITECTURE.md
```

Si besoin de voir les features manquantes :
```
Read docs/ROADMAP.md
```

---

*Dernière mise à jour : 22 octobre 2025*
*Status : MVP Live en développement*
