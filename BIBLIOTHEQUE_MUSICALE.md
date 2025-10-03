# Bibliothèque Musicale pour l'Impro Théâtrale

## Vue d'ensemble

- **Total de pistes**: 777 fichiers audio
- **Version**: 1.0
- **Généré le**: 2025-03-10
- **Fichier principal**: `music_library.json`

## Statistiques

### Genres musicaux (95 pistes identifiées)
- Rock: 43 pistes
- Country/Western: 16 pistes
- Pop: 14 pistes
- Electronic: 12 pistes
- Hip-hop: 5 pistes
- Soul: 3 pistes
- Reggae: 1 piste
- Classical: 1 piste

### Ambiances (Moods)
- **Effets sonores/Bruitages**: 202 pistes
- **Calme**: 75 pistes
- **Atmosphérique**: 68 pistes
- **Sombre/Inquiétant**: 35 pistes
- **Reconnaissable** (génériques): 32 pistes
- **Épique**: 20 pistes
- **Aventure**: 18 pistes
- **Romantique/Doux**: 13 pistes
- **Relaxant**: 9 pistes
- **Intense/Dynamique**: 7 pistes
- **Festif/Dansant**: 5 pistes
- **Transition** (pause/entracte): 4 pistes
- **Suspense/Tension**: 3 pistes

### Niveau d'énergie (1-10)
- Énergie 3 (très calme): 165 pistes - bruitages, ambiances
- Énergie 4 (calme): 59 pistes
- Énergie 5 (moyen): 397 pistes - la majorité
- Énergie 6 (énergique): 75 pistes
- Énergie 7 (très énergique): 26 pistes
- Énergie 8 (rock): 31 pistes
- Énergie 9 (explosive): 24 pistes

### Tempo
- Medium: 636 pistes (82%)
- Slow: 86 pistes (11%)
- Fast: 55 pistes (7%)

### Scénarios d'impro suggérés
- **Guerre/Action**: 37 pistes
- **Cabaret/Télé**: 31 pistes
- **Western**: 28 pistes
- **Nature/Ferme/Zoo**: 26 pistes
- **Match d'impro**: 22 pistes
- **Aventure/Exploration**: 19 pistes
- **Horreur/Mystère**: 19 pistes
- **Amour/Romance**: 13 pistes
- **Conflit**: 12 pistes
- **Fête/Célébration**: 5 pistes
- **Jungle**: 3 pistes
- **Science-fiction/Espace**: 2 pistes
- **Mer/Océan**: 2 pistes
- **Sport/Compétition**: 2 pistes

## Structure du fichier JSON

Chaque piste contient:

```json
{
  "id": "identifiant-unique",
  "filename": "nom-fichier.mp3",
  "title": "Titre de la chanson",
  "artist": "Nom de l'artiste",
  "file_path": "chemin complet vers le fichier",
  "duration": 180,
  "cues": {
    "start": 0,
    "hook": 30,
    "climax": 60,
    "outro": 150,
    "fade_duration": 8
  },
  "tags": {
    "mood": ["calme", "atmosphérique"],
    "genre": ["rock"],
    "energy": 5,
    "tempo": "medium"
  },
  "impro_context": {
    "scenarios": ["aventure", "exploration"],
    "emotions": ["joie"],
    "contraintes": ["entrée-personnage"]
  },
  "metadata": {
    "folder": "nom-du-dossier",
    "subfolder": "sous-dossier",
    "date": "2025.02.25",
    "extension": "mp3"
  }
}
```

## Organisation des dossiers sources

Les fichiers sont organisés dans plusieurs catégories:

### Dossiers principaux
1. **Entre les impros - coupé** (153 pistes) - Musiques courtes pour transitions
2. **impro musique** (81 pistes) - Musiques générales pour impro
3. **Divers** (58 pistes) - Bruitages variés
4. **Ambiance et Attente** (50 pistes) - Musiques calmes
5. **Musiques spectacle Italiens** (46 pistes) - Musiques thématiques
6. **Racine** (37 pistes) - Classiques rock/pop
7. **Horreur** (32 pistes) - Ambiances inquiétantes
8. **Animaux** (26 pistes) - Bruitages d'animaux
9. **Burton** (23 pistes) - Musiques Tim Burton
10. **Match Fondus** (22 pistes) - Musiques pour match d'impro spécifique

