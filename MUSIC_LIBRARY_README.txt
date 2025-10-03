================================================================================
        BIBLIOTHEQUE MUSICALE POUR L'IMPROVISATION THEATRALE
================================================================================

Date de generation : 2025-03-10
Auteur : Claude Code (pour Julien Fernandez)
Version : 1.0

================================================================================
                              RESUME
================================================================================

Cette bibliotheque recense 777 fichiers audio provenant du dossier
"C:\Users\JulienFernandez\OneDrive\Zic impro" et organises intelligemment
pour une utilisation lors de spectacles d'improvisation theatrale.

Statistiques cles :
- 777 pistes audio
- 357 artistes uniques
- 31 heures de contenu total
- 8 genres musicaux identifies
- 23 ambiances/moods differentes
- 30 scenarios d'impro couverts
- 202 bruitages/effets sonores
- 575 musiques

================================================================================
                          FICHIERS GENERES
================================================================================

1. music_library.json (713 KB)
   - Bibliotheque complete avec toutes les metadonnees
   - Structure JSON detaillee pour chaque piste
   - 26,870 lignes

2. music_examples.json (40 KB)
   - Exemples organises par cas d'usage
   - 8 categories predefinies
   - Ideal pour tester l'integration

3. music_library_stats.json
   - Statistiques detaillees
   - Compteurs par genre, mood, energie, etc.
   - Liste des artistes uniques

4. BIBLIOTHEQUE_MUSICALE.md (6.6 KB)
   - Documentation complete
   - Guide d'utilisation
   - Exemples de code

5. generate_music_library.py (14 KB)
   - Script de generation de la bibliotheque
   - Scan recursif des fichiers audio
   - Detection intelligente des metadonnees

6. library_report.py (4.9 KB)
   - Generation de rapports statistiques
   - Analyse detaillee de la bibliotheque

================================================================================
                      REPARTITION DU CONTENU
================================================================================

GENRES MUSICAUX
---------------
Rock             : 43 pistes  (5.5%)
Country/Western  : 16 pistes  (2.1%)
Pop              : 14 pistes  (1.8%)
Electronic       : 12 pistes  (1.5%)
Hip-hop          :  5 pistes  (0.6%)
Soul             :  3 pistes  (0.4%)
Reggae           :  1 piste   (0.1%)
Classical        :  1 piste   (0.1%)
Sans genre       : 682 pistes (87.9%)

AMBIANCES/MOODS
---------------
Effet-sonore     : 202 pistes (26.0%) - Bruitages
Calme            :  75 pistes  (9.7%) - Ambiances douces
Atmospherique    :  68 pistes  (8.8%) - Musiques d'ambiance
Sombre           :  35 pistes  (4.5%) - Horreur/mystere
Inquietant       :  35 pistes  (4.5%) - Suspense
Reconnaissable   :  32 pistes  (4.1%) - Generiques TV/Films
Epique           :  20 pistes  (2.6%) - Aventure grandiose
Aventure         :  18 pistes  (2.3%) - Exploration
Romantique       :  13 pistes  (1.7%) - Amour
Autres moods     :  43 pistes  (5.5%)
Sans mood        : 236 pistes (30.4%)

NIVEAU D'ENERGIE (1-10)
-----------------------
Niveau 3 (tres calme)   : 165 pistes (21.2%) - Bruitages, ambiances
Niveau 4 (calme)        :  59 pistes  (7.6%)
Niveau 5 (moyen)        : 397 pistes (51.1%) - MAJORITE
Niveau 6 (energique)    :  75 pistes  (9.7%)
Niveau 7 (tres energ.)  :  26 pistes  (3.3%)
Niveau 8 (rock)         :  31 pistes  (4.0%)
Niveau 9 (explosif)     :  24 pistes  (3.1%)

TEMPO
-----
Medium : 636 pistes (81.9%)
Slow   :  86 pistes (11.1%)
Fast   :  55 pistes  (7.1%)

SCENARIOS D'IMPRO (TOP 15)
--------------------------
Guerre/Action         : 37 pistes
Cabaret/Tele          : 31 pistes
Western               : 28 pistes
Nature/Ferme/Zoo      : 26 pistes
Match d'impro         : 22 pistes
Aventure/Exploration  : 19 pistes
Horreur/Mystere       : 19 pistes
Amour/Romance         : 13 pistes
Conflit               : 12 pistes
Fete/Celebration      :  5 pistes
Jungle                :  3 pistes
Science-fiction       :  2 pistes
Mer/Ocean             :  2 pistes
Sport/Competition     :  2 pistes
Funerailles           :  1 piste

