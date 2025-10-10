# 🎭 PRD - Impro Manager v2.0

**Product Requirements Document**
*Version 2.0 - Octobre 2025*
*Basé sur analyse complète des besoins utilisateurs*

---

## 1. Vision & Contexte

### 1.1 Vision Produit

Impro Manager est une application web complète dédiée à la gestion des matchs d'improvisation théâtrale. Elle optimise la coordination entre le MC (Maître de Cérémonie) et le Régisseur Son en fournissant :

- **Une feuille de match dynamique** flexible et personnalisable
- **Une bibliothèque musicale intelligente** avec métadonnées enrichies (777+ pistes)
- **Une synchronisation temps réel** pendant les spectacles
- **Des modes dédiés** Préparation (création) et Live (performance)

### 1.2 Problème Résolu

Les troupes d'improvisation manquent d'outils numériques adaptés pour :

- ✅ Créer et gérer des feuilles de match flexibles et réutilisables
- ✅ Assigner efficacement des musiques aux différents moments du spectacle
- ✅ Coordonner MC et Régisseur Son pendant le live (timing, progression)
- ✅ Gérer une bibliothèque musicale volumineuse (777+ pistes) avec recherche rapide

### 1.3 Solution

Une application web temps réel avec :

- **Architecture client-serveur** : Express.js + Vue.js 3
- **Synchronisation WebSocket** : Communication MC ↔ Son < 1 seconde
- **Bibliothèque enrichie** : Métadonnées automatiques (analyse AI) + correction manuelle
- **Interfaces spécialisées** : Mode Préparation vs Mode Live

---

## 2. Personas

### 2.1 👨‍🎭 Julie - MC (Maître de Cérémonie)

**Rôle :** Anime le spectacle, gère le timing et la progression du match.

**Responsabilités :**
- Créer/modifier la feuille de match
- Assigner le personnel technique (Son, Arbitre, Lumière)
- Gérer le chronomètre pendant le live
- Saisir les scores manuellement
- Communiquer visuellement avec le Son

**Besoins :**
- Interface simple pour créer des feuilles de match rapidement
- Template de départ pour gagner du temps
- Drag & drop pour réorganiser les lignes
- Chronomètre manuel avec contrôles
- Vue compacte en Mode Live (sur scène entre interludes)

**Pain Points actuels :**
- Création manuelle fastidieuse des feuilles
- Manque de flexibilité dans les outils existants
- Difficulté à coordonner timing avec le Son

### 2.2 🎵 Marc - Régisseur Son

**Rôle :** Gère l'ambiance musicale et les bruitages du spectacle.

**Responsabilités :**
- Assigner des musiques aux points INTRO/OUTRO/TRANSITION
- Jouer les musiques pendant le spectacle
- Réagir aux imprévus (bruitages non anticipés)
- Contrôler le lecteur audio (volume, fade, skip)

**Besoins :**
- Bibliothèque musicale organisée avec filtres puissants
- Drag & drop rapide depuis bibliothèque vers feuille de match
- Édition fine des musiques (clipping, volume, fade)
- Vue synchronisée avec le MC (impro en cours + chrono)
- Recherche rapide de bruitages en Mode Live

**Pain Points actuels :**
- Recherche manuelle dans 777+ fichiers audio
- Préparation des musiques chronophage
- Coordination timing avec le MC pendant live

### 2.3 🎪 Admin

**Rôle :** Gestion permanente de l'application (distinct du Régisseur).

**Distinction Admin vs Régisseur :**
- **Admin** : Rôle permanent, gère l'application et les utilisateurs
- **Régisseur** : Poste tournant, assigné par match (peut être MC ou Son selon le spectacle)

**Responsabilités :**
- Gérer les utilisateurs (création, modification, suppression)
- Gérer les permissions et rôles
- Créer les matchs dans l'application
- Assigner le MC à chaque match
- Gérer la bibliothèque musicale (upload, métadonnées)
- Accéder aux logs de l'application
- Impersonation (tests)

**Besoins :**
- Interface d'administration complète
- Gestion des utilisateurs et authentification
- Vue d'ensemble des matchs (passés, à venir)
- Accès aux logs pour debugging
- Fonctionnalité d'impersonation pour tests

### 2.4 👥 Autres Membres Troupe

**Rôles :** Joueurs, Arbitre, Lumière, Accueil, etc.

**Besoins :**
- Consultation des matchs **passés** (lecture seule)
- **PAS d'accès** aux feuilles de match avant/pendant spectacle (secret)
- Accès après spectacle (archives)

---

## 3. User Journey Complet

### 📅 J-7 : Création du Match (Admin)

**Acteur :** Admin/Régisseur

**Actions :**
1. Se connecte à l'application
2. Clique sur "Nouveau Match"
3. Saisit informations générales :
   - Date : 15/10/2025
   - Heure : 20h30
   - Lieu : Théâtre Municipal
   - Équipe A : Les Fous du Roi
   - Équipe B : Les Improvisés
4. Assigne **Julie** comme MC
5. Sauvegarde → Match créé avec statut "Brouillon"

**Résultat :** Julie reçoit notification d'assignation.

---

### 📅 J-5 : Préparation Feuille de Match (MC - Julie)

**Acteur :** Julie (MC assignée)

**Actions :**

1. **Connexion et consultation**
   - Se connecte à l'application
   - Voit le match assigné dans son tableau de bord
   - Clique sur "Éditer la feuille de match"

2. **Édition informations générales**
   - Modifie/complète date, heure, lieu, équipes (éditables)

3. **Création structure match**
   - Option A : Charge le **template standard** (recommandé)
   - Option B : Crée les lignes from scratch

   **Template chargé :**
   ```
   1. ARRIVÉE - Arbitre
   2. ARRIVÉE - Joueurs Équipe A
   3. ARRIVÉE - Joueurs Équipe B
   4. ARRIVÉE - MC
   5. ÉCHAUFFEMENT PUBLIC - 10min
   6. PRÉSENTATION ÉQUIPES - 5min
   7. SÉQUENCE #1 - [thème] - Comparée - 2v2 - 3min
   8. SÉQUENCE #2 - [thème] - Comparée - 2v2 - 3min
   9. SÉQUENCE #3 - [thème] - Comparée - 1v1 - 5min
   10. SÉQUENCE #4 - [thème] - Comparée - 3v3 - 4min
   11. ANNONCE INTERMÉDIAIRE - Score partiel
   12. PAUSE / ENTRACTE - 15min
   13. SÉQUENCE #5 - [thème] - Comparée - 2v2 - 3min
   14. SÉQUENCE #6 - [thème] - Comparée - 1v1 - 5min
   15. SÉQUENCE #7 - [thème] - Mixte - 4 - 4min
   16. SÉQUENCE #8 - [thème] - Comparée - 2v2 - 3min
   17. ANNONCE FIN - Score final
   18. ANNONCE FIN - Remerciements
   19. FIN
   ```

4. **Personnalisation**
   - Remplit thèmes des séquences (Western, Romance, etc.)
   - Ajuste durées si besoin
   - Ajoute/supprime des lignes
   - Réorganise par drag & drop

5. **Assignation personnel**
   - Sélectionne Marc (Régisseur Son)
   - Sélectionne Pierre (Arbitre)
   - Sélectionne Sophie (Lumière)

6. **Sauvegarde**
   - Clique "Sauvegarder"
   - Notification automatique envoyée à Marc (Son)

**Résultat :** Feuille de match créée, Marc peut commencer préparation musicale.

---

### 📅 J-3 : Préparation Musicale (Son - Marc)

**Acteur :** Marc (Régisseur Son assigné)

**Actions :**

1. **Consultation feuille de match**
   - Se connecte à l'application
   - Voit notification : "Nouvelle feuille de match - Match vs Les Improvisés"
   - Ouvre la feuille créée par Julie

2. **Layout interface**
   ```
   ┌──────────────────────────┬────────────────────────────┐
   │  📋 FEUILLE DE MATCH     │  🎵 BIBLIOTHÈQUE (777)     │
   │  (lecture structure)     │  (drag & drop)             │
   └──────────────────────────┴────────────────────────────┘
   ```

