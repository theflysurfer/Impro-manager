# 🚀 Plan d'Action Technique - Impro Manager v2.0

**Roadmap de développement technique**
*Version 2.0 - Octobre 2025*

---

## Table des Matières

1. [Vue d'Ensemble](#1-vue-densemble)
2. [Stack Technique](#2-stack-technique)
3. [Phase 1 : Fondations](#3-phase-1--fondations-sprint-1-2)
4. [Phase 2 : Bibliothèque Musicale](#4-phase-2--bibliothèque-musicale-sprint-3-4)
5. [Phase 3 : Assignation Musicale](#5-phase-3--assignation-musicale-sprint-5-6)
6. [Phase 4 : Mode Live & Synchronisation](#6-phase-4--mode-live--synchronisation-sprint-7-8)
7. [Phase 5 : PWA & Optimisation](#7-phase-5--pwa--optimisation-sprint-9-10)
8. [Phase 6 : Admin & Features Avancées](#8-phase-6--admin--features-avancées-v2-sprint-11)
9. [Prochaines Étapes Immédiates](#9-prochaines-étapes-immédiates)

---

## 1. Vue d'Ensemble

### 1.1 Objectif Global

Développer **Impro Manager v2.0** en 10 sprints de 2 semaines (20 semaines = 5 mois).

**Livrable final :**
- Application web complète MC + Son
- Mode Préparation + Mode Live
- Bibliothèque musicale 777+ pistes avec métadonnées enrichies
- Synchronisation temps réel WebSocket
- Utilisable en production pour 100% des matchs de la troupe

### 1.2 Stratégie de Développement

**Approche incrémentale :**
- Chaque phase livre une fonctionnalité complète et testable
- Validation avec utilisateurs réels (Julie MC, Marc Son) à la fin de chaque phase
- Pivot possible en cours de route selon feedback

**Priorités :**
1. **Valeur utilisateur** : Features les plus critiques d'abord
2. **Risque technique** : Tackle les challenges complexes tôt (WebSocket, analyse audio)
3. **Dépendances** : Respecter l'ordre logique (feuille de match avant assignation musicale)

---

## 2. Stack Technique

### 2.1 Frontend

**Framework :**
- **Vue.js 3.4+** avec Composition API
- **TypeScript** (optionnel, recommandé pour V2)
- **Vite** comme bundler (rapide, hot reload)

**PWA (Progressive Web App) :**
- **Service Worker** : Workbox (via vite-plugin-pwa)
- **Cache Storage API** : Chansons assignées + tous les bruitages
- **Offline-first strategy** :
  - MC smartphone : **Lecture seule** offline (pas de modifications)
  - Son laptop : **Fonctionnalités complètes** offline
- **Manifest.json** : Installable sur iOS/Android/Desktop

**UI & Styling :**
- **CSS custom** (pas de framework lourd, esthétique glassmorphisme)
- **Vue Draggable** (vue.draggable.next) pour drag & drop
- **Vue Router** pour navigation
- **Pinia** pour state management (optionnel, peut utiliser Composition API seule)

**Audio :**
- **HTML5 Audio API** (natif)
- **Pre-loading strategy** : INTRO/OUTRO/TRANSITION de ligne actuelle + suivante
- **WaveSurfer.js** (optionnel pour waveform visualisation V2)

**WebSocket Client :**
- **Socket.IO Client** (v4+)
- **Reconnexion automatique** si déconnexion
- **Heartbeat adaptatif** : 5 sec (desktop), 10 sec (smartphone)

---

### 2.2 Backend

**Framework :**
- **Express.js** (Node.js 18+)
- **TypeScript** (optionnel)

**Hébergement :**
- **Hostinger Cloud** (production)
- **Stockage** : 200 GB
- **Organisation fichiers** :
  - `/audio/songs/` : Chansons (2-5 min, 777+ fichiers, ~150-250 MB)
  - `/audio/sfx/` : Bruitages (1-10 sec, ~100 fichiers, ~10 MB)
  - `/data/` : Fichiers JSON (matchs, personnel, bibliothèque)
  - `/logs/` : Logs applicatifs

**WebSocket Server :**
- **Socket.IO** (v4+)
- **Heartbeat** : 10 sec (smartphone), 5 sec (desktop)

**Stockage :**
- **Fichiers JSON** (phase initiale)
  - `/data/matches/match_*.json`
  - `/data/personnel/personnel.json`
  - `/data/music/songs_library.json`
  - `/data/music/sfx_library.json`
- **Migration DB future** : MongoDB ou PostgreSQL (V2)

**API :**
- **RESTful API** :
  - GET/POST/PUT/DELETE `/api/matches`
  - GET `/api/music/songs` (avec filtres)
  - GET `/api/music/sfx` (bruitages)
  - GET/POST `/api/personnel`
  - GET/POST `/api/auth` (authentification - Phase 6)

**Serveur Audio :**
- **Fichiers statiques** servis par Express
- **Chansons** : `/audio/songs/*`
- **Bruitages** : `/audio/sfx/*`
- **Cache headers** : Optimisé pour PWA Cache Storage API

---

### 2.3 Analyse Musicale (Pipeline séparé)

**Langage :**
- **Python 3.10+**

**Bibliothèques :**
- **Librosa** : Analyse audio technique (tempo, spectral centroid, etc.)
- **Essentia** : Extraction features audio avancées
- **Modèles ML** (Hugging Face, TensorFlow) : Arousal-Valence-Dominance
- **Mutagen** : Extraction métadonnées fichiers (ID3 tags)

**Output :**
- `music_library.json` généré
- Exécution manuelle (script indépendant)
- Mise à jour : Relance script si nouvelles pistes ajoutées

---

### 2.4 DevOps & Tooling

**Versioning :**
- **Git** + **GitHub**

**Linting & Formatting :**
- **ESLint** + **Prettier** (JavaScript/Vue)
- **Black** (Python)

**Testing :**
- **Vitest** (tests unitaires Vue)
- **Playwright** (tests E2E, optionnel V2)

**Build & PWA :**
- **vite-plugin-pwa** : Génération Service Worker automatique
- **Workbox** : Stratégies de cache (CacheFirst, NetworkFirst)
- **Build production** : `npm run build` → génère `/dist` avec SW

**Environnement :**
- **Dev** :
  - Frontend : localhost:5173 (Vite dev server)
  - Backend : localhost:3001 (Express)
  - WebSocket : localhost:3001
- **Prod** :
  - **Hostinger Cloud** (hébergement principal)
  - Domain : TBD (ex: impro-manager.troupe.com)
  - HTTPS : Requis pour PWA et Service Worker
  - Deploy : FTP/SFTP ou Git hooks

**Logging Production :**
- **Winston** ou **Pino** pour logs structurés
- **Rotation** : Logs quotidiens (`app-2025-10-10.log`)
- **Accès** : `/logs/` (Admin uniquement)
- **Format LLM-friendly** : `[timestamp] [level] [context] message`

---

## 3. Phase 1 : Fondations (Sprint 1-2)

### 3.1 Objectif

Créer, éditer et stocker des feuilles de match fonctionnelles.

**Livrable :** Julie (MC) peut créer une feuille de match complète en < 10 minutes.

---

### 3.2 Sprint 1 : Backend API + Structure Données

**Durée :** 2 semaines

**Tâches Backend :**

1. **Setup projet Express.js**
   - Initialiser repo Git
   - Structure dossiers :
     ```
     /backend
       /routes
       /controllers
       /models
       /data
         /matches
         /personnel
         /music
       server.js
     ```
   - Install dépendances : `express`, `cors`, `socket.io`, `nodemon`

2. **Modèles de données**
   - Créer schémas JSON :
     - `match.schema.json` (validation avec `ajv`)
     - `personnel.schema.json`
   - Exemples fixtures pour tests

3. **API CRUD Matchs**
   - `POST /api/matches` : Créer match
   - `GET /api/matches/:id` : Récupérer match
   - `PUT /api/matches/:id` : Modifier match
   - `DELETE /api/matches/:id` : Supprimer match
   - `GET /api/matches` : Liste tous les matchs

4. **API Personnel**
   - `GET /api/personnel` : Liste personnel troupe
   - `POST /api/personnel` : Ajouter membre (V2)

5. **Stockage JSON**
   - Fonctions lecture/écriture fichiers JSON
   - Gestion IDs uniques (`match_001`, `match_002`, etc.)
   - Timestamps created_at/updated_at automatiques

6. **Tests API**
   - Tester tous endpoints avec Postman/Insomnia
   - Créer collection de tests

**Validation Sprint 1 :**
- ✅ API CRUD complète fonctionnelle
- ✅ Stockage JSON opérationnel
- ✅ Tests manuels passés

---

### 3.3 Sprint 2 : Frontend Interface MC Préparation

**Durée :** 2 semaines

**Tâches Frontend :**

1. **Setup projet Vue.js**
   - Initialiser Vite + Vue 3
   - Structure dossiers :
     ```
     /frontend
       /src
         /components
         /views
         /composables
         /assets
         App.vue
         main.js
     ```
   - Install : `vue-router`, `axios`, `vue-draggable-next`

2. **Routing**
   - Pages :
     - `/` → Accueil
     - `/matches` → Liste matchs
     - `/matches/new` → Créer match
     - `/matches/:id/edit` → Éditer match (MC)
   - Navigation header

3. **Composants de base**
   - `MatchLine.vue` : Ligne de feuille de match
   - `LineEditor.vue` : Modal d'édition ligne
   - `InfoGenerales.vue` : Formulaire infos match

4. **Vue Création Match (MC)**
   - Formulaire infos générales (date, lieu, équipes)
   - Sélection personnel (dropdowns depuis API)
   - Template standard (bouton charger 19 lignes)
   - Ajout/suppression/édition lignes dynamique
   - **Drag & drop** réorganisation (vue-draggable-next)

5. **Types de Lignes**
   - Implémenter les 8 types :
     - ARRIVÉE, ÉCHAUFFEMENT, PRÉSENTATION, SÉQUENCE,
       ANNONCE INTERMÉDIAIRE, PAUSE, ANNONCE FIN, FIN
   - Formulaires spécifiques par type dans modal

6. **Sauvegarde**
   - Sauvegarde auto toutes les 30 secondes
   - Bouton sauvegarder manuel
   - Appel API `PUT /api/matches/:id`
   - Toast confirmations

**Validation Sprint 2 :**
- ✅ Julie peut créer feuille complète en < 10 minutes
- ✅ Tous types de lignes fonctionnels
- ✅ Drag & drop réorganisation OK
- ✅ Sauvegarde persistante

**Validation Phase 1 Complète :**
- ✅ Démonstration à Julie
- ✅ Feedback recueilli
- ✅ Tests création 3 feuilles de match réelles

---

## 4. Phase 2 : Bibliothèque Musicale (Sprint 3-4)

### 4.1 Objectif

Bibliothèque musicale avec métadonnées enrichies et filtres puissants.

**Livrable :** Marc (Son) trouve une musique Western en < 30 secondes.

---

### 4.2 Sprint 3 : Pipeline Analyse Musicale

**Durée :** 2 semaines

**Tâches Python :**

1. **Setup environnement Python**
   - Créer `/music-analyzer` dossier
   - Virtual env : `python -m venv venv`
   - Install : `librosa`, `essentia`, `mutagen`, `pandas`

2. **Script scan fichiers audio**
   - Parcourir dossier OneDrive musiques (777+ fichiers)
   - Lister tous `.mp3`, `.wav`, `.flac`
   - Générer liste fichiers avec chemins absolus

3. **Extraction métadonnées de base**
   - Titre, Artiste, Album (via Mutagen)
   - Durée, Format, Bitrate
   - Cover art (extraction image)

4. **Analyse audio technique**
   - **Tempo (BPM)** : Librosa `beat.tempo()`
   - **Tonalité/Key** : Essentia `KeyExtractor`
   - **Mode** : Majeur/Mineur
   - **Spectral Centroid** : Brillance son
   - **Vocal/Instrumental** : Détection voix (Essentia)
   - **Instruments dominants** : Classification (modèle pré-entraîné)

5. **Analyse émotionnelle (simplifié V1)**
   - **Arousal** : Basé sur tempo + energy
     - Rapide + fort → Arousal élevé
     - Lent + doux → Arousal faible
   - **Valence** : Basé sur mode (majeur/mineur) + harmonie
     - Majeur → Valence positive
     - Mineur → Valence négative
   - **Dominance** : Basé sur dynamique + intensité
   - Tags émotions discrètes (mapping simple)

6. **Détection structure**
   - **Sections** : Intro/Verse/Chorus/Outro (Essentia `SBICSegmenter`)
   - **Climax** : Point max energy
   - **Clip auto** : Sélection meilleur extrait 30-45 sec

7. **Génération `music_library.json`**
   - Format conforme schéma PRD (section 9.2)
   - Un objet par piste avec toutes métadonnées
   - Sauvegarde dans `/backend/data/music/music_library.json`

8. **Tags manuels initiaux**
   - Ajouter manuellement scenarios pour ~50 pistes clés
   - Exemples : Western, Romance, Action, Comédie, etc.
   - Base pour suggestions futures

**Validation Sprint 3 :**
- ✅ `music_library.json` généré avec 777+ pistes
- ✅ Métadonnées complètes (30+ champs par piste)
- ✅ Vérification qualité sur 20 pistes échantillon

---

### 4.3 Sprint 4 : Interface Bibliothèque + Filtres

**Durée :** 2 semaines

**Tâches Backend :**

1. **API Musiques**
   - `GET /api/music` : Liste toutes musiques
   - `GET /api/music/:id` : Détails musique
   - **Filtres query params** :
     - `?scenarios=Western,Action`
     - `?tempo_min=100&tempo_max=140`
     - `?vocal=true`
     - `?search=showdown`
   - Implémentation filtrage en mémoire (JSON)

2. **Serveur fichiers audio**
   - Route statique : `/audio/*` → Servir fichiers mp3
   - Copier fichiers depuis OneDrive vers `/backend/public/music/` (ou symbolic link)
   - Headers CORS pour lecture cross-origin

**Tâches Frontend :**

1. **Composants Bibliothèque**
   - `MusicCard.vue` : Carte musique (grille)
   - `MusicFilters.vue` : Panel filtres (scenarios, tempo, émotions)
   - `AudioPlayer.vue` : Lecteur preview compact

2. **Page Bibliothèque**
   - Route `/music` (accessible indépendamment)
   - Layout : Filtres (gauche) | Grille musiques (droite)
   - Appel API `GET /api/music` au mount

3. **Filtres interactifs**
   - **Scenarios** : Checkboxes multi-sélection
   - **Tempo** : Range slider (60-180 BPM)
   - **Vocal/Instrumental** : Checkboxes
   - **Recherche texte** : Input avec debounce 300ms
   - **Émotions** : Sliders Valence/Arousal (avancé, collapsible)
   - Filtres appliqués côté client (réactif)

4. **Affichage Grille**
   - Grille responsive (3-4 colonnes desktop, 2 tablet, 1 mobile)
   - Pagination ou virtualisation (si > 100 résultats)
   - Tri : Énergie, Titre, Durée, BPM

5. **Lecteur Preview**
   - Click [▶️] carte → Charge dans lecteur bas de page
   - Play/Pause/Stop
   - Progress bar
   - Volume slider
   - Bouton [🎬 Clip] → Joue extrait clippé

**Validation Sprint 4 :**
- ✅ Marc trouve musique Western en < 30 secondes
- ✅ Filtres fonctionnels et réactifs
- ✅ Lecteur preview opérationnel
- ✅ 777 pistes affichées correctement

**Validation Phase 2 Complète :**
- ✅ Démonstration à Marc
- ✅ Tests recherche sur 10 scenarios différents
- ✅ Feedback qualité métadonnées

---

## 5. Phase 3 : Assignation Musicale (Sprint 5-6)

### 5.1 Objectif

Drag & drop musiques depuis bibliothèque vers feuille de match.

**Livrable :** Marc assigne musiques pour un match complet en < 30 minutes.

---

### 5.2 Sprint 5 : Backend Assignations + Frontend Layout

**Durée :** 2 semaines

**Tâches Backend :**

1. **Extension modèle Match**
   - Ajouter champs `music` à chaque ligne :
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
       "outro": null,
       "transition": null
     }
     ```
   - Validation schéma

2. **API Assignation**
   - Endpoint existant `PUT /api/matches/:id` suffit
   - Mise à jour musiques dans JSON
   - Validation : `music_id` existe dans `music_library.json`

**Tâches Frontend :**

1. **Page Son Préparation**
   - Route `/matches/:id/sound-prep`
   - Layout split-screen :
     - Gauche (30%) : Feuille de match (lecture seule structure)
     - Droite (70%) : Bibliothèque musicale

2. **Composant Feuille de Match (Son)**
   - `SoundMatchSheet.vue`
   - Affichage lignes (séquences seulement en V1)
   - 3 zones par ligne : INTRO / OUTRO / TRANSITION
   - Zones vides : `[+ Assigner]`
   - Zones remplies : `✅ [🎸 Titre 2:45] [✏️] [🗑️]`

3. **Intégration Bibliothèque**
   - Réutiliser composants Sprint 4
   - Filtres visibles
   - Grille musiques drag-enabled

**Validation Sprint 5 :**
- ✅ Layout split-screen fonctionnel
- ✅ Feuille de match affichée côté gauche
- ✅ Bibliothèque fonctionnelle côté droit

---

### 5.3 Sprint 6 : Drag & Drop + Édition

**Durée :** 2 semaines

**Tâches Frontend :**

1. **Implémentation Drag & Drop**
   - Cartes musiques : `draggable="true"`
   - Zones INTRO/OUTRO/TRANSITION : `droppable`
   - Event handlers :
     - `@dragstart` : Stocker music_id
     - `@dragover` : Highlight zone drop
     - `@drop` : Assignation musique
   - Appel API `PUT /api/matches/:id` après drop

2. **Composant Édition Musique**
   - `MusicSettings.vue` (modal)
   - Déclencheur : Click [✏️] sur musique assignée
   - Formulaire :
     - Type lecture : Entier / Clip auto / Clip custom
     - Point de départ : 0:00 / Hook / Climax / Custom
     - Fade in/out (sliders)
     - Volume (slider)
   - Visualisation timeline musique (sections)
   - Preview configuration

3. **Sauvegarde Assignations**
   - Auto-save après chaque assignation (debounce 1 sec)
   - Toast confirmations
   - Indicateur : "⚠️ X musiques non assignées"

4. **Actions supplémentaires**
   - [🗑️ Retirer] : Supprimer assignation
   - Popup confirmation si musique déjà assignée ailleurs

**Validation Sprint 6 :**
- ✅ Drag & drop fluide et fonctionnel
- ✅ Assignations sauvegardées persistantes
- ✅ Édition musique opérationnelle
- ✅ Marc assigne 8 séquences en < 30 minutes

**Validation Phase 3 Complète :**
- ✅ Démonstration à Marc
- ✅ Test assignation match complet (8 séquences × 3 points)
- ✅ Feedback UX drag & drop

---

## 6. Phase 4 : Mode Live & Synchronisation (Sprint 7-8)

### 6.1 Objectif

Mode Live + synchronisation temps réel WebSocket MC ↔ Son.

**Livrable :** Julie et Marc coordonnent un spectacle complet sans incident.

---

### 6.2 Sprint 7 : WebSocket + Interface MC Live

**Durée :** 2 semaines

**Tâches Backend :**

1. **Setup Socket.IO Server**
   - Intégrer Socket.IO à Express
   - Rooms par match : `match_{match_id}`
   - Événements :
     - `join_match` : Client rejoint room
     - `live_mode_activated`
     - `line_started`
     - `chrono_update`
     - `line_completed`

2. **Gestion Rooms**
   - Client MC/Son s'identifie (role + match_id)
   - Serveur broadcast événements dans room
   - Logging événements pour debug

3. **Persistance État Live**
   - Ajouter champs au JSON match :
     - `live_state.current_line_id`
     - `live_state.chrono_elapsed`
     - `live_state.chrono_status` (running/paused/stopped)
   - Mise à jour temps réel

**Tâches Frontend :**

1. **Setup Socket.IO Client**
   - Install `socket.io-client`
   - Composable `useWebSocket.js` :
     - Connexion au serveur
     - Join room match
     - Emit/Listen événements
   - Reconnexion automatique si déconnexion

2. **Page MC Mode Live**
   - Route `/matches/:id/live/mc`
   - Layout selon wireframe (section 2.2)
   - Composants :
     - `LiveTimer.vue` : Chronomètre
     - `ScoreBoard.vue` : Gestion score
     - `ProgressionList.vue` : Liste lignes

3. **Chronomètre**
   - Décompte manuel (pas automatique)
   - Boutons : Démarrer / Pause / Stop / Reset
   - Affichage : Écoulé / Total / Restant
   - Emit `chrono_update` chaque seconde si running

4. **Passage Ligne**
   - Bouton [⏭️ Passer ligne suivante]
   - Auto si chrono = 0:00 (popup confirmation)
   - Emit `line_started` avec nouvelle ligne
   - Emit `line_completed` pour ancienne ligne

5. **Toggle Mode Live**
   - Bouton dans MC Préparation : [🔄 Mode Live →]
   - Confirmation popup
   - Transition route vers `/live/mc`
   - Emit `live_mode_activated`

**Validation Sprint 7 :**
- ✅ WebSocket connecté et stable
- ✅ Interface MC Live fonctionnelle
- ✅ Chronomètre opérationnel
- ✅ Événements émis correctement

---

### 6.3 Sprint 8 : Interface Son Live + Synchronisation

**Durée :** 2 semaines

**Tâches Frontend :**

1. **Page Son Mode Live**
   - Route `/matches/:id/live/sound`
   - Layout selon wireframe (section 4.2)
   - Composants :
     - `SoundLivePlayer.vue` : Lecteur principal
     - `LiveMusicAssignments.vue` : Musiques ligne actuelle
     - `QuickSearch.vue` : Recherche rapide bruitages

2. **Synchronisation Ligne Active**
   - Listen `line_started` :
     - Mise à jour "EN COURS"
     - Affichage musiques INTRO/OUTRO/TRANSITION
     - Reset lecteur
   - Listen `chrono_update` :
     - Affichage chrono synchronisé (temps restant)

3. **Lecteur Audio Principal**
   - Boutons [▶️ JOUER INTRO/OUTRO/TRANSITION]
   - Click → Charge musique avec settings
   - Play avec fade in, volume, clip si configuré
   - Contrôles avancés :
     - Skip au climax
     - Fade out manuel
     - Volume en temps réel

4. **Recherche Rapide Bruitages**
   - Input recherche
   - Suggestions rapides (badges cliquables)
   - Résultats instantanés
   - Click → Play immédiat (bruitage court)

5. **Toggle Mode Live (Son)**
   - Bouton dans Son Préparation
   - Listen `live_mode_activated` (émis par MC)
   - Notification toast : "MC a activé le Mode Live"
   - Transition route vers `/live/sound`

**Validation Sprint 8 :**
- ✅ Synchronisation MC → Son fonctionnelle
- ✅ Chrono affiché en temps réel chez Son
- ✅ Ligne active mise à jour instantanément
- ✅ Lecteur audio opérationnel
- ✅ Recherche rapide bruitages OK

**Validation Phase 4 Complète :**
- ✅ Test spectacle complet avec Julie + Marc
- ✅ Latence synchronisation < 1 seconde mesurée
- ✅ Zéro problème coordination pendant test
- ✅ Feedback UX Mode Live

---

## 7. Phase 5 : PWA & Optimisation (Sprint 9-10)

### 7.1 Objectif

Implémentation PWA (Progressive Web App), cache offline, optimisations performance.

**Livrable :** Application installable sur smartphones/laptops, fonctionnelle offline, prête pour production.

---

### 7.2 Sprint 9 : Implémentation PWA & Cache

**Durée :** 2 semaines

**Tâches PWA Frontend :**

1. **Configuration vite-plugin-pwa**
   - Install : `npm install vite-plugin-pwa -D`
   - Config `vite.config.js` :
     ```js
     import { VitePWA } from 'vite-plugin-pwa'
     plugins: [
       vue(),
       VitePWA({
         registerType: 'autoUpdate',
         workbox: {
           globPatterns: ['**/*.{js,css,html,ico,png,svg}']
         }
       })
     ]
     ```
   - Génération automatique Service Worker

2. **Manifest.json**
   - Créer `public/manifest.json` :
     - `name`, `short_name`, `description`
     - `start_url`, `display: "standalone"`
     - Icons (192x192, 512x512)
     - `theme_color`, `background_color`
   - Lien dans `index.html`

3. **⚠️ Découverte Critique : Limite Safari 50 MB**
   - **Problème** : Safari/iOS limite Cache Storage API à ~50 MB
   - **Impact** : Impossible de cacher toutes les chansons (150-250 MB) dans Cache Storage
   - **Solution** : Architecture hybride (voir ci-dessous)

4. **Architecture de Cache Hybride** (voir RESEARCH_FINDINGS.md)
   - **IndexedDB** pour chansons (pas de limite stricte 50 MB) :
     - Fichier `/utils/audioCache.js` avec fonctions `cacheSong()`, `getCachedSong()`
     - Stockage Blob dans IndexedDB
     - Blob URLs pour lecture HTML5 Audio
   - **Cache Storage API** pour bruitages + assets :
     - Bruitages (~100 fichiers, 10 MB) ✅ Compatible Safari
     - Assets statiques (JS, CSS, images)
   - Créer composable `useProgressiveDownload.js` pour tracking

5. **Cache Strategy - Chansons (IndexedDB)**
   - **Téléchargement progressif avec progress** :
     - Lors assignation musique → Download en arrière-plan
     - Utiliser `ReadableStream` pour tracking progress
     - `downloadProgress.value[songId] = { loaded, total, percent }`
     - Stocker dans IndexedDB après download complet
   - **Bouton manuel "Télécharger tout"** :
     - Interface : "💾 Télécharger toutes les musiques (150 MB)"
     - Progress bar global : "12 / 24 musiques téléchargées"
     - Batch download avec `Promise.all()`
   - **Vérification cache** : Icône ✅ si en cache, ⏳ sinon

6. **Cache Strategy - Bruitages (Cache Storage API)**
   - **Tous les bruitages (~100 fichiers, ~10 MB)** :
     - Téléchargement auto au chargement app SON
     - Ou lors activation Mode Live
     - Workbox `CacheFirst` strategy
   - Compatible Safari (< 50 MB)

7. **Offline Detection**
   - Composable `useOnlineStatus.js`
   - Event listener : `window.addEventListener('online/offline')`
   - Banner UI : "⚠️ MODE HORS LIGNE - Reconnexion auto..."
   - Désactivation boutons si offline (MC smartphone)

8. **Interface MC Smartphone**
   - Route spécifique : `/matches/:id/live/mc-mobile`
   - Détection device : `navigator.userAgent` ou `matchMedia`
   - Layout touch-optimized (section 2.4 wireframes)
   - Boutons 48x48px minimum
   - Swipe gestures pour navigation

**Tâches Backend :**

1. **Headers HTTP Cache**
   - Musiques : `Cache-Control: public, max-age=31536000` (1 an)
   - Bruitages : `Cache-Control: public, max-age=31536000`
   - API JSON : `Cache-Control: no-cache, must-revalidate`

2. **Optimisation API**
   - Caching : Musiques en mémoire (pas de reload fichier JSON à chaque requête)
   - Compression gzip responses
   - Rate limiting (si besoin)

3. **Gestion Erreurs**
   - Try/catch complets
   - Logs structurés (Winston ou Pino)
   - Retours erreurs clairs (codes HTTP + messages)

4. **WebSocket Robustesse**
   - Gestion déconnexions client
   - Reconnexion automatique côté serveur
   - Persistance état (récupération après crash)
   - Heartbeat adaptatif : 10 sec (smartphone), 5 sec (desktop)

**Tâches Frontend (Performance) :**

1. **Optimisation Chargement**
   - Lazy loading routes (Vue Router)
   - Code splitting (Vite automatique)
   - Préchargement musiques assignées en Mode Live

2. **Virtualisation Bibliothèque**
   - Si > 100 musiques affichées : Virtual scroll
   - Librairie : `vue-virtual-scroller`
   - Performance 777 pistes testée

3. **Gestion Erreurs UI**
   - Try/catch dans composables
   - Toast erreurs utilisateur-friendly
   - Fallback si API down
   - Offline detection

4. **Optimisation Audio**
   - Pre-loading musiques :
     - En Mode Live : Preload INTRO/OUTRO/TRANSITION de ligne actuelle + suivante
   - Gestion cache navigateur (HTTP headers)

**Validation Sprint 9 :**
- ✅ PWA installable sur iOS/Android/Desktop
- ✅ Service Worker actif et fonctionnel
- ✅ Chansons assignées téléchargeables offline
- ✅ Tous les bruitages en cache (~10 MB)
- ✅ Interface MC smartphone optimisée tactile
- ✅ Mode offline fonctionnel (lecture seule MC)
- ✅ Chargement initial < 3 secondes
- ✅ Recherche musicale < 500ms (777 pistes)
- ✅ Switch Mode Live < 1 seconde
- ✅ Pas de lag pendant spectacle

---

### 7.3 Sprint 10 : UX Polish & Tests Utilisateur

**Durée :** 2 semaines

**Tâches Frontend :**

1. **Animations & Transitions**
   - Transitions pages fluides (fade, slide)
   - Animations drag & drop (scale, opacity)
   - Pulse icône 🔴 EN COURS
   - Progress bar lecteur animée

2. **Feedback Visuel**
   - Loading spinners (appels API)
   - Skeleton loaders (grille musiques)
   - Toast confirmations (succès/erreur)
   - Tooltips sur boutons/icônes

3. **Accessibilité**
   - Labels ARIA
   - Navigation clavier (tab, enter)
   - Contraste couleurs (WCAG AA)
   - Focus visible

4. **Responsive Final**
   - Tests tablette (iPad)
   - Ajustements marges/padding
   - Grille musiques responsive

**Tâches Tests :**

1. **Tests avec Utilisateurs Réels**
   - Organiser session avec Julie + Marc
   - Scénario : Créer feuille + Assigner musiques + Live
   - Observer sans intervenir
   - Recueillir feedback (questionnaire)

2. **Corrections Bugs**
   - Prioriser bugs identifiés
   - Corriger tous les bugs bloquants
   - Documenter bugs connus mineurs (V2)

3. **Documentation Utilisateur**
   - Guide rapide PDF/MD :
     - Comment créer une feuille de match
     - Comment assigner des musiques
     - Comment utiliser le Mode Live
   - Screenshots/GIFs

**Validation Sprint 10 :**
- ✅ Animations fluides et cohérentes
- ✅ Accessibilité de base OK
- ✅ Responsive tablette fonctionnel
- ✅ Tests utilisateur réussis (satisfaction > 4.5/5)
- ✅ Documentation créée

**Validation Phase 5 Complète :**
- ✅ Application déployée en production (serveur troupe)
- ✅ Match réel géré avec l'app (validation finale)
- ✅ Zéro incident pendant spectacle
- ✅ Feedback troupe positif

---

## 8. Phase 6 : Admin & Features Avancées (V2, Sprint 11+)

### 8.1 Objectif

Système d'authentification complet, gestion utilisateurs, logs, impersonation.

**Livrable :** Admin peut gérer l'application et les utilisateurs avec permissions granulaires.

---

### 8.2 Sprint 11 : Authentification & Rôles

**Durée :** 2 semaines

**Tâches Backend :**

1. **Système d'authentification**
   - Install : `bcryptjs`, `jsonwebtoken` (JWT) ou `express-session`, `nodemailer`
   - Routes `/api/auth/login`, `/api/auth/logout`, `/api/auth/register`
   - Hash mots de passe : bcrypt (salt rounds 10-12)
   - Génération tokens JWT (expiration 24h) ou session Express

2. **Réinitialisation mot de passe par email**
   - Routes :
     - `POST /api/auth/forgot-password` : Demande réinitialisation
     - `POST /api/auth/reset-password/:token` : Reset avec token
   - Génération token reset unique (UUID + expiration 1h)
   - Stockage temporaire token dans `/data/users/reset_tokens.json`
   - Email avec lien : `https://app.com/reset-password?token=xxx`
   - Configuration SMTP (Gmail, Hostinger, ou service tiers)
   - Template email HTML (simple, branding troupe)

3. **Modèle Utilisateur**
   - Fichier `/data/users/users.json` ou migration DB
   - Champs :
     ```json
     {
       "user_id": "user_001",
       "email": "julie@troupe.com",
       "password_hash": "...",
       "role": "MC",
       "created_at": "2025-10-01T10:00:00Z",
       "last_login": "2025-10-10T14:30:00Z"
     }
     ```
   - Rôles : `Admin`, `MC`, `Son`, `Membre`

3. **Middleware d'authentification**
   - `authMiddleware.js` : Vérification token/session
   - Protection routes API :
     - `/api/matches` → Authentification requise
     - `/api/personnel` → Admin uniquement (création)
     - `/api/logs` → Admin uniquement

4. **Permissions par rôle**
   - **Admin** : Accès complet (CRUD utilisateurs, logs, matches)
   - **MC** : Créer/éditer matches assignés, Mode Live
   - **Son** : Assigner musiques matches assignés, Mode Live
   - **Membre** : Lecture seule matches passés

**Tâches Frontend :**

1. **Page Login**
   - Route `/login`
   - Formulaire : Email + Mot de passe
   - Appel API `/api/auth/login`
   - Stockage token : LocalStorage ou SessionStorage
   - Redirection après login : `/matches`
   - Lien "Mot de passe oublié ?" → `/forgot-password`

2. **Pages Réinitialisation Mot de Passe**
   - Route `/forgot-password` :
     - Formulaire : Email uniquement
     - Appel API `POST /api/auth/forgot-password`
     - Message succès : "Email envoyé ! Vérifiez votre boîte mail."
   - Route `/reset-password?token=xxx` :
     - Formulaire : Nouveau mot de passe + Confirmation
     - Validation : Mot de passe identiques, min 8 caractères
     - Appel API `POST /api/auth/reset-password/:token`
     - Redirection `/login` après succès
     - Gestion erreurs : Token expiré/invalide

3. **Gestion Session**
   - Composable `useAuth.js` :
     - État `user`, `isLoggedIn`, `role`
     - Fonctions `login()`, `logout()`, `checkAuth()`
   - Interceptor Axios : Ajout token dans headers
   - Redirection `/login` si 401 Unauthorized

4. **Navigation Guards**
   - Vue Router guards :
     ```js
     router.beforeEach((to, from, next) => {
       if (to.meta.requiresAuth && !isLoggedIn) {
         next('/login')
       } else {
         next()
       }
     })
     ```
   - Protection routes sensibles

5. **Interface utilisateur adaptée au rôle**
   - Menu navigation : Affichage conditionnel selon rôle
   - Boutons d'action : Désactivés si permissions insuffisantes
   - Messages d'erreur : "Vous n'avez pas les droits pour cette action"

**Validation Sprint 11 :**
- ✅ Système login/logout fonctionnel
- ✅ Réinitialisation mot de passe par email opérationnelle
- ✅ Emails envoyés et reçus (test SMTP)
- ✅ Tokens reset valides et expiration 1h respectée
- ✅ Tokens JWT ou sessions sécurisées
- ✅ Routes protégées par authentification
- ✅ Permissions par rôle appliquées
- ✅ Tests avec 4 utilisateurs (Admin, MC, Son, Membre)

---

### 8.3 Sprint 12 : Gestion Admin & Impersonation

**Durée :** 2 semaines

**Tâches Backend :**

1. **API Gestion Utilisateurs**
   - `GET /api/admin/users` : Liste tous les utilisateurs (Admin uniquement)
   - `POST /api/admin/users` : Créer utilisateur
   - `PUT /api/admin/users/:id` : Modifier utilisateur (rôle, email)
   - `DELETE /api/admin/users/:id` : Supprimer utilisateur
   - Validation : Empêcher suppression dernier Admin

2. **Impersonation (Dev/Testing)**
   - Route `POST /api/admin/impersonate/:user_id`
   - Génération token temporaire avec rôle cible
   - Log des actions en mode impersonation :
     ```
     [2025-10-10 15:00:00] [INFO] [Admin:marc_admin] Impersonating user_mc_julie
     [2025-10-10 15:05:00] [INFO] [Impersonated:user_mc_julie] Created match_042
     ```
   - Durée limitée : 1 heure
   - Badge UI visible : "⚠️ Mode Impersonation - Julie (MC)"

3. **Logging Structuré**
   - Install Winston ou Pino
   - Config `/config/logger.js` :
     - Niveau dev : `debug`
     - Niveau prod : `info`
   - Format :
     ```
     [timestamp] [level] [context] message
     [2025-10-10 14:30:25] [INFO] [User:marc_02] Assigned music_042 to match_001
     [2025-10-10 14:35:12] [ERROR] [WebSocket] Connection lost for client mc_julie_01
     ```
   - Rotation logs : `winston-daily-rotate-file`
   - Fichiers : `/logs/app-2025-10-10.log`

4. **API Logs**
   - `GET /api/admin/logs` : Liste logs (Admin uniquement)
   - Query params filtres :
     - `?date=2025-10-10`
     - `?level=error`
     - `?user=marc_02`
   - Pagination : 100 lignes par page
   - Téléchargement : `GET /api/admin/logs/download?date=2025-10-10`

**Tâches Frontend :**

1. **Interface Admin - Gestion Utilisateurs**
   - Route `/admin/users`
   - Tableau : Liste utilisateurs (email, rôle, dernière connexion)
   - Actions : [Éditer] [Supprimer] [Impersonate]
   - Modal création utilisateur :
     - Email, Mot de passe initial, Rôle
     - Génération mot de passe aléatoire (optionnel)
   - Recherche/filtrage par rôle

2. **Impersonation UI**
   - Bouton [🎭 Impersonate] dans liste utilisateurs
   - Confirmation popup :
     ```
     ⚠️ Impersonate Julie (MC) ?

     Vous allez voir l'application comme Julie.
     Toutes vos actions seront loggées.
     Durée : 1 heure maximum.

     [Confirmer] [Annuler]
     ```
   - Banner sticky en mode impersonation :
     ```
     ⚠️ MODE IMPERSONATION - Julie (MC)
     [Terminer l'impersonation]
     ```
   - Bouton [Terminer] → Retour rôle Admin

3. **Interface Admin - Logs**
   - Route `/admin/logs`
   - Filtres :
     - Date (date picker)
     - Niveau (INFO, WARN, ERROR)
     - Utilisateur (dropdown)
     - Recherche texte (full-text)
   - Affichage :
     - Tableau format log
     - Syntax highlighting (couleurs par niveau)
     - Expansion ligne pour détails
   - Bouton [📥 Télécharger logs] (CSV/TXT)

4. **Dashboard Admin (optionnel)**
   - Route `/admin/dashboard`
   - Statistiques :
     - Nombre utilisateurs par rôle
     - Matches créés (ce mois)
     - Dernières connexions
     - Erreurs récentes (24h)
   - Graphiques simples (Chart.js ou similaire)

**Validation Sprint 12 :**
- ✅ Admin peut créer/éditer/supprimer utilisateurs
- ✅ Impersonation fonctionnelle avec logs
- ✅ Logs structurés et consultables
- ✅ Interface logs avec filtres opérationnels
- ✅ Tests impersonation (Admin → MC → actions → logs vérifiés)

**Validation Phase 6 Complète :**
- ✅ Système Admin complet et sécurisé
- ✅ Gestion utilisateurs opérationnelle
- ✅ Impersonation testée (3+ scénarios)
- ✅ Logs accessibles et lisibles
- ✅ Documentation Admin créée

---

### 8.4 Features Avancées Futures (Post-V2)

**Authentification avancée :**
- OAuth2 / SSO (Google, Microsoft)
- Authentification multi-facteurs (2FA) - optionnel pour renforcer la sécurité

**Gestion utilisateurs avancée :**
- Invitations par email
- Désactivation compte (soft delete)
- Historique actions utilisateur

**Permissions granulaires :**
- Permissions par match (ex: MC assigné à match spécifique)
- Rôles personnalisés (créer nouveaux rôles)
- Héritage permissions

**Logs & Analytics :**
- Dashboard analytics avancé
- Export logs vers service externe (Sentry, LogRocket)
- Alertes automatiques (erreurs critiques)

**Autres features :**
- Mode "spectateur" (lecture seule live)
- Notifications push (PWA)
- Thème sombre/clair (toggle utilisateur)

---

## 9. Prochaines Étapes Immédiates

### 9.1 Avant de Coder (Validation)

**Étape 1 : Validation Documents**
- [ ] Julie et Marc lisent PRD v2
- [ ] Julie valide wireframes interface MC
- [ ] Marc valide wireframes interface Son
- [ ] Ajustements si nécessaire

**Étape 2 : Setup Environnement**
- [ ] Installer Node.js 18+ (si pas déjà fait)
- [ ] Installer Python 3.10+ (si pas déjà fait)
- [ ] Vérifier accès dossier musiques OneDrive

**Étape 3 : Décision Clés**
- [ ] TypeScript ? (recommandé : Oui pour backend, Non pour frontend V1)
- [ ] Hébergement production : **Hostinger Cloud** (200 GB, HTTPS requis)
- [ ] Stratégie backup ? (Git + export JSON régulier + backup Hostinger)

---

### 9.2 Démarrage Sprint 1 (Backend API)

**Semaine 1-2 :**

**Lundi :**
1. Créer repo GitHub : `impro-manager-v2`
2. Cloner en local
3. Créer structure `/backend` + `/frontend` + `/music-analyzer`
4. Initialiser backend Express :
   ```bash
   cd backend
   npm init -y
   npm install express cors socket.io nodemon
   ```
5. Créer `server.js` basique (Hello World)
6. Tester : `npm start` → http://localhost:3001

**Mardi-Mercredi :**
7. Créer structure dossiers `/routes`, `/controllers`, `/data`
8. Créer `match.schema.json` (schéma complet selon PRD section 9.2)
9. Implémenter `POST /api/matches` (création match)
10. Tester avec Postman : Créer un match test

**Jeudi-Vendredi :**
11. Implémenter `GET /api/matches/:id`
12. Implémenter `PUT /api/matches/:id`
13. Implémenter `DELETE /api/matches/:id`
14. Implémenter `GET /api/matches` (liste)
15. Tests complets API (CRUD complet)

**Semaine 2 :**
16. API Personnel : `GET /api/personnel`
17. Créer fichier `personnel.json` avec 10 membres fictifs
18. Tests finaux
19. Commit Git : "✅ Phase 1 Sprint 1 - Backend API complete"
20. **Point validation** : API fonctionnelle et testée

---

### 9.3 Checklist Démarrage

**Avant de commencer Sprint 1 :**

- [ ] Documents validés par Julie + Marc
- [ ] Environnement dev installé (Node, Python, Git)
- [ ] Repo GitHub créé
- [ ] Planning confirmé (20 semaines disponibles ?)
- [ ] Décisions techniques prises (TypeScript, hébergement)

**Prêt à coder :** 🚀

---

## 10. Ressources & Références

### 10.1 Documentation Externe

**Vue.js :**
- https://vuejs.org/guide/introduction.html
- https://router.vuejs.org/
- https://pinia.vuejs.org/

**Express.js :**
- https://expressjs.com/
- https://socket.io/docs/v4/

**Analyse Audio :**
- Librosa : https://librosa.org/doc/latest/index.html
- Essentia : https://essentia.upf.edu/

### 10.2 Outils Utiles

**Design :**
- Excalidraw (wireframes) : https://excalidraw.com/
- Coolors (palettes) : https://coolors.co/

**Testing :**
- Postman : https://www.postman.com/
- Vitest : https://vitest.dev/

**Hébergement :**
- Vercel (frontend) : https://vercel.com/
- Railway (backend) : https://railway.app/
- Ou serveur local troupe

---

## 11. Glossaire Technique

**API** : Application Programming Interface (interface backend)
**CRUD** : Create, Read, Update, Delete (opérations de base)
**PWA** : Progressive Web App (application web installable, offline-capable)
**Service Worker** : Script JavaScript exécuté en arrière-plan (cache, offline)
**Cache Storage API** : API navigateur pour stockage fichiers offline
**WebSocket** : Protocole communication bidirectionnelle temps réel
**Drag & Drop** : Glisser-déposer
**Lazy Loading** : Chargement différé (optimisation)
**Debounce** : Délai avant exécution (optimisation recherche)
**Toast** : Notification temporaire (popup)
**Virtualisation** : Affichage seulement éléments visibles (optimisation listes longues)
**JWT** : JSON Web Token (authentification token-based)
**Impersonation** : Mode test permettant de prendre l'identité d'un autre utilisateur

---

*Fin du Plan d'Action Technique*
*Version 2.0 - Octobre 2025*
*Prêt pour développement 🚀*