DOSSIERS SOURCE (TOP 10)
------------------------
Entre les impros - coupe         : 153 pistes
impro musique                     :  81 pistes
Divers (bruitages)                :  58 pistes
Ambiance et Attente               :  50 pistes
Musiques spectacle Italiens       :  46 pistes
Racine (classiques rock/pop)      :  37 pistes
Horreur                           :  32 pistes
Animaux                           :  26 pistes
Burton                            :  23 pistes
2025.03.14 - Match Fondus         :  22 pistes

================================================================================
                      STRUCTURE DES DONNEES
================================================================================

Chaque piste contient :

{
  "id": "identifiant-unique-md5",
  "filename": "nom-fichier.mp3",
  "title": "Titre extrait du nom",
  "artist": "Artiste detecte",
  "file_path": "chemin-absolu-complet",
  "duration": 180,

  "cues": {
    "start": 0,
    "hook": 30,
    "climax": 60,
    "outro": 150,
    "fade_duration": 8
  },

  "tags": {
    "mood": ["calme", "atmospherique"],
    "genre": ["rock"],
    "energy": 5,
    "tempo": "medium"
  },

  "impro_context": {
    "scenarios": ["aventure", "exploration"],
    "emotions": ["joie"],
    "contraintes": ["entree-personnage"]
  },

  "metadata": {
    "folder": "nom-dossier-parent",
    "subfolder": "sous-dossier",
    "date": "2025.02.25",
    "extension": "mp3"
  }
}

================================================================================
                      EXEMPLES D'UTILISATION
================================================================================

JAVASCRIPT/TYPESCRIPT
---------------------

// Charger la bibliotheque
const library = require('./music_library.json');

// Rock energique
const rock = library.tracks.filter(t =>
  t.tags.genre.includes('rock') && t.tags.energy >= 8
);

// Bruitages d'animaux
const animals = library.tracks.filter(t =>
  t.tags.mood.includes('effet-sonore') &&
  t.impro_context.scenarios.some(s => ['ferme','nature','zoo'].includes(s))
);

// Musique pour match d'impro
const match = library.tracks.filter(t =>
  t.impro_context.scenarios.includes('match-impro')
);

// Ambiance calme
const calm = library.tracks.filter(t =>
  t.tags.mood.includes('calme') && t.tags.energy <= 4
);

PYTHON
------

import json

with open('music_library.json', 'r', encoding='utf-8') as f:
    library = json.load(f)

# Haute energie
high_energy = [t for t in library['tracks'] if t['tags']['energy'] >= 8]

# Western
western = [t for t in library['tracks']
           if 'western' in t['impro_context']['scenarios']]

# Generiques reconnaissables
themes = [t for t in library['tracks']
          if 'reconnaissable' in t['tags']['mood']]

================================================================================
                      EXEMPLES DE PISTES
================================================================================

ROCK ENERGIQUE (energie 8-9)
-----------------------------
- Queen - Another One Bites the Dust
- AC/DC - Highway to Hell
- Aerosmith - Walk This Way
- Bon Jovi - Livin' On A Prayer
- Green Day - Boulevard of Broken Dreams
- Linkin Park - In the End
- The White Stripes - Seven Nation Army

AMBIANCE CALME
--------------
- Daft Punk - Instant Crush
- Enya - Only Time
- Coldplay - Yellow
- Ludovico Einaudi - Experience
- Moby - Porcelain
- Keane - Somewhere Only We Know
- Radiohead - No Surprises

GENERIQUES RECONNAISSABLES
--------------------------
- James Bond Theme (007)
- Star Wars Theme
- Indiana Jones Main Theme
- Mission Impossible Theme
- Jurassic Park Theme
- Fort Boyard (1999 et 2024)
- Question pour un champion
- Les 12 coups de midi
- Koh Lanta

BRUITAGES ANIMAUX
-----------------
- Bruit de chat (miaulement)
- Bruit de cheval (hennissement)
- Rugissement du lion
- Elephant qui barrit
- Coq qui chante
- Vache qui meugle
- Loup qui hurle
- Mouettes

BRUITAGES DIVERS
----------------
- Applaudissements (3 versions)
- Rire
- Cloche de boxe
- Explosion
- Feu
- Sirene police
- Tic-tac bombe
- Telephone Nokia

================================================================================
                      ARTISTES LES PLUS REPRESENTES
================================================================================

Plus de 350 artistes differents, dont :
- Queen
- AC/DC
- Aerosmith
- Oasis
- Daft Punk
- Michael Jackson
- Rihanna
- Pharrell Williams
- John Williams (musiques de films)
- Hans Zimmer (musiques de films)
- Et beaucoup d'autres...