3. **Assignation musiques par drag & drop**

   **Pour chaque ligne de la feuille :**

   - Ligne 7 : SÉQUENCE #1 - Western - 3min
     - Utilise filtres : Scenarios = "Western", Tempo = 100-140 BPM
     - Drag "Western Showdown" → INTRO
     - Drag "Sunset Ride" → OUTRO
     - Drag "Tumbleweed Roll" → TRANSITION

   - Ligne 8 : SÉQUENCE #2 - Romance - 3min
     - Filtre : Scenarios = "Romance", Valence = Positif
     - Drag "Love Theme" → INTRO
     - Etc.

4. **Édition fine (optionnel)**
   - Click sur musique assignée → Panneau d'édition
   - Ajuste clipping (extrait 0:30 - 2:15)
   - Configure fade in/out
   - Ajuste volume
   - Teste preview (écoute complète ou clip)

5. **Test complet**
   - Parcourt la feuille
   - Teste quelques lectures
   - Vérifie que tout fonctionne

6. **Sauvegarde**
   - Sauvegarde automatique à chaque assignation
   - Préparation terminée

**Résultat :** Toutes les musiques sont assignées et configurées.

---

### 📅 J-0 (19h30) : Arrivée et Vérifications

**Acteurs :** Julie + Marc

**Actions :**
- Arrivent sur place
- Se connectent à l'application
- Derniers ajustements si nécessaire
- Vérifications techniques (son, réseau)

---

### 📅 J-0 (20h25) : Bascule Mode Live

**Acteurs :** Julie + Marc

**Actions :**

1. **Julie active Mode Live**
   - Toggle Préparation → Live
   - Interface MC se simplifie

2. **Marc reçoit notification**
   - "Julie a activé le Mode Live"
   - Active aussi son Mode Live
   - Interface Son se simplifie

3. **Synchronisation établie**
   - WebSocket connecté
   - Les deux interfaces prêtes

**Résultat :** Interfaces optimisées pour performance temps réel.

---

### 📅 J-0 (20h30-22h00) : Spectacle Live

**Acteurs :** Julie (sur scène) + Marc (régie son)

**Workflow par ligne :**

1. **Julie lance première ligne**
   - ARRIVÉE - Arbitre
   - Lance chronomètre manuel si besoin

2. **Marc voit ligne active synchronisée**
   - Interface affiche : "🔴 EN COURS : ARRIVÉE - Arbitre"
   - Joue musique INTRO si assignée (click)

3. **Progression automatique**
   - Julie passe ligne suivante (click ou auto si chrono = 0)
   - Interface Marc se met à jour en temps réel

4. **Séquence d'impro typique**

   **SÉQUENCE #1 - Western - 3min**

   - Julie lance la séquence + chronomètre (manuel)
   - Marc voit : "🔴 SÉQUENCE #1 - Western - ⏱️ 03:00"
   - Marc click INTRO → "Western Showdown" démarre
   - Impro se déroule (Julie sur scène, regarde spectacle)
   - Chrono : 00:15 restant → Marc click OUTRO → Musique de fin
   - Julie click "Suivant" (ou auto si chrono = 0)
   - Marc click TRANSITION → Musique enchainement

5. **Gestion imprévus**
   - Besoin bruitage chat non prévu
   - Marc utilise recherche rapide bruitages
   - Trouve "Meow" en 10 secondes
   - Joue le bruitage

6. **Saisie score**
   - Julie collecte score auprès public/arbitre
   - Saisit manuellement dans interface
   - Continue progression

7. **Répétition pour toutes les lignes**
   - PAUSE / ENTRACTE : chronomètre 15min
   - Séquences suivantes
   - Etc.

8. **Dernière ligne : FIN**
   - Match terminé
   - Statut auto → "Terminé"

**Résultat :** Spectacle coordonné, fluide, aucun incident.

---

### 📅 J-0 (22h00) : Fin Spectacle

**Actions :**
- Retour automatique Mode Préparation (ou toggle manuel)
- Match archivé avec statut "Terminé"
- Accessible en lecture pour tous les membres troupe

---

## 4. Feuille de Match

### 4.1 Concept

La **feuille de match** est une liste ordonnée de **lignes** représentant le déroulement du spectacle. Chaque ligne a un **type** avec des **champs spécifiques**.

### 4.2 Types de Lignes

#### **Type 1 : ARRIVÉE**

Personnel ou équipe qui arrive avant spectacle.

**Champs :**
- **Qui** : [dropdown] Arbitre / Joueurs Équipe A / Joueurs Équipe B / MC / Personnel technique
- **Heure prévue** : [time] (ex: 19h45)
- **Remarques** : [texte libre]

**Exemple :**
```
ARRIVÉE - Arbitre - 19h45
```

---

#### **Type 2 : ÉCHAUFFEMENT PUBLIC**

Animation/interaction avec le public avant le match.

**Champs :**
- **Durée** : [nombre] minutes
- **Type d'échauffement** : [texte libre] (ex: "jeu avec public")
- **Remarques** : [texte libre]

**Exemple :**
```
ÉCHAUFFEMENT PUBLIC - 10min - Jeu avec public
```

---

#### **Type 3 : PRÉSENTATION ÉQUIPES**

Présentation des équipes au public.

**Champs :**
- **Durée estimée** : [nombre] minutes
- **Ordre** : [dropdown] Équipe A puis B / Équipe B puis A
- **Remarques** : [texte libre]

**Exemple :**
```
PRÉSENTATION ÉQUIPES - 5min - Équipe A puis B
```

---

#### **Type 4 : SÉQUENCE D'IMPRO**

Improvisation jouée (élément central du match).

**Champs :**
- **Type de match** : [dropdown] Comparée / Mixte
- **Nombre de joueurs** : [nombre] par équipe (1-5) OU total si Mixte
- **Type d'impro** : [dropdown + texte libre] Western / Chantée / Rimée / BD / Libre / Autre
- **Thème** : [texte libre]
- **Durée** : [nombre] minutes (ou min:sec)
- **Contrainte** : [texte libre] (optionnel)
- **Remarques** : [texte libre]

**Exemple :**
```
SÉQUENCE #1 - Western - Comparée - 2v2 - 3min - "Duel au saloon"
```

---

#### **Type 5 : ANNONCE INTERMÉDIAIRE**

Annonce pendant le match (score, sponsors, etc.).

**Champs :**
- **Type** : [dropdown] Score partiel / Annonce sponsor / Communication public / Autre
- **Contenu** : [texte libre]
- **Durée estimée** : [nombre] minutes

**Exemple :**
```
ANNONCE INTERMÉDIAIRE - Score partiel - 2min
```

---

#### **Type 6 : PAUSE / ENTRACTE**

Pause dans le déroulement du match.

**Champs :**
- **Type** : [dropdown] Pause courte (5min) / Entracte (15-20min)
- **Durée** : [nombre] minutes
- **Remarques** : [texte libre] (ex: "Buvette ouverte")

**Exemple :**
```
PAUSE / ENTRACTE - Entracte - 15min - Buvette ouverte
```

---

#### **Type 7 : ANNONCE FIN**

Annonce de fin de spectacle.

**Champs :**
- **Type** : [dropdown] Score final / Remerciements / Sponsors / Prochaines dates / Autre
- **Contenu** : [texte libre]

**Exemple :**
```
ANNONCE FIN - Score final
ANNONCE FIN - Remerciements
```

---

#### **Type 8 : FIN**

Marque la fin du spectacle.

**Champs :**
- **Heure de fin prévue** : [time] (optionnel)
- **Remarques** : [texte libre]

**Exemple :**
```
FIN - 22h00
```

---

### 4.3 Template Standard

**Match standard 8 improvisations avec entracte :**

