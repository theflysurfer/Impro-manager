# 🔍 Feature Gap Analysis - Impro Manager v2.0

**Date d'analyse**: 22 octobre 2025
**Version actuelle**: Phase 1-2 (partiellement implémentée)
**Objectif**: Identifier toutes les fonctionnalités manquantes

---

## Table des Matières

1. [Résumé Exécutif](#1-résumé-exécutif)
2. [État d'Avancement par Phase](#2-état-davancement-par-phase)
3. [Fonctionnalités Manquantes Critiques](#3-fonctionnalités-manquantes-critiques)
4. [Analyse Détaillée par Domaine](#4-analyse-détaillée-par-domaine)
5. [Recommandations de Priorisation](#5-recommandations-de-priorisation)
6. [Prochaines Étapes Immédiates](#6-prochaines-étapes-immédiates)

---

## 1. Résumé Exécutif

### 1.1 Vue d'Ensemble

**Développement prévu**: 6 phases sur 10 sprints (20 semaines)
**État actuel**: Phase 1-2 partiellement implémentée (~15% du projet)

### 1.2 Statistiques Globales

| Catégorie | Planifié | Implémenté | % Complétion | Statut |
|-----------|----------|------------|--------------|--------|
| **Phase 1**: Fondations | 100% | 40% | 40% | 🟡 En cours |
| **Phase 2**: Bibliothèque | 100% | 30% | 30% | 🟡 En cours |
| **Phase 3**: Assignation | 100% | 20% | 20% | 🟡 Partiel |
| **Phase 4**: Mode Live | 100% | 0% | 0% | 🔴 Non commencé |
| **Phase 5**: PWA | 100% | 0% | 0% | 🔴 Non commencé |
| **Phase 6**: Admin | 100% | 0% | 0% | 🔴 Non commencé |
| **TOTAL** | 100% | 15% | **15%** | 🔴 Début de projet |

### 1.3 Points Critiques

**🔴 BLOQUANTS POUR PRODUCTION:**
1. ❌ Mode Live (MC + Son) complètement absent
2. ❌ WebSocket synchronisation temps réel non implémentée
3. ❌ PWA offline-first non configurée
4. ❌ Assignation musicale avec 3 points (INTRO/OUTRO/TRANSITION) non implémentée
5. ❌ Templates de matchs standard non implémentés

**🟡 LIMITATIONS ACTUELLES:**
1. ⚠️ Seul type de ligne SEQUENCE implémenté (8 types prévus)
2. ⚠️ Schema backend incompatible avec frontend (patches de compatibilité temporaires)
3. ⚠️ Assignation musicale limitée à 1 point (au lieu de 3)
4. ⚠️ Pas de mode Préparation vs Live toggle
5. ⚠️ Interface smartphone MC non implémentée

---

## 2. État d'Avancement par Phase

### Phase 1: Fondations (Sprint 1-2) - 40% ✅🟡

#### ✅ Complété:
- [x] Backend API Express.js setup
- [x] Routes API CRUD `/api/matches`
- [x] Stockage JSON `/data/matches.json`
- [x] Frontend Vue 3 + Vite setup
- [x] Routing Vue Router (pages de base)
- [x] Interface MCInterface.vue créée
- [x] Stockage JSON `/data/music_library.json`
- [x] API `/api/music` pour liste musiques

#### 🟡 Partiellement complété:
- [~] Modèles de données (schema incompatibilité frontend/backend)
- [~] Composants de base (MatchLine.vue basique, pas complet)
- [~] Vue Création Match (formulaire infos générales manquant)
- [~] Sélection personnel (pas implémenté côté UI)

#### ❌ Manquant:
- [ ] **8 types de lignes**: Seul SEQUENCE implémenté
  - ARRIVÉE, ÉCHAUFFEMENT, PRÉSENTATION manquants
  - ANNONCE INTERMÉDIAIRE, PAUSE, ANNONCE FIN, FIN manquants
- [ ] **Template standard 19 lignes**: Bouton "Charger template" non fonctionnel
- [ ] **Formulaires spécifiques par type**: Modal d'édition ligne incomplète
- [ ] **Drag & drop réorganisation**: vue-draggable-next pas installé/implémenté
- [ ] **Sauvegarde auto 30 secondes**: Pas implémenté
- [ ] **API Personnel** `/api/personnel`: Route existe mais pas d'UI de sélection
- [ ] **Validation schéma AJV**: Validation basique mais pas complète

**Livrable attendu**: Julie peut créer feuille complète en < 10 minutes
**État actuel**: ❌ Impossible (types de lignes manquants, pas de template)

---

### Phase 2: Bibliothèque Musicale (Sprint 3-4) - 30% ✅🟡

#### ✅ Complété:
- [x] `music_library.json` généré manuellement avec ~30 musiques
- [x] API `/api/music` qui liste musiques
- [x] Interface bibliothèque `/sound` avec grille de cartes
- [x] Composant `MusicCard.vue` basique
- [x] Affichage métadonnées: titre, artiste, durée

#### 🟡 Partiellement complété:
- [~] Filtres (scenarios, tempo) présents mais pas fonctionnels
- [~] Lecteur preview basique mais sans contrôles avancés

#### ❌ Manquant:

**Sprint 3: Pipeline Analyse Musicale**
- [ ] **Script Python scan 777+ fichiers**: Non exécuté
- [ ] **Extraction métadonnées complètes** (30+ champs par piste):
  - [ ] Tempo (BPM)
  - [ ] Tonalité/Key
  - [ ] Mode (Majeur/Mineur)
  - [ ] Spectral Centroid
  - [ ] Vocal/Instrumental detection
  - [ ] Instruments dominants
  - [ ] Arousal/Valence/Dominance
  - [ ] Tags émotions discrètes
  - [ ] Structure (Intro/Verse/Chorus/Outro)
  - [ ] Climax timestamp
  - [ ] Clip auto (meilleur extrait 30-45 sec)
- [ ] **Tags manuels** pour ~50 pistes clés (Western, Romance, etc.)

**Sprint 4: Interface Bibliothèque Avancée**
- [ ] **Filtres interactifs fonctionnels**:
  - [ ] Scenarios (checkboxes multi-sélection)
  - [ ] Tempo (range slider 60-180 BPM)
  - [ ] Vocal/Instrumental (checkboxes)
  - [ ] Recherche texte avec debounce 300ms
  - [ ] Émotions (sliders Valence/Arousal)
- [ ] **Tri**: Énergie, Titre, Durée, BPM
- [ ] **Pagination/virtualisation** si > 100 résultats
- [ ] **Lecteur Preview complet**:
  - [ ] Play/Pause/Stop
  - [ ] Progress bar interactive
  - [ ] Volume slider
  - [ ] Bouton [🎬 Clip] pour jouer extrait clippé
- [ ] **Distinction musiques vs bruitages**:
  - [ ] Onglet séparé pour bruitages
  - [ ] Liste ~100 bruitages (1-10 sec)

**Livrable attendu**: Marc trouve musique Western en < 30 secondes
**État actuel**: 🟡 Possible mais lent (pas de filtres, pas de recherche, scroll manuel)

---

### Phase 3: Assignation Musicale (Sprint 5-6) - 20% 🟡

#### ✅ Complété:
- [x] Interface Son `/sound/:id` existe
- [x] Layout split-screen (feuille | bibliothèque)
- [x] Assignation musicale basique (1 point par ligne)
- [x] Sauvegarde assignations dans `music` field

#### ❌ Manquant:

**Sprint 5: Backend + Frontend Layout**
- [ ] **Extension modèle Match** avec 3 points musicaux:
  ```json
  "music": {
    "intro": { "music_id": "...", "settings": {...} },
    "outro": { "music_id": "...", "settings": {...} },
    "transition": { "music_id": "...", "settings": {...} }
  }
  ```
- [ ] **Zones 3 points** par ligne: INTRO / OUTRO / TRANSITION
- [ ] Zones vides: `[+ Assigner]`
- [ ] Zones remplies: `✅ [🎸 Titre 2:45] [✏️] [🗑️]`

**Sprint 6: Drag & Drop + Édition**
- [ ] **Drag & Drop** musiques vers zones INTRO/OUTRO/TRANSITION
- [ ] **Composant MusicSettings.vue** (modal):
  - [ ] Type lecture: Entier / Clip auto / Clip custom
  - [ ] Point de départ: 0:00 / Hook / Climax / Custom
  - [ ] Fade in/out (sliders)
  - [ ] Volume (slider)
  - [ ] Visualisation timeline musique (sections)
  - [ ] Preview configuration
- [ ] **Auto-save** après chaque assignation (debounce 1 sec)
- [ ] **Indicateur**: "⚠️ X musiques non assignées"
- [ ] **Actions**: [🗑️ Retirer], popup confirmation

**Livrable attendu**: Marc assigne musiques match complet en < 30 minutes
**État actuel**: ❌ Impossible (pas de drag & drop, pas de 3 points, pas d'édition settings)

---

### Phase 4: Mode Live & Synchronisation (Sprint 7-8) - 0% 🔴

#### ❌ Complètement manquant:

**Sprint 7: WebSocket + Interface MC Live**
- [ ] **Setup Socket.IO Server**:
  - [ ] Intégrer Socket.IO à Express
  - [ ] Rooms par match: `match_{match_id}`
  - [ ] Événements: `join_match`, `live_mode_activated`, `line_started`, `chrono_update`, `line_completed`
- [ ] **Gestion Rooms**: Client MC/Son s'identifie, broadcast événements
- [ ] **Persistance État Live** dans JSON:
  - [ ] `live_state.current_line_id`
  - [ ] `live_state.chrono_elapsed`
  - [ ] `live_state.chrono_status` (running/paused/stopped)
- [ ] **Socket.IO Client**: Composable `useWebSocket.js`
- [ ] **Page MC Mode Live** `/matches/:id/live/mc`:
  - [ ] Composant `LiveTimer.vue` (chronomètre)
  - [ ] Composant `ScoreBoard.vue` (gestion score)
  - [ ] Composant `ProgressionList.vue` (liste lignes)
  - [ ] Boutons: Démarrer / Pause / Stop / Reset
  - [ ] Bouton [⏭️ Passer ligne suivante]
  - [ ] Emit `chrono_update` chaque seconde
- [ ] **Toggle Mode Live**: Bouton [🔄 Mode Live →] depuis MC Préparation

**Sprint 8: Interface Son Live + Synchronisation**
- [ ] **Page Son Mode Live** `/matches/:id/live/sound`:
  - [ ] Composant `SoundLivePlayer.vue` (lecteur principal)
  - [ ] Composant `LiveMusicAssignments.vue` (musiques ligne actuelle)
  - [ ] Composant `QuickSearch.vue` (recherche rapide bruitages)
- [ ] **Synchronisation Ligne Active**:
  - [ ] Listen `line_started` → Mise à jour "EN COURS"
  - [ ] Listen `chrono_update` → Affichage chrono synchronisé
- [ ] **Lecteur Audio Principal**:
  - [ ] Boutons [▶️ JOUER INTRO/OUTRO/TRANSITION]
  - [ ] Play avec fade in, volume, clip configuré
  - [ ] Contrôles: Skip climax, Fade out manuel, Volume en temps réel
- [ ] **Recherche Rapide Bruitages**:
  - [ ] Input recherche
  - [ ] Suggestions rapides (badges cliquables)
  - [ ] Play immédiat bruitage court
- [ ] **Toggle Mode Live (Son)**: Listen `live_mode_activated` (émis par MC)

**Livrable attendu**: Julie et Marc coordonnent spectacle complet sans incident
**État actuel**: 🔴 **IMPOSSIBLE** - Mode Live complètement absent

---

### Phase 5: PWA & Optimisation (Sprint 9-10) - 0% 🔴

#### ❌ Complètement manquant:

**Sprint 9: Implémentation PWA & Cache**
- [ ] **vite-plugin-pwa** configuration
- [ ] **Manifest.json**: name, icons, theme_color, display: standalone
- [ ] **Architecture de Cache Hybride** (CRITIQUE selon RESEARCH_FINDINGS.md):
  - [ ] **Cache Storage API** pour bruitages (~10 MB) + assets
  - [ ] **IndexedDB** pour chansons (150-250 MB total, pas de limite Safari 50 MB)
  - [ ] Fichier `/utils/audioCache.js`: `cacheSong()`, `getCachedSong()`, `isSongCached()`
- [ ] **Cache Strategy - Chansons**:
  - [ ] Téléchargement progressif avec progress tracking (`ReadableStream`)
  - [ ] Bouton "💾 Télécharger tout" avec progress bar global
  - [ ] Icône ✅ si en cache, ⏳ sinon
- [ ] **Cache Strategy - Bruitages**: Téléchargement auto au chargement app SON
- [ ] **Offline Detection**: Composable `useOnlineStatus.js`, banner UI
- [ ] **Interface MC Smartphone** `/matches/:id/live/mc-mobile`:
  - [ ] Layout touch-optimized (boutons 48x48px minimum)
  - [ ] Swipe gestures pour navigation
  - [ ] Mode offline: Lecture seule
- [ ] **Headers HTTP Cache** backend:
  - [ ] Musiques: `Cache-Control: public, max-age=31536000`
  - [ ] API JSON: `Cache-Control: no-cache`
- [ ] **WebSocket Robustesse**:
  - [ ] Reconnexion automatique côté serveur
  - [ ] Heartbeat adaptatif: 10 sec (smartphone), 5 sec (desktop)

**Sprint 10: UX Polish & Tests Utilisateur**
- [ ] **Animations & Transitions**: Fade, slide, pulse icône 🔴
- [ ] **Feedback Visuel**: Loading spinners, skeleton loaders, toast confirmations
- [ ] **Accessibilité**: Labels ARIA, navigation clavier, contraste WCAG AA
- [ ] **Responsive Final**: Tests tablette iPad
- [ ] **Tests avec Utilisateurs Réels**: Session Julie + Marc
- [ ] **Documentation Utilisateur**: Guide rapide PDF/MD

**Livrable attendu**: Application déployée en production, match réel géré avec app
**État actuel**: 🔴 **IMPOSSIBLE** - Pas de PWA, pas d'offline, pas d'optimisation

---

### Phase 6: Admin & Features Avancées (Sprint 11-12) - 0% 🔴

#### ❌ Complètement manquant:

**Sprint 11: Authentification & Rôles**
- [ ] **Système d'authentification**: bcrypt + JWT ou sessions
- [ ] Routes: `/api/auth/login`, `/api/auth/logout`, `/api/auth/register`
- [ ] **Réinitialisation mot de passe par email**:
  - [ ] Routes: `/api/auth/forgot-password`, `/api/auth/reset-password/:token`
  - [ ] Génération token unique (UUID + expiration 1h)
  - [ ] Configuration SMTP, template email HTML
- [ ] **Modèle Utilisateur** `/data/users/users.json`:
  - [ ] Champs: user_id, email, password_hash, role, created_at, last_login
  - [ ] Rôles: Admin, MC, Son, Membre
- [ ] **Middleware d'authentification**: `authMiddleware.js`
- [ ] **Permissions par rôle**:
  - [ ] Admin: Accès complet
  - [ ] MC: Créer/éditer matches assignés
  - [ ] Son: Assigner musiques matches assignés
  - [ ] Membre: Lecture seule matches passés
- [ ] **Frontend**:
  - [ ] Page `/login`
  - [ ] Pages `/forgot-password` et `/reset-password?token=xxx`
  - [ ] Composable `useAuth.js`
  - [ ] Navigation Guards Vue Router

**Sprint 12: Gestion Admin & Impersonation**
- [ ] **API Gestion Utilisateurs**:
  - [ ] GET/POST/PUT/DELETE `/api/admin/users`
- [ ] **Impersonation (Dev/Testing)**:
  - [ ] Route `POST /api/admin/impersonate/:user_id`
  - [ ] Log actions mode impersonation
  - [ ] Durée limitée: 1 heure
  - [ ] Badge UI: "⚠️ Mode Impersonation - Julie (MC)"
- [ ] **Logging Structuré**: Winston ou Pino
  - [ ] Format: `[timestamp] [level] [context] message`
  - [ ] Rotation logs: `winston-daily-rotate-file`
  - [ ] Fichiers: `/logs/app-2025-10-10.log`
- [ ] **API Logs**: GET `/api/admin/logs` avec filtres
- [ ] **Frontend**:
  - [ ] Interface Admin `/admin/users`
  - [ ] Interface Logs `/admin/logs`
  - [ ] Dashboard Admin (optionnel)

**Livrable attendu**: Système Admin complet et sécurisé
**État actuel**: 🔴 **RIEN** - Aucune authentification, aucun contrôle d'accès

---

## 3. Fonctionnalités Manquantes Critiques

### 3.1 Top 10 Fonctionnalités Bloquantes

| # | Fonctionnalité | Importance | Effort | Priorité | Statut |
|---|---------------|------------|--------|----------|--------|
| 1 | **Mode Live MC** (chronomètre, progression) | 🔴 Critique | 4 jours | P0 | ❌ 0% |
| 2 | **Mode Live Son** (lecteur sync, bruitages) | 🔴 Critique | 4 jours | P0 | ❌ 0% |
| 3 | **WebSocket synchronisation temps réel** | 🔴 Critique | 3 jours | P0 | ❌ 0% |
| 4 | **3 points musicaux** (INTRO/OUTRO/TRANSITION) | 🔴 Critique | 2 jours | P0 | ❌ 0% |
| 5 | **8 types de lignes** (ARRIVÉE, PAUSE, etc.) | 🟡 Important | 3 jours | P1 | ❌ 0% |
| 6 | **Drag & Drop** assignation musicale | 🟡 Important | 2 jours | P1 | ❌ 0% |
| 7 | **Template standard 19 lignes** | 🟡 Important | 1 jour | P1 | ❌ 0% |
| 8 | **PWA + Cache offline** (IndexedDB) | 🟡 Important | 5 jours | P1 | ❌ 0% |
| 9 | **Pipeline analyse musicale** (Python) | 🟢 Nice-to-have | 7 jours | P2 | ❌ 0% |
| 10 | **Authentification + Permissions** | 🟢 Nice-to-have | 4 jours | P3 | ❌ 0% |

**Total effort estimé pour fonctionnalités critiques (P0-P1)**: **~25 jours de développement**

### 3.2 Fonctionnalités Partiellement Implémentées

| Fonctionnalité | % Complété | Manquant Principal |
|---------------|------------|-------------------|
| **Création feuille de match** | 40% | Types de lignes, template, drag & drop |
| **Bibliothèque musicale** | 30% | Filtres fonctionnels, recherche, 777 pistes |
| **Assignation musicale** | 20% | 3 points, drag & drop, settings (fade, clip) |
| **Interface MC Préparation** | 30% | Formulaires complets, sauvegarde auto |
| **Interface Son Préparation** | 25% | Drag & drop, modal édition musique |

---

## 4. Analyse Détaillée par Domaine

### 4.1 Domaine: Types de Lignes de Match

**Planifié**: 8 types de lignes selon PRD.md section 4
**Implémenté**: 1 type (SEQUENCE)

| Type de Ligne | Planifié | Implémenté | Champs Spécifiques Manquants |
|--------------|----------|------------|------------------------------|
| ARRIVÉE | ✅ | ❌ | qui, heure, remarques |
| ÉCHAUFFEMENT PUBLIC | ✅ | ❌ | durée, type |
| PRÉSENTATION ÉQUIPES | ✅ | ❌ | durée, ordre |
| **SÉQUENCE D'IMPRO** | ✅ | ✅ 70% | Champs musiques incomplets (3 points) |
| ANNONCE INTERMÉDIAIRE | ✅ | ❌ | contenu, durée |
| PAUSE / ENTRACTE | ✅ | ❌ | durée |
| ANNONCE FIN | ✅ | ❌ | type (score/remerciements), contenu |
| FIN | ✅ | ❌ | heure_prevue |

**Impact**: ❌ Impossible de créer feuille de match complète conforme au template standard

---

### 4.2 Domaine: Assignation Musicale

**Planifié**: 3 points par ligne (INTRO, OUTRO, TRANSITION) avec settings avancés
**Implémenté**: 1 point simple par ligne (`music: "music_id"`)

#### Schéma Backend Attendu (PRD.md section 9.2):
```json
"music": {
  "intro": {
    "music_id": "music_042",
    "settings": {
      "play_type": "clip",
      "clip_start": 30,
      "clip_end": 75,
      "fade_in": 2,
      "fade_out": 3,
      "volume": 80
    }
  },
  "outro": {...},
  "transition": {...}
}
```

#### Schéma Actuel Implémenté:
```json
"music": "music_id_simple_string"
```

**Gap**: ❌ Schéma incompatible, fonctionnalités critiques manquantes:
- [ ] Clips (start/end timestamps)
- [ ] Fade in/out
- [ ] Volume par musique
- [ ] Point de départ (Hook, Climax, Custom)

---

### 4.3 Domaine: Métadonnées Musicales

**Planifié**: 30+ champs par piste (PRD.md section 9.2)
**Implémenté**: ~8 champs basiques

| Catégorie Métadonnées | Planifié | Implémenté |
|----------------------|----------|------------|
| **Basic** | 6 champs | 6 champs ✅ |
| - id, title, artist, album, duration, cover_art | ✅ | ✅ |
| **Technical** | 7 champs | ❌ 0 champs |
| - tempo, key, mode, spectral_centroid, vocal_instrumental, instruments, energy_level | ✅ | ❌ |
| **Emotional** | 4 champs | ❌ 0 champs |
| - arousal, valence, dominance, discrete_emotions | ✅ | ❌ |
| **Structural** | 6 champs | ❌ 0 champs |
| - sections (intro/verse/chorus/outro timestamps), climax_timestamp, clip_start, clip_end | ✅ | ❌ |
| **Tagging** | 3 champs | ❌ 0 champs |
| - scenarios, moods, styles | ✅ | ❌ |

**Total**: 26/30+ champs manquants (87% incomplet)

**Conséquence**: ❌ Filtres avancés impossibles, recherche par scénario impossible

---

### 4.4 Domaine: Mode Live

**Planifié**: 2 interfaces complètes (MC + Son) avec synchronisation WebSocket
**Implémenté**: 0%

| Composant | MC Live | Son Live |
|-----------|---------|----------|
| Page route | ❌ `/matches/:id/live/mc` | ❌ `/matches/:id/live/sound` |
| Chronomètre | ❌ `LiveTimer.vue` | ✅ (sync display) |
| Score | ❌ `ScoreBoard.vue` | N/A |
| Progression | ❌ `ProgressionList.vue` | ✅ (sync display) |
| Lecteur Audio | N/A | ❌ `SoundLivePlayer.vue` |
| Recherche Bruitages | N/A | ❌ `QuickSearch.vue` |
| WebSocket | ❌ 0% | ❌ 0% |

**Conséquence**: 🔴 **APPLICATION INUTILISABLE EN PRODUCTION** - Pas de gestion de spectacle en temps réel

---

### 4.5 Domaine: PWA & Offline

**Planifié**: Architecture hybride Cache Storage + IndexedDB
**Implémenté**: 0%

| Feature PWA | Statut | Conséquence |
|------------|--------|-------------|
| **vite-plugin-pwa** installé | ❌ | Pas de Service Worker |
| **Manifest.json** | ❌ | Pas installable sur smartphones |
| **Cache Storage API** (bruitages) | ❌ | Bruitages non disponibles offline |
| **IndexedDB** (chansons) | ❌ | Chansons non disponibles offline |
| **Téléchargement progressif** | ❌ | Pas de tracking progress |
| **Offline detection** | ❌ | Pas de feedback utilisateur |
| **Interface MC smartphone** | ❌ | MC doit utiliser laptop sur scène |

**Conséquence**: 🔴 **IMPOSSIBLE D'UTILISER SANS CONNEXION INTERNET** - Critique pour spectacles live

---

### 4.6 Domaine: UX/UI

**Planifié**: Design system complet avec glassmorphisme (FRONTEND_RULES.md + WIREFRAMES.md)
**Implémenté**: ~30%

| Élément Design | Statut | Gap |
|---------------|--------|-----|
| **Design Tokens** (variables CSS) | ❌ | Valeurs en dur dans composants |
| **Classes utilitaires** | ❌ | Styles inline ou scoped |
| **Glassmorphisme** | 🟡 Partiel | Appliqué manuellement, pas de classe `.glass` |
| **Drag & Drop visuel** | ❌ | Pas de feedback, pas de drop zones |
| **Animations** | ❌ | Pas de transitions, pas de pulse |
| **Responsive** | 🟡 Partiel | Desktop OK, smartphone incomplet |
| **Accessibilité** | ❌ | Pas de labels ARIA, pas de focus visible |

---

### 4.7 Domaine: Backend

**Planifié**: API RESTful complète + WebSocket + Stockage JSON
**Implémenté**: ~50%

| Endpoint API | Statut | Notes |
|-------------|--------|-------|
| GET/POST/PUT/DELETE `/api/matches` | ✅ | Fonctionnel mais schema incompatible |
| GET `/api/matches/:id` | ✅ | OK |
| GET `/api/music` | ✅ | OK mais pas de filtres |
| GET `/api/music/:id` | ❌ | Manquant |
| GET `/api/personnel` | ❌ | Route existe mais pas de données |
| POST `/api/auth/login` | ❌ | Pas d'authentification |
| WebSocket Events | ❌ | Socket.IO pas configuré |
| GET `/api/templates` | ❌ | Pas implémenté |

---

## 5. Recommandations de Priorisation

### 5.1 Sprint Immédiat (1-2 semaines) - MVP Live

**Objectif**: Rendre l'application utilisable pour un spectacle test

#### Tâches Priorité P0 (Bloquantes):
1. **Mode Live MC** (3 jours):
   - [ ] Page `/matches/:id/live/mc`
   - [ ] Composant `LiveTimer.vue` (chronomètre fonctionnel)
   - [ ] Composant `ProgressionList.vue` (liste lignes + passage suivante)
   - [ ] Composant `ScoreBoard.vue` (score ± points)

2. **Mode Live Son** (3 jours):
   - [ ] Page `/matches/:id/live/sound`
   - [ ] Composant `SoundLivePlayer.vue` (lecteur audio HTML5)
   - [ ] Affichage musiques ligne actuelle (INTRO/OUTRO/TRANSITION)
   - [ ] Boutons [▶️ JOUER INTRO/OUTRO/TRANSITION]

3. **WebSocket Synchronisation Basique** (2 jours):
   - [ ] Setup Socket.IO server + client
   - [ ] Events: `line_started`, `chrono_update`
   - [ ] Synchronisation ligne active MC → Son
   - [ ] Synchronisation chrono MC → Son (lecture seule)

4. **Extension Schéma 3 Points Musicaux** (1 jour):
   - [ ] Modifier backend schema: `music: { intro: {...}, outro: {...}, transition: {...} }`
   - [ ] Migration données existantes
   - [ ] Adapter frontend pour utiliser nouveau schema

**Total**: ~9 jours → **Sprint 1-2 semaines**

**Livrable**: Application utilisable pour spectacle test (fonctionnalités basiques Mode Live)

---

### 5.2 Sprint Court Terme (3-4 semaines) - Confort d'Usage

**Objectif**: Améliorer l'expérience utilisateur pour usage régulier

#### Tâches Priorité P1 (Importantes):
1. **Types de Lignes Complets** (2 jours):
   - [ ] Implémenter les 8 types de lignes
   - [ ] Formulaires spécifiques par type dans modal

2. **Template Standard** (1 jour):
   - [ ] Créer `/api/templates/standard` endpoint
   - [ ] Bouton [📋 Charger template standard] fonctionnel
   - [ ] Template 19 lignes pré-rempli

3. **Drag & Drop Assignation** (2 jours):
   - [ ] Install `vue-draggable-next`
   - [ ] Drag cartes musiques vers zones INTRO/OUTRO/TRANSITION
   - [ ] Feedback visuel (drop zones highlight)

4. **Modal Édition Musique** (2 jours):
   - [ ] Composant `MusicSettings.vue`
   - [ ] Settings: Type lecture, Clip, Fade in/out, Volume
   - [ ] Preview configuration

5. **Filtres Bibliothèque Fonctionnels** (2 jours):
   - [ ] Filtres scenarios (checkboxes)
   - [ ] Filtre tempo (range slider)
   - [ ] Recherche texte (debounce 300ms)
   - [ ] Résultats filtrés en temps réel côté client

**Total**: ~9 jours → **Sprint 3-4 semaines**

**Livrable**: Application confortable pour usage régulier (workflow complet Préparation + Live)

---

### 5.3 Sprint Moyen Terme (5-8 semaines) - Robustesse

**Objectif**: Stabilité production + Offline-first

#### Tâches Priorité P1-P2:
1. **PWA Configuration** (3 jours):
   - [ ] Install + config `vite-plugin-pwa`
   - [ ] Manifest.json
   - [ ] Service Worker généré

2. **Cache Offline Hybride** (4 jours):
   - [ ] IndexedDB pour chansons (`/utils/audioCache.js`)
   - [ ] Cache Storage pour bruitages
   - [ ] Téléchargement progressif avec progress tracking
   - [ ] Bouton "💾 Télécharger tout"

3. **Interface MC Smartphone** (3 jours):
   - [ ] Page `/matches/:id/live/mc-mobile`
   - [ ] Layout touch-optimized (boutons 48x48px)
   - [ ] Mode offline lecture seule
   - [ ] Swipe gestures

4. **Pipeline Analyse Musicale** (5 jours):
   - [ ] Script Python scan 777 fichiers
   - [ ] Extraction métadonnées complètes (Librosa, Essentia)
   - [ ] Génération `music_library.json` enrichi
   - [ ] Tags manuels pour ~50 pistes clés

5. **Logging & Monitoring** (2 jours):
   - [ ] Winston ou Pino logging structuré
   - [ ] Rotation logs quotidienne
   - [ ] Format LLM-friendly

**Total**: ~17 jours → **Sprint 5-8 semaines**

**Livrable**: Application robuste pour production (offline-first, monitoring, bibliothèque complète)

---

### 5.4 Sprint Long Terme (9-12+ semaines) - Features Avancées

**Objectif**: Fonctionnalités admin + UX polish

#### Tâches Priorité P3:
1. **Authentification Complète** (4 jours):
   - [ ] Backend: bcrypt + JWT
   - [ ] Routes login/logout/register
   - [ ] Réinitialisation mot de passe par email
   - [ ] Frontend: Pages login, composable `useAuth.js`

2. **Permissions & Rôles** (2 jours):
   - [ ] Middleware authentification
   - [ ] 4 rôles: Admin, MC, Son, Membre
   - [ ] Navigation Guards

3. **Interface Admin** (3 jours):
   - [ ] Gestion utilisateurs (CRUD)
   - [ ] Impersonation
   - [ ] Visualisation logs

4. **UX Polish** (3 jours):
   - [ ] Animations & transitions
   - [ ] Accessibilité (ARIA, contraste)
   - [ ] Responsive final tablette

5. **Tests Utilisateur & Documentation** (2 jours):
   - [ ] Session tests avec Julie + Marc
   - [ ] Guide utilisateur PDF/MD

**Total**: ~14 jours → **Sprint 9-12+ semaines**

**Livrable**: Application complète v2.0 selon PRD

---

## 6. Prochaines Étapes Immédiates

### 6.1 Actions Critiques (Cette Semaine)

#### 🔴 Priorité Absolue (72h):
1. **Décision Architecture**:
   - [ ] Valider approche MVP (Mode Live basique sans toutes les features)
   - [ ] Confirmer priorités avec utilisateurs (Julie, Marc)

2. **Setup WebSocket**:
   - [ ] Install `socket.io` + `socket.io-client`
   - [ ] Config Express Socket.IO server
   - [ ] Créer composable `useWebSocket.js`
   - [ ] Tester connexion basique MC ↔ Serveur ↔ Son

3. **Créer Pages Mode Live**:
   - [ ] Route `/matches/:id/live/mc`
   - [ ] Route `/matches/:id/live/sound`
   - [ ] Layout basique (sans fonctionnalités)

#### 🟡 Priorité Haute (7 jours):
4. **Implémenter Chronomètre MC**:
   - [ ] Composant `LiveTimer.vue`
   - [ ] État local: running/paused/stopped
   - [ ] Emit `chrono_update` via WebSocket chaque seconde
   - [ ] Boutons: Démarrer / Pause / Stop / Reset

5. **Synchronisation Chrono Son**:
   - [ ] Listen `chrono_update` event
   - [ ] Affichage chrono synchronisé (lecture seule)
   - [ ] Test latence < 1 seconde

6. **Progression Lignes**:
   - [ ] Composant `ProgressionList.vue`
   - [ ] Affichage lignes avec statut (✅ ⏳ 🔴)
   - [ ] Bouton [⏭️ Passer ligne suivante]
   - [ ] Emit `line_started` event

### 6.2 Validation Étape par Étape

**Milestone 1** (Fin semaine 1):
- [ ] WebSocket fonctionne (MC → Serveur → Son)
- [ ] Chronomètre MC démarre et s'affiche chez Son
- [ ] Passage ligne suivante synchronisé

**Milestone 2** (Fin semaine 2):
- [ ] Score modifiable par MC
- [ ] Lecteur audio basique chez Son (HTML5 Audio)
- [ ] Son peut jouer musique assignée (1 point simple)

**Milestone 3** (Fin semaine 3-4):
- [ ] Extension schema 3 points musicaux
- [ ] Son affiche INTRO/OUTRO/TRANSITION
- [ ] Test spectacle complet avec Julie + Marc

---

## 7. Métriques de Succès

### 7.1 Critères d'Acceptation MVP

**Phase Live Fonctionnelle**:
- ✅ Julie peut lancer chrono et passer aux lignes suivantes
- ✅ Marc voit chrono et ligne active synchronisés (< 1 sec latence)
- ✅ Marc peut jouer musiques assignées (INTRO/OUTRO/TRANSITION)
- ✅ Julie peut modifier score en temps réel
- ✅ Test spectacle complet 1h30 sans bug bloquant

**Phase Préparation Améliorée**:
- ✅ Julie crée feuille complète (8 types de lignes) en < 10 minutes
- ✅ Marc assigne musiques (3 points par ligne) en < 30 minutes
- ✅ Drag & drop fluide et intuitif
- ✅ Modal édition musique (fade, clip, volume) fonctionnelle

**Phase Offline**:
- ✅ Application installable sur smartphone iOS/Android
- ✅ Toutes musiques assignées disponibles offline
- ✅ Tous bruitages (~100) disponibles offline
- ✅ Mode Live fonctionne sans connexion (lecture seule MC)

### 7.2 KPIs de Performance

| Métrique | Cible | Actuel | Gap |
|----------|-------|--------|-----|
| **Temps création feuille** | < 10 min | ~20 min | 🔴 -100% |
| **Temps assignation musiques** | < 30 min | ~45 min | 🔴 -50% |
| **Latence synchronisation** | < 1 sec | N/A | 🔴 N/A |
| **Taux succès spectacle** | > 95% | 0% | 🔴 -100% |
| **Chargement initial** | < 3 sec | ~2 sec | ✅ OK |
| **Recherche musicale** | < 500 ms | ~1 sec | 🟡 -50% |

---

## 8. Risques & Dépendances

### 8.1 Risques Techniques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| **WebSocket déconnexions fréquentes** | Moyenne | Critique | Heartbeat adaptatif + reconnexion auto |
| **Quota IndexedDB insuffisant** | Faible | Élevé | Limit download à musiques assignées seulement |
| **Latence synchronisation > 2 sec** | Moyenne | Élevé | Optimiser events (throttle), tester réseau 4G |
| **Incompatibilité schema frontend/backend** | Élevée | Critique | Migration progressive avec adapters temporaires |
| **Performance 777 musiques** | Faible | Moyen | Virtualisation (vue-virtual-scroller) |

### 8.2 Dépendances Bloquantes

1. **Utilisateurs Tests** (Julie MC, Marc Son):
   - Disponibilité pour tests réguliers
   - Feedback rapide sur UX/bugs

2. **Bibliothèque Musicale Complète**:
   - Accès OneDrive 777 fichiers
   - Temps d'exécution pipeline Python (~2-3h)

3. **Serveur Production**:
   - Hostinger Cloud configuré
   - HTTPS obligatoire pour PWA

---

## 9. Conclusion

### 9.1 État Actuel vs Vision

**Vision PRD**: Application complète PWA offline-first pour gestion matchs impro avec synchronisation temps réel

**Réalité Actuelle**: Prototype basique avec création feuille de match limitée et bibliothèque musicale sans filtres

**Gap Principal**: 🔴 **Mode Live complètement absent** - Cœur de l'application non implémenté

### 9.2 Chemin Critique vers Production

**Priorités absolues**:
1. Mode Live (MC + Son) → **9 jours**
2. WebSocket sync → **2 jours**
3. Extension schema 3 points → **1 jour**

**Total minimum viable**: **~12 jours de développement**

### 9.3 Recommandation Finale

**Option A - MVP Rapide (3 semaines)**:
- Focus Mode Live basique
- Ignore pipeline analyse musicale (utiliser bibliothèque actuelle)
- Ignore PWA offline (utiliser avec connexion obligatoire)
- Permet tests production rapides

**Option B - Complet Phase 1-3 (6 semaines)**:
- Mode Live + 3 points + Drag & Drop + Filtres
- Bibliothèque 777 pistes enrichies
- Workflow complet mais pas d'offline

**Option C - Selon PRD Original (20 semaines)**:
- Toutes les 6 phases
- PWA offline-first
- Authentification + Admin

**💡 Recommandation**: **Option A** pour validation rapide avec utilisateurs réels, puis itération selon feedback.

---

*Fin de l'analyse - Document généré le 22 octobre 2025*