### Sous-catégories de bruitages
- **Animaux**: cris, meuglements, bruits de ferme (26 pistes)
- **Armes**: coups de feu, explosions (6 pistes)
- **Aventure**: ambiances jungle, forêt (15 pistes)
- **Divers**: applaudissements, rires, accidents (58 pistes)
- **Horreur**: portes qui grincent, cris (32 pistes)
- **Génériques**: thèmes d'émissions TV, films (20 pistes)

## Exemples de pistes par catégorie

### Rock énergique (énergie 8-9)
- Queen - Another One Bites the Dust
- AC/DC - Highway to Hell
- Aerosmith - Walk This Way
- Bon Jovi - Livin' On A Prayer
- Green Day - Boulevard of Broken Dreams

### Ambiance calme
- Daft Punk - Instant Crush
- Enya - Only Time
- Coldplay - Yellow
- Ludovico Einaudi - Experience
- Moby - Porcelain

### Génériques reconnaissables
- James Bond Theme
- Star Wars Theme
- Indiana Jones Main Theme
- Mission Impossible Theme
- Fort Boyard (plusieurs versions)
- Les 12 coups de midi
- Question pour un champion

### Bruitages animaux
- Bruit de chat (miaulement)
- Bruit de cheval (hennissement)
- Rugissement du lion
- Éléphant qui barrit
- Coq qui chante

## Utilisation

### Pour rechercher des pistes

Le fichier JSON peut être filtré selon plusieurs critères:

**Par énergie**:
```javascript
tracks.filter(t => t.tags.energy >= 8) // Haute énergie
tracks.filter(t => t.tags.energy <= 3) // Calme
```

**Par mood**:
```javascript
tracks.filter(t => t.tags.mood.includes('calme'))
tracks.filter(t => t.tags.mood.includes('effet-sonore'))
```

**Par scénario**:
```javascript
tracks.filter(t => t.impro_context.scenarios.includes('match-impro'))
tracks.filter(t => t.impro_context.scenarios.includes('western'))
```

**Par contrainte**:
```javascript
tracks.filter(t => t.impro_context.contraintes.includes('entrée-personnage'))
tracks.filter(t => t.impro_context.contraintes.includes('entracte'))
```

## Durées

- **Durée moyenne**: ~180 secondes (3 minutes)
- **Bruitages**: 10 secondes
- **Génériques**: 30 secondes
- **Chansons complètes**: 210 secondes (3.5 minutes)
- **Ambiances**: 240 secondes (4 minutes)

## Points de repère (Cues)

Chaque piste a des points de repère pré-calculés:
- **start** (0s): Début
- **hook** (~30s): Accroche principale
- **climax** (~60s): Point culminant
- **outro** (fin-30s): Sortie progressive
- **fade_duration** (8s): Durée du fondu

## Scripts disponibles

### `generate_music_library.py`
Script principal pour générer/régénérer la bibliothèque JSON à partir des fichiers audio.

**Usage**:
```bash
python generate_music_library.py
```

**Fonctionnalités**:
- Scan récursif de tous les fichiers audio
- Extraction automatique artiste/titre
- Détection intelligente des genres, moods, énergie
- Analyse du contexte d'impro basé sur les dossiers
- Génération d'IDs uniques
- Estimation des durées et cues

### `library_report.py`
Génère un rapport détaillé avec statistiques.

## Notes techniques

- **Encodage**: UTF-8
- **Formats audio supportés**: .mp3, .wav, .m4a, .flac, .aac, .ogg, .wma
- **Chemins**: Absolus (Windows)
- **IDs**: Hash MD5 des chemins (12 caractères)

## Améliorations futures possibles

1. Extraction des métadonnées ID3 réelles (durée, artiste, album)
2. Analyse audio automatique (BPM, tonalité, loudness)
3. Clustering par similarité
4. Suggestions automatiques par contexte
5. Interface de recherche/filtrage
6. Playlist builder pour spectacles
7. Détection de doublons
8. Gestion des favoris