```
1. ARRIVÉE - Arbitre - 19h45
2. ARRIVÉE - Joueurs Équipe A - 19h50
3. ARRIVÉE - Joueurs Équipe B - 19h50
4. ARRIVÉE - MC - 20h00
5. ÉCHAUFFEMENT PUBLIC - 10min
6. PRÉSENTATION ÉQUIPES - 5min
7. SÉQUENCE #1 - [thème] - Comparée - 2v2 - 3min
8. SÉQUENCE #2 - [thème] - Comparée - 2v2 - 3min
9. SÉQUENCE #3 - [thème] - Comparée - 1v1 - 5min
10. SÉQUENCE #4 - [thème] - Comparée - 3v3 - 4min
11. ANNONCE INTERMÉDIAIRE - Score partiel
12. PAUSE / ENTRACTE - 15min
13. SÉQUENCE #5 - [thème] - Comparée - 2v2 - 3min
14. SÉQUENCE #6 - [thème] - Comparée - 1v1 - 5min
15. SÉQUENCE #7 - [thème] - Mixte - 4 - 4min
16. SÉQUENCE #8 - [thème] - Comparée - 2v2 - 3min
17. ANNONCE FIN - Score final
18. ANNONCE FIN - Remerciements
19. FIN
```

**Note :** Les champs `[thème]` sont à compléter par le MC.

---

### 4.4 Manipulation des Lignes

**Actions possibles :**
- ➕ **Ajouter** : Click "Ajouter ligne" → Sélection type → Saisie champs
- ✏️ **Éditer** : Click ligne → Modification champs
- 🗑️ **Supprimer** : Click "Supprimer" sur ligne
- ⋮ **Réorganiser** : Drag & drop handle pour changer ordre

---

## 5. Système Musical

### 5.1 Points d'Assignation Musicale

**Chaque ligne de la feuille de match** peut avoir **3 points musicaux** :

1. **🎵 INTRO** : Musique jouée AVANT/AU DÉBUT de la ligne
2. **🎵 OUTRO** : Musique jouée À LA FIN de la ligne
3. **🎵 TRANSITION** : Musique jouée APRÈS la ligne, pour enchainer vers la suivante

**Exemple :**

```
SÉQUENCE #1 - Western - 3min
    🎵 INTRO      → [Western Showdown - 0:45 clip]
    🎵 OUTRO      → [Sunset Ride - fade out 0:20]
    🎵 TRANSITION → [Tumbleweed Roll - 0:30]
```

**Workflow :**
- INTRO joue au début de la séquence
- L'impro se déroule pendant 3min
- OUTRO joue à la fin (dernières 20 secondes)
- TRANSITION joue après pour enchainer vers séquence suivante

---

### 5.2 Types de Fichiers Audio : Chansons vs Bruitages

La bibliothèque audio contient **deux types distincts** de fichiers avec parsing, workflow et affichage différents :

#### **🎵 CHANSONS/MUSIQUES**

**Caractéristiques :**
- **Durée** : 2-5 minutes typiquement (musiques longues)
- **Stockage** : Dossier `/songs/`
- **Usage** : Assignées en Mode Préparation sur INTRO/OUTRO/TRANSITION
- **Métadonnées** : Complètes (30+ champs : arousal, valence, structure, climax, etc.)

**Interface :**
- Affichage : Grille avec cartes détaillées
- Filtres : Scenarios, Tempo, Émotions, Vocal/Instrumental
- Édition : Clipping, fade in/out, volume, points de lecture

**Workflow :**
- Drag & drop depuis bibliothèque vers feuille de match
- Configuration avancée après assignation
- Preview complète ou clip

---

#### **🔊 BRUITAGES/SFX (Sound Effects)**

**Caractéristiques :**
- **Durée** : 1-10 secondes typiquement (sons courts)
- **Stockage** : Dossier `/sfx/`
- **Usage** : Recherche rapide en Mode Live pour imprévus
- **Métadonnées** : Minimales (titre, durée, catégorie)

**Métadonnées SFX uniquement :**
```json
{
  "sfx_id": "sfx_001",
  "title": "Cat Meow",
  "duration": 2,
  "category": "Animaux",
  "file_path": "/audio/sfx/cat_meow.mp3"
}
```

**Catégories bruitages :**
- Animaux (chat, chien, oiseau, etc.)
- Véhicules (klaxon, moteur, frein, etc.)
- Foule (applaudissements, rires, huées, etc.)
- Nature (pluie, vent, tonnerre, etc.)
- Objets (porte, téléphone, verre cassé, etc.)
- Autre (sons divers)

**Interface :**
- Affichage : Liste compacte ou badges cliquables
- Filtres : Catégorie, recherche texte
- Édition : Aucune (play direct)

**Workflow :**
- **Pas d'assignation en Préparation** (spontanés)
- Recherche rapide en Mode Live : Input + suggestions
- Click → Play immédiat (sans configuration)

---

#### **Distinction Automatique**

**Méthode :** Organisation par dossiers

```
/audio
  /songs/          → Type: "music" → Métadonnées complètes
    western_showdown.mp3
    love_theme.mp3
    ...
  /sfx/            → Type: "sfx" → Métadonnées minimales
    cat_meow.mp3
    applause.mp3
    phone_ring.mp3
    ...
```

**Fichier `music_library.json` :**

```json
{
  "musics": [
    {
      "music_id": "music_042",
      "type": "music",
      "metadata": { ... }  // Complètes (30+ champs)
    }
  ],
  "sfx": [
    {
      "sfx_id": "sfx_001",
      "type": "sfx",
      "title": "Cat Meow",
      "duration": 2,
      "category": "Animaux",
      "file_path": "/audio/sfx/cat_meow.mp3"
    }
  ]
}
```

---

### 5.3 Métadonnées Musicales Complètes (Chansons)

Chaque **chanson** de la bibliothèque contient les métadonnées suivantes :

#### **📁 Métadonnées de Base (fichier)**

- **Titre** : Nom de la piste
- **Artiste** : Interprète/compositeur
- **Album** : Album d'origine
- **Durée totale** : Durée en mm:ss
- **Format** : mp3, wav, etc.
- **Chemin serveur** : Emplacement fichier (centralisé)
- **Cover/Image** : Pochette album ou image générée

---

#### **🎭 Métadonnées Émotionnelles (analyse AI)**

**Modèle Arousal-Valence (dimensions principales) :**

- **Valence** (échelle -1 à +1)
  - `-1` = Négatif, Triste, Sombre
  - `0` = Neutre
  - `+1` = Positif, Joyeux, Lumineux

- **Arousal** (échelle -1 à +1)
  - `-1` = Calme, Relaxant, Lent
  - `0` = Modéré
  - `+1` = Énergique, Excitant, Intense

- **Dominance** (échelle -1 à +1)
  - `-1` = Soumis, Doux, Subtil
  - `0` = Équilibré
  - `+1` = Dominant, Puissant, Affirmé

**Émotions discrètes (tags multi-sélection) :**
- Joyeux, Triste, Calme, Énergique, Mystérieux, Dramatique, Romantique, Tendu, Nostalgique, Épique, Héroïque, Sombre, Ludique, etc.

---

#### **🎼 Caractéristiques Audio Techniques**

- **Tempo (BPM)** : Battements par minute (ex: 120 BPM)
- **Tonalité/Key** : Tonalité musicale (Do majeur, La mineur, etc.)
- **Mode** : Majeur / Mineur
- **Vocal/Instrumental** : Avec paroles / Sans paroles
- **Instruments dominants** : Piano, Guitare, Cordes, Synthé, Batterie, Cuivres, etc.
- **Dynamique** : Variation de volume (Compressé / Dynamique)
- **Spectral Centroid** : Brillance du son (Grave / Médium / Aigu)
- **Event Density** : Densité d'événements musicaux (Sparse / Dense)

---

#### **🎪 Métadonnées pour Improvisation**

- **Genre** : Rock, Jazz, Classique, Électro, Hip-Hop, Folk, Cinématique, etc.
- **Mood/Ambiance** : Mystérieux, Joyeux, Dramatique, Tendu, Relaxant, etc.
- **Énergie** (échelle 1-10) : Niveau d'intensité générale
- **Scenarios d'impro** (tags multi-sélection) :
  - Action, Romance, Comédie, Western, Fantastique, Science-Fiction, Policier, Horreur, Aventure, Drame, Historique, etc.