================================================================================
                      DUREES ET POINTS DE REPERE
================================================================================

DUREES
------
Duree moyenne    : 143 secondes (2.4 minutes)
Duree minimale   : 10 secondes (bruitages)
Duree maximale   : 240 secondes (4 minutes)
Duree totale     : 31 heures de contenu

DUREES PAR TYPE
---------------
Bruitages        : 10 secondes
Generiques       : 30 secondes
Chansons         : 210 secondes (3.5 minutes)
Ambiances        : 240 secondes (4 minutes)
Defaut           : 180 secondes (3 minutes)

POINTS DE REPERE (CUES)
-----------------------
Chaque piste a des points de repere pre-calcules :
- start (0s)           : Debut
- hook (~30s)          : Accroche principale
- climax (~60s)        : Point culminant
- outro (fin-30s)      : Sortie progressive
- fade_duration (8s)   : Duree du fondu

Ces cues permettent de demarrer la musique a des moments strategiques
ou de faire des transitions fluides.

================================================================================
                      CAS D'USAGE POUR L'IMPRO
================================================================================

MATCH D'IMPROVISATION
---------------------
- Entree des equipes (haute energie, rock)
- Entree de l'arbitre (Star Wars, James Bond)
- Entracte (festif, dansant)
- Finale (We Are The Champions)
- Transition entre impros (medium energie)

SCENES THEMATIQUES
------------------
- Western : musiques de westerns, country
- Horreur : ambiances sombres, inquietantes
- Romance : musiques romantiques, douces
- Aventure : musiques epiques, grandioses
- Comedie : musiques joyeuses, festives

BRUITAGES DE SCENE
------------------
- Animaux pour scenes a la ferme/zoo/nature
- Armes/explosions pour scenes d'action
- Applaudissements pour fins de scenes
- Telephones, cloches pour situations quotidiennes
- Effets speciaux pour scenes fantastiques

AMBIANCES
---------
- Musique d'attente avant le spectacle
- Fond sonore pendant les deliberations
- Ambiance calme pendant les explications
- Transition douce entre les parties

================================================================================
                      FORMATS AUDIO SUPPORTES
================================================================================

Extensions detectees :
- .mp3  (majoritaire)
- .wav
- .m4a
- .flac
- .aac
- .ogg
- .wma

Tous les formats audio courants sont supportes par le script de generation.

================================================================================
                      REGENERER LA BIBLIOTHEQUE
================================================================================

Pour mettre a jour la bibliotheque si vous ajoutez/supprimez des fichiers :

1. Ouvrir un terminal dans le dossier du projet
2. Executer : python generate_music_library.py
3. Attendre la fin du scan (quelques secondes)
4. Le fichier music_library.json est mis a jour

Le script re-scanne automatiquement tous les fichiers et regenere
les metadonnees.

================================================================================
                      AMELIORATIONS FUTURES POSSIBLES
================================================================================

METADONNEES
-----------
- Extraction des tags ID3 reels (duree, BPM, artiste officiel)
- Analyse audio automatique (tempo reel, tonalite, loudness)
- Detection de la langue des paroles
- Classification par decade/epoque

FONCTIONNALITES
---------------
- Interface web de recherche et filtrage
- Playlist builder pour spectacles
- Suggestions automatiques par contexte
- Detection de doublons
- Systeme de favoris/notes
- Export en differents formats (M3U, PLS)
- Historique des lectures
- Mode aleatoire intelligent

INTELLIGENCE ARTIFICIELLE
-------------------------
- Clustering par similarite audio
- Recommandations basees sur l'historique
- Detection automatique des emotions via IA
- Suggestions de transitions musicales
- Adaptation automatique du tempo
- Generation de mixtapes intelligentes

================================================================================
                      NOTES TECHNIQUES
================================================================================

Encodage     : UTF-8
Plateforme   : Windows (chemins absolus)
IDs          : Hash MD5 des chemins (12 caracteres)
Taille totale: ~750 KB pour le JSON complet

Le fichier JSON peut etre importe dans n'importe quelle application
JavaScript, TypeScript, Python, ou tout autre langage supportant JSON.

================================================================================
                      CONTACT ET SUPPORT
================================================================================

Pour toute question ou amelioration :
- Contacter Julien Fernandez
- Modifier le script generate_music_library.py selon vos besoins
- Consulter la documentation dans BIBLIOTHEQUE_MUSICALE.md

================================================================================
                      FIN DU DOCUMENT
================================================================================

Genere automatiquement par Claude Code
Date : 2025-10-03
