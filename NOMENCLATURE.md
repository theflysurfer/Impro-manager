# 📋 Nomenclature des Espaces - Impro Manager v2.0

Ce document définit le vocabulaire commun pour identifier précisément chaque zone/composant de l'application.

**Objectif** : Faciliter la communication et les instructions précises lors du développement.

---

## 🏠 PAGE HOME (`/`)

**Fichier** : `client/src/components/Home.vue`

| Zone | Description | Lignes |
|------|-------------|--------|
| **ZONE-HERO** | Section d'accueil avec titre et description | ~3-39 |
| **ZONE-FEATURES** | Grille des 3 features (Mode MC, Mode Son, Synchronisation) | ~14-27 |
| **ZONE-ACTIONS** | Boutons d'action rapide (Nouveau match, Bibliothèque) | ~29-38 |
| **ZONE-RECENT** | Liste des matchs récents avec cards | ~41-77 |

### Composants enfants
- **CARD-MATCH** : Chaque carte de match dans ZONE-RECENT (~54-75)

---

## 🎤 PAGE MODE MC (`/mc` ou `/mc/:id`)

**Fichier** : `client/src/components/MCInterface.vue`

| Zone | Description | Lignes |
|------|-------------|--------|
| **ZONE-SELECTOR** | Dropdown de sélection du match | ~30-40 |
| **ZONE-HEADER** | Header avec titre du match + infos équipes/scores | ~43-61 |
| **ZONE-TOOLBAR** | Barre d'outils avec boutons actions | ~65-89 |
| **ZONE-LINES** | Liste des lignes/improvisations | ~96-180 |
| **ZONE-MODAL-CREATE** | Modal de création de nouveau match | ~182-220 |
| **ZONE-MODAL-EDIT** | Modal d'édition de ligne | ~222-330 |

### Composants enfants
- **CARD-LINE** : Chaque carte de ligne individuelle dans ZONE-LINES
- **FORM-CREATE** : Formulaire dans ZONE-MODAL-CREATE
- **FORM-EDIT** : Formulaire dans ZONE-MODAL-EDIT

### Boutons ZONE-TOOLBAR
- **BTN-NEW** : Bouton "Nouveau Match"
- **BTN-SAVE** : Bouton "Enregistrer"
- **BTN-REFRESH** : Bouton "Rafraîchir"
- **BTN-LIVE** : Bouton "Mode Live"

---

## 🔊 PAGE MODE SON (`/sound` ou `/sound/:id`)

**Fichier** : `client/src/components/SoundInterface.vue`

| Zone | Description | Lignes |
|------|-------------|--------|
| **ZONE-SELECTOR** | Dropdown de sélection du match | ~50-60 |
| **ZONE-SYNC-PANEL** | Panel de synchronisation avec infos match + overview lignes | ~125-168 |
| **ZONE-FILTERS** | Section filtres bibliothèque musicale | ~174-264 |
| **ZONE-LIBRARY** | Bibliothèque musicale avec cards de musique | ~271-338 |
| **ZONE-ASSIGNMENT** | Section d'assignation musicale (MusicAssignmentPanel) | ~345-373 |

### Composants enfants
- **CARD-MUSIC** : Chaque carte de musique dans ZONE-LIBRARY
- **PANEL-3POINTS** : Panel des 3 points musicaux (INTRO/OUTRO/TRANSITION) dans ZONE-ASSIGNMENT
- **FILTER-SCENARIOS** : Filtre par scénarios dans ZONE-FILTERS
- **FILTER-MOOD** : Filtre par mood dans ZONE-FILTERS
- **FILTER-ARTIST** : Filtre par artiste dans ZONE-FILTERS
- **FILTER-DURATION** : Filtre par durée dans ZONE-FILTERS
- **FILTER-SEARCH** : Barre de recherche dans ZONE-FILTERS

---

## 📺 PAGE YOUTUBE DOWNLOADER (`/youtube`)

**Fichier** : `client/src/views/YouTubeDownloader.vue`

| Zone | Description | Lignes |
|------|-------------|--------|
| **ZONE-HEADER** | Header de page avec titre et description | ~3-9 |
| **ZONE-DEPENDENCIES** | Card de statut des dépendances (yt-dlp, librosa) | ~12-33 |
| **ZONE-PREVIEW** | Lecteur vidéo YouTube en iframe | ~36-50 |
| **ZONE-FORM** | Formulaire de téléchargement (URL + options) | ~52+ |
| **ZONE-PROGRESS** | Section de progression du téléchargement | TBD |
| **ZONE-RESULTS** | Résultats avec waveform + points détectés | TBD |

### Composants dans ZONE-DEPENDENCIES
- **STATUS-YTDLP** : Statut installation yt-dlp
- **STATUS-LIBROSA** : Statut installation librosa
- **GUIDE-INSTALL** : Guide d'installation des dépendances

---

## 🎨 Composants Réutilisables

### MusicAssignment.vue
**Utilisation** : Composant atomique pour un point musical (INTRO/OUTRO/TRANSITION)

| Élément | Description |
|---------|-------------|
| **SELECTOR-MUSIC** | Dropdown de sélection de la musique |
| **PANEL-SETTINGS** | Panel des settings (play_type, fade, volume) |
| **BTN-CLEAR** | Bouton pour effacer l'assignation |

### MusicAssignmentPanel.vue
**Utilisation** : Container des 3 points musicaux pour une ligne

| Élément | Description |
|---------|-------------|
| **SECTION-INTRO** | Section point INTRO |
| **SECTION-OUTRO** | Section point OUTRO |
| **SECTION-TRANSITION** | Section point TRANSITION |

---

## 📝 Conventions de Nommage

### Format des identifiants
```
[TYPE]-[NOM]

Types:
- ZONE      : Grande section de page
- CARD      : Carte/item individuel
- PANEL     : Panel collapsible/expandable
- FORM      : Formulaire
- BTN       : Bouton
- FILTER    : Filtre
- SELECTOR  : Dropdown/select
- STATUS    : Indicateur de statut
- GUIDE     : Section d'aide/guide
- SECTION   : Sous-section d'un composant
```

### Exemples d'usage dans les instructions

✅ **BON** :
- "Dans **ZONE-TOOLBAR** du Mode MC, ajoute un bouton Export PDF"
- "Dans **ZONE-FILTERS** du Mode Son, le filtre Mood ne fonctionne pas"
- "Dans **CARD-LINE** de la ZONE-LINES, affiche la durée en minutes"
- "Dans **ZONE-DEPENDENCIES** de la page YouTube, change le message d'erreur"

❌ **À ÉVITER** :
- "Dans la toolbar en haut, ajoute un bouton"
- "Le filtre ne marche pas"
- "Change le message quelque part dans YouTube"

---

## 🔄 Mise à jour

**Date de création** : 24 octobre 2025
**Dernière mise à jour** : 24 octobre 2025

**Maintenance** :
- Mettre à jour ce document lors de l'ajout de nouvelles zones
- Maintenir les références de lignes à jour après refactoring majeur
- Ajouter de nouvelles pages/composants au fur et à mesure

---

## 📚 Références

- **Architecture** : Voir `docs/ARCHITECTURE.md`
- **Features** : Voir `docs/FEATURES.md`
- **UI System** : Voir `docs/UI-SYSTEM.md`