- **Tags libres** : Tags personnalisés ajoutés manuellement

---

#### **✂️ Métadonnées de Structure & Clipping**

**Structure de la chanson (détection auto) :**

- **Sections détectées** : Intro / Verse / Chorus / Bridge / Outro
- **Timestamps sections** :
  - Intro : 0:00 - 0:15
  - Verse 1 : 0:15 - 0:45
  - Chorus : 0:45 - 1:15
  - Etc.

**Points clés :**

- **Climax** : Timestamp du point culminant (ex: 2:15)
- **Hook** : Accroche principale (timestamp)
- **Clip start** : Début de l'extrait intéressant (auto ou manuel)
- **Clip end** : Fin de l'extrait intéressant
- **Durée clip** : Durée de l'extrait clippé

---

#### **🎬 Métadonnées Spécifiques INTRO/OUTRO**

**Caractéristiques INTRO :**

- **Type d'intro** :
  - Progressive (buildup graduel)
  - Immédiate (direct, percutant)
  - Minimale (ambient, subtile)
- **Durée intro** : Timestamp où l'intro se termine
- **Éléments intro** : Solo instrumental / Ambiance / Riff principal / Voix
- **Tempo intro** : Plus lent / Égal / Plus rapide que le reste

**Caractéristiques OUTRO :**

- **Type d'outro** :
  - Fadeout (fondu progressif)
  - Full Stop (arrêt net)
  - Répétition Chorus (chorus en boucle)
  - Section unique (outro original)
- **Durée outro** : Timestamp où l'outro commence
- **Avec/Sans paroles** : Lyrics présents ou non
- **Adapté pour transition DJ** : Oui / Non (pour enchainements)

---

### 5.3 Extraction des Métadonnées

**Automatique (analyse backend) :**
- Maximum de métadonnées extraites automatiquement
- Outils : Essentia, Librosa, modèles ML pour émotion
- Pipeline Python d'analyse audio

**Correction manuelle :**
- Interface d'édition des métadonnées
- Correction/enrichissement par Régisseur Son
- Tags libres personnalisés

---

### 5.4 Bibliothèque Musicale - Interface

#### **Layout**

```
┌─────────────────────────────────────────────────────────┐
│  🎵 BIBLIOTHÈQUE MUSICALE (777 pistes)                  │
├─────────────────┬───────────────────────────────────────┤
│  FILTRES        │  GRILLE MUSIQUES                      │
│                 │                                        │
│  🔍 Recherche   │  ┌─────────┐ ┌─────────┐ ┌─────────┐│
│  [texte libre]  │  │🎸Western│ │❤️Romance│ │🎭Drama  ││
│                 │  │Showdown │ │Theme    │ │Tension ││
│  🎭 Scenarios   │  │Outlaws  │ │Strings  │ │Orchestra││
│  ☑ Western      │  │⚡8/10    │ │⚡3/10   │ │⚡7/10   ││
│  ☐ Romance      │  │⏱️2:45    │ │⏱️4:20   │ │⏱️3:10   ││
│  ☐ Action       │  │[▶️][Clip]│ │[▶️][Clip]│ │[▶️][Clip]││
│  ☐ Comédie      │  └─────────┘ └─────────┘ └─────────┘│
│                 │  ┌─────────┐ ┌─────────┐ ┌─────────┐│
│  🎼 Techniques  │  │...      │ │...      │ │...      ││
│  Tempo          │  └─────────┘ └─────────┘ └─────────┘│
│  [80━━●━━160]   │                                       │
│  ☑ Vocal        │  Affichage : [Grille ▾] [Liste]     │
│  ☑ Instrumental │  Tri : [Énergie ▾] [Titre] [Durée]  │
│                 │                                       │
│  📊 Émotions    │                                       │
│  Valence        │  ─────────────────────────────────── │
│  [-1━━●━━+1]    │  🎧 LECTEUR PREVIEW:                 │
│  Arousal        │  ▶️ Western Showdown - 0:45 / 2:45   │
│  [-1━━●━━+1]    │  [⏮️] [▶️] [⏭️] [Volume━━●━━━]       │
└─────────────────┴───────────────────────────────────────┘
```

#### **Filtres Principaux**

**🎭 Scenarios (tags) :**
- Checkboxes : Western, Romance, Action, Comédie, Fantastique, etc.
- Multi-sélection possible

**🎼 Caractéristiques Techniques :**
- **Tempo** : Slider 60-180 BPM (range)
- **Vocal/Instrumental** : Checkboxes
- **Tonalité** : Dropdown (optionnel)

**🔍 Recherche Texte Libre :**
- Recherche dans Titre, Artiste, Album, Tags

**📊 Émotions (avancé) :**
- Sliders Valence / Arousal / Dominance
- Pour utilisateurs expérimentés

**Tri/Affichage :**
- Tri : Énergie / Titre / Durée / BPM
- Affichage : Grille (cartes) / Liste (compacte)

---

### 5.5 Workflow d'Assignation

**En Mode Préparation :**

1. **Layout split-screen**
   - Gauche : Feuille de match
   - Droite : Bibliothèque musicale

2. **Drag & drop**
   - Marc drag "Western Showdown" depuis bibliothèque
   - Drop sur "SÉQUENCE #1 → INTRO"
   - Assignation immédiate

3. **Édition après assignation (optionnel)**
   - Click sur musique assignée
   - Panneau d'édition apparaît :
     - Lecture : Entier / Clip auto / Custom clip
     - Point de départ : 0:00 / Hook / Climax / Custom
     - Fade in/out : Oui/Non + durée
     - Volume : Slider 0-100%
   - Valider ou fermer

4. **Prévisualisation**
   - Click ▶️ Preview : Écoute musique complète
   - Click 🎬 Clip : Écoute extrait clippé
   - Lecteur en bas de bibliothèque

---

## 6. Interfaces

### 6.1 Interface MC - Mode Préparation

**Objectif :** Créer/modifier la feuille de match facilement.

**Layout :**

```
┌──────────────────────────────────────────────────────┐
│  🎭 CRÉATION FEUILLE DE MATCH                        │
│  Match vs Les Improvisés - 15/10/2025               │
├──────────────────────────────────────────────────────┤
│  📋 Infos Générales: [✏️ Éditer]                    │
│  - Date: 15/10/2025  Heure: 20h30                   │
│  - Lieu: Théâtre Municipal                          │
│  - Équipe A: Les Fous du Roi (Bleu)                │
│  - Équipe B: Les Improvisés (Rouge)                │
│                                                      │
│  👥 Personnel Affecté:                              │
│  - MC: Julie ✓ (assigné par admin)                 │
│  - Son: [Sélectionner ▾] → Marc ✓                  │
│  - Arbitre: [Sélectionner ▾] → Pierre ✓            │
│  - Lumière: [Sélectionner ▾] → Sophie ✓            │
│                                                      │
├──────────────────────────────────────────────────────┤
│  📜 LIGNES DE LA FEUILLE:                           │
│  [+ Ajouter Ligne] [📋 Charger Template]           │
│                                                      │
│  1. ⋮ ARRIVÉE - Arbitre - 19h45                    │
│     [✏️] [🗑️]                                       │
│                                                      │
│  2. ⋮ ARRIVÉE - Joueurs Équipe A - 19h50           │
│     [✏️] [🗑️]                                       │
│                                                      │
│  3. ⋮ ÉCHAUFFEMENT PUBLIC - 10min                  │
│     [✏️] [🗑️]                                       │
│                                                      │
│  4. ⋮ SÉQUENCE #1 - Western - Comparée - 2v2 - 3min│
│     Thème: "Duel au saloon"                        │
│     [✏️] [🗑️]                                       │
│                                                      │
│  5. ⋮ SÉQUENCE #2 - Romance - Comparée - 1v1 - 5min│
│     Thème: "Première rencontre"                    │
│     [✏️] [🗑️]                                       │
│                                                      │
│  ... (scroll pour voir toutes les lignes)          │
│                                                      │
├──────────────────────────────────────────────────────┤
│  [💾 Sauvegarder] [📤 Notifier le Son]             │
│  [🔄 Mode Live →]                                   │
└──────────────────────────────────────────────────────┘
```

**Actions :**
- Éditer infos générales
- Assigner personnel (dropdowns depuis annuaire troupe)
- Charger template standard
- Ajouter/éditer/supprimer lignes
- Drag & drop ⋮ handle pour réorganiser
- Sauvegarder (auto + manuel)
- Notifier le Son (si changements)

---

### 6.2 Interface MC - Mode Live

**Objectif :** Vue compacte pour gérer le spectacle en temps réel.

**Layout :**

```
┌────────────────────────────────────────┐
│  🎭 MODE LIVE 🔴                       │
│  Match vs Les Improvisés               │
│  [⏸️ Pause Match] [🔄 Mode Prep]       │
├────────────────────────────────────────┤
│  🔴 EN COURS:                          │
│  ┌──────────────────────────────────┐ │
│  │  SÉQUENCE #2 - Romance           │ │
│  │  Comparée - 1v1 - 5min           │ │
│  │  Thème: "Première rencontre"     │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ⏱️ CHRONO: 02:34 / 05:00             │
│  [▶️ Démarrer] [⏸️ Pause] [⏹️ Stop]    │
│  [⏭️ Passer à la ligne suivante]       │
│                                        │
│  📊 SCORE ACTUEL:                      │
│  Équipe A (Bleu):  12 pts              │
│  Équipe B (Rouge): 15 pts              │
│  [+1 A] [-1 A] [+1 B] [-1 B]          │
│                                        │
├────────────────────────────────────────┤
│  📜 PROGRESSION (condensée):           │
│  1. ARRIVÉE Arbitre ✅                 │
│  2. ARRIVÉE Joueurs A ✅               │
│  3. ARRIVÉE Joueurs B ✅               │
│  4. ARRIVÉE MC ✅                      │
│  5. ÉCHAUFFEMENT PUBLIC ✅             │
│  6. SÉQUENCE #1 ✅                     │
│  7. SÉQUENCE #2 🔴 EN COURS            │
│  8. SÉQUENCE #3                        │
│  9. PAUSE                              │
│  10. SÉQUENCE #4                       │
│  ... (scroll)                          │
└────────────────────────────────────────┘
```

**Fonctionnalités :**
- **Chronomètre manuel** : Démarrer/Pause/Stop
- **Passage ligne suivante** : Automatique si chrono = 0:00 ou manuel
- **Score manuel** : Boutons +1/-1 par équipe
- **Vue progression** : Liste condensée avec checkmarks
- **Communication visuelle** : Julie regarde spectacle, coordonne avec Marc visuellement

---

### 6.3 Interface Son - Mode Préparation

**Objectif :** Assigner musiques aux points INTRO/OUTRO/TRANSITION.

**Layout :**

```
┌──────────────────────────────┬──────────────────────────────────┐
│  📋 FEUILLE DE MATCH         │  🎵 BIBLIOTHÈQUE (777)           │
│  Match vs Les Improvisés     │                                  │
│  ────────────────────────    │  🔍 Recherche: [____________]    │
│                              │                                  │
│  4. SÉQUENCE #1 - Western    │  🎭 Scenarios:                   │
│     Comparée - 2v2 - 3min    │  ☑ Western  ☐ Romance  ☐ Action │
│                              │                                  │
│     🎵 INTRO  [vide]         │  🎼 Tempo: [80━━●━━160] BPM     │
│     🎵 OUTRO  [vide]         │  ☑ Vocal  ☑ Instrumental        │
│     🎵 TRANS  [vide]         │                                  │
│                              │  ┌───────────────────────────┐  │
│  5. SÉQUENCE #2 - Romance    │  │ 🎸 Western Showdown       │  │
│     Comparée - 1v1 - 5min    │  │ The Outlaws               │  │
│                              │  │ Énergie: 8/10  ⏱️ 2:45    │  │
│     🎵 INTRO  [vide]         │  │ BPM: 135  Instrumental    │  │
│     🎵 OUTRO  [vide]         │  │ [▶️ Preview] [🎬 Clip]     │  │
│     🎵 TRANS  [vide]         │  └───────────────────────────┘  │
│                              │                                  │
│  6. PAUSE - 15min            │  [Carte 2] [Carte 3] [Carte 4]  │
│     🎵 INTRO  [vide]         │  ...                            │
│     🎵 OUTRO  [vide]         │                                  │
│     🎵 TRANS  [vide]         │  Affichage: [Grille▾] Tri: [▾] │
│                              │                                  │
│  ... (scroll)                │  ───────────────────────────────│
│                              │  🎧 LECTEUR PREVIEW:            │
│  [💾 Sauvegarder]            │  ▶️ [Titre] - 0:00 / 0:00       │
│  [🔄 Mode Live →]            │  [⏮️] [▶️] [⏭️] Vol: [━●━━━]    │
└──────────────────────────────┴──────────────────────────────────┘
```

**Workflow :**
1. Consulte feuille de match (gauche)
2. Utilise filtres bibliothèque (droite)
3. Drag "Western Showdown" → Drop sur "SÉQUENCE #1 → INTRO"
4. Musique assignée → Affichage : `🎵 INTRO [🎸 Western Showdown 2:45]`
5. Click sur musique assignée → Panneau édition (clipping, fade, volume)
6. Continue pour toutes les lignes
7. Sauvegarde automatique

---

### 6.4 Interface Son - Mode Live

**Objectif :** Jouer musiques assignées + réagir aux imprévus.

**Layout :**

```
┌─────────────────────────────────────────────────────┐
│  🎵 MODE LIVE 🔴                                    │
│  Match vs Les Improvisés                            │
│  [🔄 Mode Prep]                                     │
├─────────────────────────────────────────────────────┤
│  🔴 EN COURS (synchronisé avec MC):                 │
│  ┌───────────────────────────────────────────────┐ │
│  │  SÉQUENCE #2 - Romance - 1v1 - 5min          │ │
│  │  ⏱️ Temps restant: 02:34 / 05:00              │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  🎵 MUSIQUES ASSIGNÉES:                            │
│  ┌─────────────────────────────────────────────┐  │
│  │ INTRO  [❤️ Love Theme - 4:20]               │  │
│  │        [▶️ JOUER] [✏️ Éditer]                │  │
│  ├─────────────────────────────────────────────┤  │
│  │ OUTRO  [🌅 Sunset Romance - 3:15]           │  │
│  │        [▶️ JOUER] [✏️ Éditer]                │  │
│  ├─────────────────────────────────────────────┤  │
│  │ TRANS  [🎻 String Interlude - 1:30]         │  │
│  │        [▶️ JOUER] [✏️ Éditer]                │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  🎧 LECTEUR PRINCIPAL:                             │
│  ┌───────────────────────────────────────────────┐│
│  │ ▶️ Love Theme                                 ││
│  │ ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 1:23  ││
│  │ [⏮️] [▶️/⏸️] [⏹️] [⏭️] [Climax] [Fade Out]    ││
│  │ Volume: [━━━━━●━━━━] 60%                      ││
│  └───────────────────────────────────────────────┘│
│                                                     │
│  🔍 RECHERCHE RAPIDE BRUITAGES:                    │
│  [Recherche...] → [Applause][Cat][Phone][Horn]    │
│                                                     │
│  📜 PROGRESSION:                                    │
│  6. SÉQUENCE #1 ✅                                  │
│  7. SÉQUENCE #2 🔴                                  │
│  8. SÉQUENCE #3                                     │
│  9. PAUSE                                           │
└─────────────────────────────────────────────────────┘
```

**Fonctionnalités :**
- **Synchronisation** : Voit impro en cours + chrono du MC (WebSocket)
- **Jouer musiques assignées** : Click ▶️ JOUER sur INTRO/OUTRO/TRANS
- **Lecteur principal** : Contrôles complets (play, pause, stop, skip climax, fade out, volume)
- **Recherche rapide bruitages** : Pour imprévus (chat, klaxon, etc.)
- **Édition possible** : Peut modifier assignation même en live (si besoin)
- **Vue progression** : Sait où on en est dans le match

---

## 7. Permissions & Rôles

### 7.1 Matrice de Permissions

| Action | Admin | MC assigné | Son assigné | Autres membres |
|--------|-------|------------|-------------|----------------|
| **Créer nouveau match** | ✅ | ❌ | ❌ | ❌ |
| **Assigner MC au match** | ✅ | ❌ | ❌ | ❌ |
| **Éditer infos générales match** | ✅ | ✅ | ❌ | ❌ |
| **Assigner Son/Arbitre/Lumière** | ✅ | ✅ | ❌ | ❌ |
| **Modifier feuille de match (structure)** | ✅ | ✅ | ❌ | ❌ |
| **Assigner musiques INTRO/OUTRO/TRANS** | ✅ | ❌ | ✅ | ❌ |
| **Voir feuille AVANT spectacle** | ✅ | ✅ | ✅ | ❌ |
| **Voir feuille PENDANT spectacle** | ✅ | ✅ | ✅ | ❌ |
| **Voir matchs PASSÉS** | ✅ | ✅ | ✅ | ✅ |
| **Gérer bibliothèque musicale** | ✅ | ❌ | ✅ | ❌ |
| **Éditer métadonnées musiques** | ✅ | ❌ | ✅ | ❌ |

### 7.2 Workflow de Permissions

**J-7 :**
- **Admin** crée match et assigne Julie (MC)

**J-5 :**
- **Julie (MC)** édite feuille, assigne Marc (Son), Pierre (Arbitre), Sophie (Lumière)

**J-3 :**
- **Marc (Son)** assigne musiques (accès lecture feuille + écriture musiques)

**J-0 (avant spectacle) :**
- **Julie + Marc** : Accès complet feuille
- **Autres membres (joueurs, etc.)** : Pas d'accès (secret)

**J-0 (pendant spectacle) :**
- **Julie + Marc** : Accès complet Mode Live
- **Autres membres** : Toujours pas d'accès

**Après spectacle :**
- **Tous les membres troupe** : Accès lecture seule aux matchs passés

---

## 8. Synchronisation Temps Réel

### 8.1 Architecture WebSocket

**Technologie :** Socket.IO (WebSocket + fallback)

**Connexion :**
- Client MC se connecte → Join room `match_{match_id}`
- Client Son se connecte → Join room `match_{match_id}`
- Serveur diffuse événements dans la room

### 8.2 Événements Synchronisés

**De MC vers Son :**

1. **`live_mode_activated`**
   - MC active Mode Live
   - Son reçoit notification pour activer aussi

2. **`line_started`**
   - MC lance une ligne (ex: SÉQUENCE #2)
   - Son voit : "🔴 EN COURS : SÉQUENCE #2"
   - Payload : `{ line_id, line_type, line_title, duration }`

3. **`chrono_update`**
   - MC démarre/pause/stop chronomètre
   - Son voit le chrono en temps réel
   - Payload : `{ elapsed_time, remaining_time, status }`

4. **`line_completed`**
   - MC passe à ligne suivante
   - Son voit mise à jour progression
   - Payload : `{ line_id, next_line_id }`

**De Son vers MC (optionnel, pour V2) :**

5. **`music_playing`**
   - Son lance une musique
   - MC peut voir indicateur (optionnel)
   - Payload : `{ music_id, music_title, point_type }`

**Bidirectionnel :**

6. **`match_updated`**
   - Modification feuille de match pendant préparation
   - Mise à jour temps réel pour tous les connectés
   - Payload : `{ match_data }`

### 8.3 Latence Cible

**< 1 seconde** entre action MC et affichage chez Son.

**Gestion déconnexion :**
- Reconnexion automatique
- Re-synchronisation état (ligne en cours, chrono)

---

## 9. Requirements Techniques

### 9.1 Architecture

#### **🌐 Architecture Cloud & Hosting**

**Serveur :**
- **Hébergement** : Hostinger Cloud
- **Stockage** : 200 GB (suffisant pour 777+ pistes + bruitages)
- **Organisation** :
  - `/audio/songs/` : Chansons (2-5 min) - ~150-250 MB
  - `/audio/sfx/` : Bruitages (1-10 sec) - ~100 fichiers (~10 MB)
  - `/data/` : Fichiers JSON (matchs, personnel, bibliothèque)
  - `/logs/` : Logs applicatifs pour debugging

**Backend :**
- **Framework** : Express.js (Node.js)
- **WebSocket** : Socket.IO (synchronisation MC ↔ Son)
- **API REST** : CRUD matchs, musiques, personnel
- **Stockage** : Fichiers JSON (migration DB future)
- **Audio Serving** : Streaming fichiers audio via routes Express

---

#### **📱 Applications Clientes (PWA)**

**Progressive Web Apps (PWA)** : Applications web installables fonctionnant offline.

**🎭 Application MC (Smartphone)** :

- **Device** : Smartphone (iOS/Android)
- **Type** : PWA installable
- **Mode** : **LIVE UNIQUEMENT** (pas de mode Préparation)
- **Fonctionnalités** :
  - Lecture seule de la feuille de match
  - Chronomètre manuel avec contrôles
  - Saisie des scores
  - Progression visuelle du match
  - Synchronisation temps réel avec Son (WebSocket)
- **Offline** : **Lecture seule** (pas de modifications)
  - Cache : Feuille de match en cours
  - Si déconnecté : Peut consulter mais pas modifier
- **UI** : Interface tactile optimisée, grandes zones cliquables
- **Préparation** : Se fait sur laptop/desktop (pas sur smartphone)

**🎵 Application Son (Laptop)** :

- **Device** : Ordinateur portable (laptop)
- **Type** : PWA installable
- **Modes** : Préparation + Live
- **Fonctionnalités** :
  - Mode Préparation : Assignation musiques (drag & drop, édition)
  - Mode Live : Lecture musiques, recherche bruitages
  - Synchronisation temps réel avec MC (WebSocket)
- **Offline** : Fonctionnalités complètes avec cache
  - Cache : Feuille + musiques assignées + bruitages
  - Total cache : ~160-260 MB

**Cache Strategy (Son)** :

1. **Téléchargement progressif pendant assignation** :
   - Quand Marc assigne une musique → Téléchargement automatique en arrière-plan
   - Stockage : Service Worker Cache Storage API

2. **Bouton manuel "Télécharger tout"** :
   - Bouton dans interface : "💾 Télécharger toutes les musiques (150 MB)"
   - Télécharge toutes les musiques assignées d'un coup

3. **Bruitages** :
   - **TOUS les bruitages téléchargés** (~100 fichiers, ~10 MB)
   - Téléchargement auto au chargement de l'app ou lors de l'activation Mode Live

4. **Total cache estimé** :
   - Chansons assignées : ~150-250 MB (dépend du match)
   - Bruitages complets : ~10 MB
   - Métadonnées + interface : <1 MB
   - **Total : ~160-260 MB**

---

#### **🔄 Synchronisation Temps Réel**

**WebSocket (Socket.IO)** :
- Connexion MC ↔ Son via room `match_{match_id}`
- Latence cible : < 1 seconde
- **Optionnel** : Peut être supprimée (fonctionnement autonome)

**Fallback si pas d'internet** :
- MC smartphone : Fonctionne en lecture seule
- Son laptop : Fonctionne normalement avec cache
- Pas de synchronisation temps réel (coordination manuelle MC ↔ Son)

---

#### **💻 Frontend**

- **Framework** : Vue.js 3 (Composition API)
- **UI** : Composants réutilisables (LineEditor, MusicCard, Filters, etc.)
- **State Management** : Pinia ou Composition API avec `ref`/`reactive`
- **Routing** : Vue Router (pages : Home, MatchList, MatchEdit, MCLive, SonPrep, SonLive)
- **PWA** :
  - Service Worker pour cache offline
  - Cache Storage API pour fichiers audio
  - Manifest.json pour installation
  - Offline-first strategy

---

#### **🎧 Audio**

- **Lecteur** : HTML5 Audio API
- **Streaming** : Fichiers audio servis par Hostinger
- **Pre-loading** : Pre-cache musiques assignées en Mode Live (PWA)
- **Formats** : MP3 (compatibilité universelle)

---

#### **🤖 Analyse Musicale**

- **Pipeline Python** : Analyse métadonnées (Essentia, Librosa, modèles ML)
- **Exécution** : Script séparé générant `music_library.json`
- **Mise à jour** : Manuelle (relance script si nouvelles pistes)

### 9.2 Structure Fichiers

**Fichiers JSON :**

```
/data
  /matches
    match_001.json
    match_002.json
    ...
  /personnel
    personnel.json
  /music
    music_library.json (777+ entries)
```

**Exemple `match_001.json` :**

```json
{
  "match_id": "match_001",
  "date": "2025-10-15",
  "time": "20:30",
  "location": "Théâtre Municipal",
  "teams": {
    "a": { "name": "Les Fous du Roi", "color": "blue" },
    "b": { "name": "Les Improvisés", "color": "red" }
  },
  "personnel": {
    "mc": "julie_01",
    "sound": "marc_02",
    "referee": "pierre_03",
    "lights": "sophie_04"
  },
  "lines": [
    {
      "line_id": "line_001",
      "order": 1,
      "type": "ARRIVEE",
      "data": {
        "who": "Arbitre",
        "time": "19:45",
        "remarks": ""
      },
      "music": {
        "intro": null,
        "outro": null,
        "transition": null
      }
    },
    {
      "line_id": "line_002",
      "order": 2,
      "type": "SEQUENCE",
      "data": {
        "sequence_number": 1,
        "match_type": "Comparée",
        "players": "2v2",
        "impro_type": "Western",
        "theme": "Duel au saloon",
        "duration": "3:00",
        "constraint": "",
        "remarks": ""
      },
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
        "outro": { "music_id": "music_043", "settings": {...} },
        "transition": { "music_id": "music_044", "settings": {...} }
      }
    }
  ],
  "status": "draft|live|completed",
  "scores": {
    "team_a": 12,
    "team_b": 15
  },
  "created_at": "2025-10-08T10:00:00Z",
  "updated_at": "2025-10-10T14:30:00Z"
}
```

**Exemple `music_library.json` (extrait) :**

```json
{
  "musics": [
    {
      "music_id": "music_042",
      "metadata": {
        "base": {
          "title": "Western Showdown",
          "artist": "The Outlaws",
          "album": "Wild West",
          "duration": 165,
          "format": "mp3",
          "file_path": "/music/western_showdown.mp3",
          "cover_url": "/covers/wild_west.jpg"
        },
        "emotions": {
          "valence": 0.3,
          "arousal": 0.8,
          "dominance": 0.7,
          "tags": ["Énergique", "Tendu", "Héroïque"]
        },
        "audio": {
          "tempo_bpm": 135,
          "key": "E minor",
          "mode": "Minor",
          "vocal": false,
          "instruments": ["Guitar", "Drums", "Bass"],
          "dynamics": "Dynamic",
          "spectral_centroid": "Medium",
          "event_density": "Dense"
        },
        "impro": {
          "genre": "Cinematic",
          "mood": "Tendu",
          "energy": 8,
          "scenarios": ["Western", "Action", "Duel"],
          "tags": ["cowboy", "shootout", "desert"]
        },
        "structure": {
          "sections": [
            { "name": "Intro", "start": 0, "end": 15 },
            { "name": "Verse", "start": 15, "end": 45 },
            { "name": "Chorus", "start": 45, "end": 75 },
            { "name": "Bridge", "start": 75, "end": 105 },
            { "name": "Outro", "start": 135, "end": 165 }
          ],
          "climax": 90,
          "hook": 45,
          "clip_start": 30,
          "clip_end": 75,
          "clip_duration": 45
        },
        "intro_outro": {
          "intro_type": "Progressive",
          "intro_end": 15,
          "intro_tempo": "Equal",
          "outro_type": "Fadeout",
          "outro_start": 135,
          "outro_vocals": false,
          "dj_friendly": true
        }
      }
    }
  ]
}
```

### 9.3 Performance

**Objectifs :**

- **Chargement initial** : < 3 secondes
- **Recherche musicale** : < 500ms (777 pistes)
- **Switch Mode Live** : < 1 seconde
- **Latence WebSocket** : < 1 seconde
- **Mémoire audio** : Lazy loading (charger seulement musiques visibles/assignées)

**Optimisations :**

- Pagination/virtualisation bibliothèque musicale
- Pre-cache musiques assignées en Mode Live
- Compression JSON (gzip)
- Debounce recherche/filtres
- Index métadonnées pour recherche rapide

### 9.4 Contraintes

- **Hébergement** : Hostinger Cloud (200 GB)
- **Fichiers audio** : Stockés sur Hostinger (~160-260 MB totaux)
- **Internet** : Variable selon salles (PWA offline-first)
  - MC smartphone : Lecture seule offline
  - Son laptop : Fonctionnement complet offline avec cache
  - Synchronisation : Optionnelle (peut être désactivée)
- **Devices** :
  - MC : Smartphone (iOS/Android) - PWA
  - Son : Laptop (Windows/Mac/Linux) - PWA
  - Admin/Préparation MC : Desktop/Laptop
- **Compatible Windows** : Développement local sur Windows OK
- **Navigateurs** : Chrome, Firefox, Edge, Safari (modernes avec support PWA)
- **Cache Storage** : ~160-260 MB (musiques + bruitages)

---

### 9.5 Authentification & Rôles

#### **👤 Utilisateurs et Authentification**

**Système d'authentification** :
- **Méthode** : Email + Mot de passe
- **Stockage** : Hash sécurisé (bcrypt ou similaire)
- **Session** : JWT (JSON Web Token) ou session Express

**Rôles définis** :
1. **Admin** : Gestion complète de l'application
2. **MC** : Assigné à un match spécifique
3. **Régisseur Son** : Assigné à un match spécifique
4. **Membre Troupe** : Consultation matches passés uniquement

**Distinction Admin vs Régisseur** :
- **Admin** : Rôle permanent, gestion application (utilisateurs, matches, permissions)
- **Régisseur** : Poste tournant, assigné par match (gestion d'un match spécifique)

#### **🔐 Permissions par Rôle**

Voir section 7.1 "Matrice de Permissions" pour détails complets.

**Résumé :**
- **Admin** : Tous les droits (création matches, assignation MC, gestion bibliothèque)
- **MC assigné** : Édition feuille de match, assignation personnel
- **Son assigné** : Assignation musiques, édition métadonnées
- **Membres** : Lecture seule matches passés uniquement

#### **🎭 Impersonation (Dev/Testing)**

**Fonctionnalité pour développement** :
- **Usage** : Tester différents rôles sans changer de compte
- **Accès** : Admin + Dev uniquement
- **Interface** :
  ```
  [🔄 Impersonate] → Dropdown : Julie (MC) / Marc (Son) / Pierre (Membre)
  ```
- **Restrictions** :
  - Visible uniquement en mode dev ou pour Admin
  - Log toutes les actions avec mention "Impersonated by [admin_name]"
  - Ne pas utiliser en production (sécurité)

**Cas d'usage** :
- Tester interface MC sans se déconnecter/reconnecter
- Vérifier permissions Son
- Débugger problèmes spécifiques à un rôle

---

### 9.6 Logging & Debugging

#### **📝 Logs de Développement**

**Objectif** : Faciliter debugging par LLM/développeur.

**Intensité** :
- **Mode Dev** : Logs complets (toutes actions, requêtes, erreurs)
- **Production** : Logs erreurs + actions critiques uniquement

**Types de logs** :
1. **Actions utilisateur** :
   - Connexion/déconnexion
   - Création/modification match
   - Assignation musiques
   - Activation Mode Live

2. **Événements WebSocket** :
   - Connexion/déconnexion client
   - Événements sync (line_started, chrono_update, etc.)
   - Erreurs de transmission

3. **Erreurs** :
   - Erreurs backend (API, fichiers)
   - Erreurs frontend (catch global)
   - Erreurs audio (chargement, lecture)

**Format logs** :
```
[2025-10-10 14:30:25] [INFO] [User:marc_02] Assigned music_042 to match_001 line_007 INTRO
[2025-10-10 14:35:12] [ERROR] [WebSocket] Connection lost for match_001 client mc_julie_01
[2025-10-10 14:35:15] [WARN] [Audio] Failed to load music_099.mp3 (404 Not Found)
```

**Stockage** :
- **Fichier** : `/logs/app.log`
- **Rotation** : Logs quotidiens (app-2025-10-10.log)
- **Accès** : Admin + Dev uniquement
- **Interface** : Page Admin → "Logs" → Affichage + filtres (date, niveau, utilisateur)

**Accessibilité pour LLM** :
- Logs structurés et lisibles
- Stack traces complètes en cas d'erreur
- Contexte suffisant pour identifier la source du problème

---

## 10. Roadmap de Développement

### Phase 1 : Fondations (Sprint 1-2)

**Objectif :** Créer, éditer et stocker feuilles de match.

**Features :**
- ✅ Backend API CRUD matchs
- ✅ Interface MC Mode Préparation (création feuille)
- ✅ Types de lignes (8 types validés)
- ✅ Template standard
- ✅ Drag & drop réorganisation lignes
- ✅ Stockage JSON
- ✅ Gestion personnel (annuaire basique)
- ✅ **Admin minimal** : Pas d'authentification (développement), accès direct

**Note :** Authentification reportée en Phase 6.

**Validation :** Julie peut créer une feuille de match complète en < 10 minutes.

---

### Phase 2 : Bibliothèque Musicale (Sprint 3-4)

**Objectif :** Bibliothèque avec métadonnées et filtres.

**Features :**
- ✅ Pipeline Python analyse métadonnées
- ✅ `music_library.json` généré (777 pistes)
- ✅ API backend musiques (GET, filtres)
- ✅ Interface bibliothèque avec filtres
- ✅ Cartes musiques + preview audio
- ✅ Lecteur HTML5 Audio

**Validation :** Marc trouve une musique Western en < 30 secondes.

---

### Phase 3 : Assignation Musicale (Sprint 5-6)

**Objectif :** Drag & drop musiques sur feuille de match.

**Features :**
- ✅ Layout split-screen (feuille + bibliothèque)
- ✅ Drag & drop musiques → INTRO/OUTRO/TRANSITION
- ✅ Stockage assignations dans `match.json`
- ✅ Panneau édition musique (clipping, fade, volume)
- ✅ Preview clip
- ✅ Interface Son Mode Préparation complète

**Validation :** Marc assigne musiques pour un match complet en < 30 minutes.

---

### Phase 4 : Mode Live & Synchronisation (Sprint 7-8)

**Objectif :** Mode Live + WebSocket MC ↔ Son.

**Features :**
- ✅ Toggle Préparation/Live
- ✅ Interface MC Mode Live (chronomètre, score, progression)
- ✅ Interface Son Mode Live (musiques assignées, lecteur, recherche bruitages)
- ✅ WebSocket synchronisation (Socket.IO)
- ✅ Événements temps réel (ligne en cours, chrono)
- ✅ Passage auto ligne suivante (si chrono = 0)

**Validation :** Julie et Marc coordonnent un spectacle complet sans incident.

---

### Phase 5 : Polish & Optimisation (Sprint 9-10)

**Objectif :** Performance, UX, robustesse.

**Features :**
- ✅ Optimisation performance (lazy loading, pre-cache)
- ✅ Animations/transitions fluides
- ✅ Gestion erreurs/déconnexions
- ✅ Tests utilisateur avec vraie troupe
- ✅ Corrections bugs
- ✅ Documentation utilisateur

**Validation :** Application utilisée pour 100% des matchs de la troupe.

---

### Phase 6 : Admin & Features Avancées (V2, Sprint 11+)

**Objectif :** Interface Admin complète + features optionnelles.

**Features Admin :**
- ✅ **Authentification complète** :
  - Email + Mot de passe (bcrypt)
  - JWT ou session Express
  - Système de permissions (Admin, MC, Son, Membre)
- ✅ **Gestion utilisateurs** :
  - Création/modification/suppression
  - Assignation rôles
  - Vue d'ensemble tous les utilisateurs
- ✅ **Impersonation** :
  - Changement de rôle pour tests
  - Logs des actions impersonées
  - Accès Admin + Dev uniquement
- ✅ **Logging & Debugging** :
  - Interface logs (`/logs/app.log`)
  - Filtres (date, niveau, utilisateur)
  - Mode dev vs production
- ✅ **Interface Admin complète** :
  - Dashboard (matchs passés/à venir)
  - Gestion bibliothèque musicale (upload, édition)
  - Vue d'ensemble application

**Features optionnelles :**
- Export PDF feuilles de match
- Statistiques matchs (historique)
- Templates multiples (formats 8/12/16 impros)
- Responsive mobile complet (MC sur tablette/smartphone)
- Multi-langue (FR/EN)
- Backup automatique cloud (Hostinger)

---

## 11. Success Criteria

### 11.1 Adoption

- ✅ Utilisé pour 100% des matchs de la troupe
- ✅ Temps préparation feuille de match < 10 minutes
- ✅ Temps préparation musicale < 30 minutes
- ✅ Satisfaction utilisateurs > 4.5/5

### 11.2 Performance

- ✅ Latence synchronisation MC ↔ Son < 1 seconde
- ✅ Recherche musicale < 30 secondes
- ✅ Chargement application < 3 secondes
- ✅ Zéro incident coordination pendant spectacles live

### 11.3 Quality

- ✅ Tests de non-régression passés
- ✅ Compatibilité navigateurs modernes
- ✅ Documentation utilisateur complète
- ✅ Code maintenable et extensible

---

## 12. Risques & Mitigation

### 12.1 Risques Techniques

**Risque :** Performance avec 777 pistes audio
**Mitigation :** Lazy loading, pagination, index métadonnées

**Risque :** Latence WebSocket > 1 seconde
**Mitigation :** Optimisation Socket.IO, fallback polling, tests réseau

**Risque :** Régression features existantes
**Mitigation :** Tests automatisés, documentation exhaustive (ce PRD)

### 12.2 Risques Utilisateur

**Risque :** Adoption faible si trop complexe
**Mitigation :** UX simple, template par défaut, tests avec vraie troupe

**Risque :** Résistance au changement (habitudes papier)
**Mitigation :** Formation, démo, accompagnement première utilisation

### 12.3 Risques Organisationnels

**Risque :** Évolution besoins pendant développement
**Mitigation :** Développement par phases, validation itérative

---

## 13. Conclusion

Ce PRD définit exhaustivement **Impro Manager v2.0**, une application web complète pour la gestion des matchs d'improvisation théâtrale.

**Points clés :**
- ✅ Feuille de match flexible (8 types de lignes, drag & drop, template)
- ✅ Bibliothèque musicale intelligente (30+ métadonnées, filtres puissants)
- ✅ Assignation musicale intuitive (INTRO/OUTRO/TRANSITION par ligne)
- ✅ Mode Live optimisé (MC + Son, synchronisation temps réel)
- ✅ Permissions granulaires (Admin → MC → Son → Membres)
- ✅ Architecture scalable (Vue.js + Express + Socket.IO)

**Prochaines étapes :**
1. ✅ Validation PRD avec utilisateurs (Julie, Marc)
2. → Création wireframes détaillés
3. → Plan d'action technique (sprints)
4. → Développement Phase 1

---

*Document créé le 2025-10-10*
*Basé sur analyse approfondie des besoins utilisateurs*
*Version finale validée*
