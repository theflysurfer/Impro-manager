# 🎨 Wireframes - Impro Manager v2.0

**Maquettes textuelles des interfaces**
*Version 2.0 - Octobre 2025*

---

## Table des Matières

1. [Interface MC - Mode Préparation](#1-interface-mc---mode-préparation)
2. [Interface MC - Mode Live](#2-interface-mc---mode-live)
3. [Interface Son - Mode Préparation](#3-interface-son---mode-préparation)
4. [Interface Son - Mode Live](#4-interface-son---mode-live)
5. [Composants Réutilisables](#5-composants-réutilisables)

---

## 1. Interface MC - Mode Préparation

### 1.1 Vue d'Ensemble

**Page :** `/match/:id/edit` (mode MC)

**Objectif :** Créer et modifier la feuille de match complète.

**Breakpoints :**
- Desktop : 1280px+
- Tablet : 768-1279px
- Mobile : < 768px (V2)

---

### 1.2 Layout Complet

```
┌────────────────────────────────────────────────────────────────────────┐
│  🎭 IMPRO MANAGER                                    👤 Julie (MC)  [⚙️] │
│  ────────────────────────────────────────────────────────────────────  │
│  [🏠 Accueil] [📋 Mes Matchs] [🎵 Bibliothèque] [👥 Personnel]        │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  ← Retour à la liste                                                   │
│                                                                         │
│  🎭 FEUILLE DE MATCH                                                   │
│  Match vs Les Improvisés - 15/10/2025                                  │
│  Statut : 🟡 Brouillon                                                 │
│                                                                         │
│  [💾 Sauvegarder] [📤 Notifier le Son] [🔄 Passer en Mode Live]       │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  📋 INFORMATIONS GÉNÉRALES                              [✏️ Modifier]  │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📅 Date & Lieu                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  Date : [15/10/2025 ▾]     Heure : [20:30 ▾]                     │ │
│  │  Lieu : [Théâtre Municipal________________________]               │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  👥 Équipes                                                            │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  Équipe A                          Équipe B                       │ │
│  │  Nom  : [Les Fous du Roi_____]     Nom  : [Les Improvisés____]   │ │
│  │  Couleur : [🔵 Bleu ▾]             Couleur : [🔴 Rouge ▾]        │ │
│  │  Capitaine: [Jean D. ▾]            Capitaine: [Marie L. ▾]       │ │
│  │  Joueurs (2-5): [5 ▾]              Joueurs (2-5): [5 ▾]          │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  🎬 Personnel Technique                                                │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  MC        : [✓] Julie Fernandez (assigné par admin)             │ │
│  │  Son       : [Sélectionner ▾________________________] → Marc D.  │ │
│  │  Arbitre   : [Sélectionner ▾________________________] → Pierre M.│ │
│  │  Lumière   : [Sélectionner ▾________________________] → Sophie L.│ │
│  │  Accueil   : [Sélectionner ▾________________________] (optionnel)│ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  [✅ Enregistrer les modifications] [❌ Annuler]                       │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  📜 STRUCTURE DU MATCH                                                 │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [+ Ajouter une ligne ▾]  [📋 Charger template standard]              │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  1. ⋮⋮ ARRIVÉE                                   [✏️] [🗑️]       │ │
│  │     ─────────────────────────────────────────────────────────     │ │
│  │     Qui : Arbitre                                                 │ │
│  │     Heure : 19h45                                                 │ │
│  │     Remarques : [vide]                                            │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  2. ⋮⋮ ARRIVÉE                                   [✏️] [🗑️]       │ │
│  │     ─────────────────────────────────────────────────────────     │ │
│  │     Qui : Joueurs Équipe A                                        │ │
│  │     Heure : 19h50                                                 │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  3. ⋮⋮ ARRIVÉE                                   [✏️] [🗑️]       │ │
│  │     ─────────────────────────────────────────────────────────     │ │
│  │     Qui : Joueurs Équipe B                                        │ │
│  │     Heure : 19h50                                                 │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  4. ⋮⋮ ARRIVÉE                                   [✏️] [🗑️]       │ │
│  │     ─────────────────────────────────────────────────────────     │ │
│  │     Qui : MC                                                      │ │
│  │     Heure : 20h00                                                 │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  5. ⋮⋮ ÉCHAUFFEMENT PUBLIC                       [✏️] [🗑️]       │ │
│  │     ─────────────────────────────────────────────────────────     │ │
│  │     Durée : 10 minutes                                            │ │
│  │     Type : Jeu avec le public                                     │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  6. ⋮⋮ PRÉSENTATION ÉQUIPES                      [✏️] [🗑️]       │ │
│  │     ─────────────────────────────────────────────────────────     │ │
│  │     Durée : 5 minutes                                             │ │
│  │     Ordre : Équipe A puis B                                       │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  7. ⋮⋮ SÉQUENCE D'IMPRO #1                       [✏️] [🗑️]       │ │
│  │     ─────────────────────────────────────────────────────────     │ │
│  │     Type : Comparée  │  Joueurs : 2v2  │  Durée : 3:00           │ │
│  │     Catégorie : Western                                           │ │
│  │     Thème : "Duel au saloon"                                      │ │
│  │     Contrainte : [vide]                                           │ │
│  │     🎵 Musiques : ⚠️ Non assignées (en attente Son)               │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  8. ⋮⋮ SÉQUENCE D'IMPRO #2                       [✏️] [🗑️]       │ │
│  │     ─────────────────────────────────────────────────────────     │ │
│  │     Type : Comparée  │  Joueurs : 2v2  │  Durée : 3:00           │ │
│  │     Catégorie : Romance                                           │ │
│  │     Thème : "Première rencontre"                                  │ │
│  │     🎵 Musiques : ⚠️ Non assignées                                │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  9. ⋮⋮ SÉQUENCE D'IMPRO #3                       [✏️] [🗑️]       │ │
│  │     ─────────────────────────────────────────────────────────     │ │
│  │     Type : Comparée  │  Joueurs : 1v1  │  Durée : 5:00           │ │
│  │     Catégorie : Comédie                                           │ │
│  │     Thème : "L'entretien d'embauche"                              │ │
│  │     🎵 Musiques : ✅ Assignées par Marc                           │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ... [12 autres lignes - scroll]                                       │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  19. ⋮⋮ FIN                                      [✏️] [🗑️]       │ │
│  │     ─────────────────────────────────────────────────────────     │ │
│  │     Heure prévue : 22h00                                          │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  [+ Ajouter une ligne en bas]                                          │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  💾 Actions                                                            │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [💾 Sauvegarder (Ctrl+S)]  [📤 Notifier le Son]  [🔄 Mode Live →]    │
│                                                                         │
│  Dernière sauvegarde : Il y a 2 minutes                                │
│  Dernière modification par : Julie - 10/10/2025 14:32                  │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 1.3 Modal d'Édition de Ligne (Exemple : SÉQUENCE D'IMPRO)

**Déclencheur :** Click sur [✏️] d'une ligne SÉQUENCE

```
┌────────────────────────────────────────────────────────────────────────┐
│  ✏️ ÉDITER SÉQUENCE D'IMPRO #1                              [❌ Fermer] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  🎭 Informations de base                                               │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  Numéro de séquence : [1__]                                      │ │
│  │                                                                   │ │
│  │  Type de match :                                                 │ │
│  │  ⚫ Comparée     ⚪ Mixte                                         │ │
│  │                                                                   │ │
│  │  Nombre de joueurs :                                             │ │
│  │  Si Comparée : [2_] vs [2_]   (1-5 par équipe)                  │ │
│  │  Si Mixte    : [_] total                                         │ │
│  │                                                                   │ │
│  │  Durée :                                                          │ │
│  │  [03] min : [00] sec    [Presets : 2min | 3min | 4min | 5min]   │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  🎬 Détails de l'improvisation                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  Catégorie / Type :                                              │ │
│  │  [Western ▾] ou [Autre (saisie libre)___________]               │ │
│  │  Suggestions : Western, Chantée, Rimée, BD, Policier, etc.      │ │
│  │                                                                   │ │
│  │  Thème (texte libre) :                                           │ │
│  │  [Duel au saloon_______________________________________]         │ │
│  │                                                                   │ │
│  │  Contrainte (optionnel) :                                        │ │
│  │  [___________________________________________________________]   │ │
│  │  Exemples : "Sans parler", "Avec accent", "Objets imposés"      │ │
│  │                                                                   │ │
│  │  Remarques (optionnel) :                                         │ │
│  │  [___________________________________________________________]   │ │
│  │  [___________________________________________________________]   │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  🎵 Musiques (géré par le Régisseur Son)                               │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  INTRO       : ⚠️ Non assignée                                   │ │
│  │  OUTRO       : ⚠️ Non assignée                                   │ │
│  │  TRANSITION  : ⚠️ Non assignée                                   │ │
│  │                                                                   │ │
│  │  ℹ️ Seul le Régisseur Son peut assigner les musiques            │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  [✅ Enregistrer] [❌ Annuler]                                         │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 1.4 Interactions & États

**Drag & Drop :**
- Handle `⋮⋮` sur chaque ligne
- Hover → Indicateur de drop zone
- Drop → Réorganisation + sauvegarde auto

**Ajout de Ligne :**
```
Click sur [+ Ajouter une ligne ▾]
  ↓
Menu dropdown :
  ┌────────────────────────────┐
  │  ARRIVÉE                  │
  │  ÉCHAUFFEMENT PUBLIC      │
  │  PRÉSENTATION ÉQUIPES     │
  │  ➤ SÉQUENCE D'IMPRO       │
  │  ANNONCE INTERMÉDIAIRE    │
  │  PAUSE / ENTRACTE         │
  │  ANNONCE FIN              │
  │  FIN                      │
  └────────────────────────────┘
  ↓
Sélection d'un type
  ↓
Modal d'édition s'ouvre (vierge)
  ↓
Remplissage des champs
  ↓
[Enregistrer] → Ligne ajoutée en bas
```

**Charger Template :**
```
Click sur [📋 Charger template standard]
  ↓
Popup de confirmation :
  ┌──────────────────────────────────────┐
  │  ⚠️ Charger le template standard ?  │
  │                                      │
  │  Cela remplacera toutes les lignes  │
  │  existantes (sauf infos générales). │
  │                                      │
  │  [Confirmer] [Annuler]               │
  └──────────────────────────────────────┘
  ↓
Si [Confirmer] → Chargement de 19 lignes pré-remplies
```

**Notification Son :**
```
Click sur [📤 Notifier le Son]
  ↓
Si Marc (Son) n'est pas assigné :
  → Toast erreur : "⚠️ Aucun Régisseur Son assigné"
Sinon :
  → Envoi notification WebSocket à Marc
  → Toast succès : "✅ Marc a été notifié"
```

**Passage Mode Live :**
```
Click sur [🔄 Passer en Mode Live]
  ↓
Vérifications :
  - Feuille sauvegardée ?
  - Son assigné ?
  - Au moins 1 séquence ?
  ↓
Si OK :
  → Popup confirmation :
    ┌──────────────────────────────────────┐
    │  🔴 Activer le Mode Live ?          │
    │                                      │
    │  - L'interface sera simplifiée      │
    │  - Le Son sera notifié              │
    │  - Vous ne pourrez plus modifier    │
    │    la structure du match            │
    │                                      │
    │  [Activer le Live] [Annuler]         │
    └──────────────────────────────────────┘
  ↓
[Activer] → Transition vers Interface MC Live
          → Notification WebSocket au Son
```

---

## 2. Interface MC - Mode Live

### 2.1 Vue d'Ensemble

**Page :** `/match/:id/live/mc`

**Objectif :** Gérer le spectacle en temps réel (chronomètre, progression, score).

**Layout :** Compact, optimisé pour tablette/laptop sur scène.

---

### 2.2 Layout Complet

```
┌────────────────────────────────────────────────────────────────────────┐
│  🎭 MODE LIVE 🔴                                        👤 Julie (MC)   │
│  Match vs Les Improvisés - 15/10/2025                                  │
│                                                                         │
│  [⏸️ Pause Match] [🔄 Retour Mode Préparation]                         │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  🔴 LIGNE EN COURS                                                     │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  │          SÉQUENCE D'IMPRO #2 - ROMANCE                           │ │
│  │                                                                   │ │
│  │          Comparée - 1v1 - Durée : 5:00                           │ │
│  │          Thème : "Première rencontre"                            │ │
│  │                                                                   │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  ⏱️ CHRONOMÈTRE                                                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                          ┌──────────────┐                              │
│                          │              │                              │
│                          │    02:34     │   Écoulé                     │
│                          │  ────────    │                              │
│                          │    05:00     │   Total                      │
│                          │              │                              │
│                          └──────────────┘                              │
│                                                                         │
│                   Temps restant : 02:26                                │
│                                                                         │
│           [▶️ Démarrer] [⏸️ Pause] [⏹️ Stop] [🔄 Reset]                 │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  📊 SCORE                                                              │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────────────────────┬────────────────────────────────┐  │
│  │  Équipe A (Bleu)               │  Équipe B (Rouge)              │  │
│  │  Les Fous du Roi               │  Les Improvisés                │  │
│  │                                │                                │  │
│  │        12 points               │        15 points               │  │
│  │                                │                                │  │
│  │  [+1] [+2] [+3] [-1]           │  [+1] [+2] [+3] [-1]           │  │
│  └────────────────────────────────┴────────────────────────────────┘  │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  📜 PROGRESSION DU MATCH                                               │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  1. ✅ ARRIVÉE - Arbitre                                         │ │
│  │  2. ✅ ARRIVÉE - Joueurs Équipe A                                │ │
│  │  3. ✅ ARRIVÉE - Joueurs Équipe B                                │ │
│  │  4. ✅ ARRIVÉE - MC                                              │ │
│  │  5. ✅ ÉCHAUFFEMENT PUBLIC                                       │ │
│  │  6. ✅ PRÉSENTATION ÉQUIPES                                      │ │
│  │  7. ✅ SÉQUENCE #1 - Western                                     │ │
│  │  8. 🔴 SÉQUENCE #2 - Romance           ◄── EN COURS              │ │
│  │  9. ⏳ SÉQUENCE #3 - Comédie                                     │ │
│  │  10. ⏳ SÉQUENCE #4 - Policier                                   │ │
│  │  11. ⏳ ANNONCE INTERMÉDIAIRE                                    │ │
│  │  12. ⏳ PAUSE / ENTRACTE - 15min                                 │ │
│  │  13. ⏳ SÉQUENCE #5 - Fantastique                                │ │
│  │  14. ⏳ SÉQUENCE #6 - Drame                                      │ │
│  │  15. ⏳ SÉQUENCE #7 - Mixte                                      │ │
│  │  16. ⏳ SÉQUENCE #8 - Action                                     │ │
│  │  17. ⏳ ANNONCE FIN - Score final                                │ │
│  │  18. ⏳ ANNONCE FIN - Remerciements                              │ │
│  │  19. ⏳ FIN                                                       │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  🎬 ACTIONS                                                            │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [⏭️ Passer à la ligne suivante (SÉQUENCE #3)]                         │
│                                                                         │
│  ℹ️ Le passage se fera automatiquement quand le chrono atteint 0:00   │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 2.3 Interactions & États

**Gestion Chronomètre :**

```
État initial : ⏹️ Stopped (00:00 / 05:00)

Click [▶️ Démarrer] :
  → Chrono démarre (décompte de 05:00 → 0:00)
  → Bouton change : [⏸️ Pause]
  → WebSocket → Marc voit chrono en temps réel

Click [⏸️ Pause] :
  → Chrono pause (ex: 02:34 / 05:00)
  → Bouton change : [▶️ Reprendre]

Click [⏹️ Stop] :
  → Chrono s'arrête
  → Reset à 00:00 / 05:00
  → Popup : "Ligne terminée ?"
    ┌─────────────────────────────────┐
    │  ✅ Ligne terminée ?            │
    │                                 │
    │  [Passer à la suivante]         │
    │  [Rester sur cette ligne]       │
    └─────────────────────────────────┘

Chrono atteint 0:00 :
  → Alarme sonore (bip)
  → Popup automatique :
    ┌─────────────────────────────────┐
    │  ⏰ Temps écoulé !              │
    │                                 │
    │  Passer à SÉQUENCE #3 ?         │
    │                                 │
    │  [Passer maintenant]            │
    │  [+30 secondes]                 │
    │  [Rester ici]                   │
    └─────────────────────────────────┘
  → Si [Passer maintenant] :
    → Passage ligne suivante
    → Chrono reset à durée de la nouvelle ligne
```

**Passage Ligne Suivante :**

```
Déclencheurs :
  - Chrono atteint 0:00 (auto)
  - Click [⏭️ Passer à la ligne suivante] (manuel)
  - Click [⏹️ Stop] puis [Passer] (manuel)

Action :
  1. Ligne actuelle passe à ✅
  2. Ligne suivante devient 🔴 EN COURS
  3. Chrono reset à durée de nouvelle ligne
  4. WebSocket → Marc voit nouvelle ligne + chrono
  5. Scroll automatique dans liste progression
```

**Gestion Score :**

```
Click [+1] Équipe A :
  → Score A : 12 → 13
  → Sauvegarde automatique
  → Pas de notification temps réel (score non visible par Son)

Click [-1] Équipe A :
  → Score A : 12 → 11
  → Popup confirmation :
    ┌─────────────────────────────────┐
    │  ⚠️ Retirer 1 point ?           │
    │                                 │
    │  [Confirmer] [Annuler]          │
    └─────────────────────────────────┘
```

**Pause Match :**

```
Click [⏸️ Pause Match] :
  → Popup :
    ┌─────────────────────────────────┐
    │  ⏸️ Mettre le match en pause ?  │
    │                                 │
    │  Le chrono sera arrêté.         │
    │  Le Son sera notifié.           │
    │                                 │
    │  [Confirmer] [Annuler]          │
    └─────────────────────────────────┘
  → Si [Confirmer] :
    → Chrono pause
    → Overlay "⏸️ MATCH EN PAUSE" sur interface
    → WebSocket → Marc voit notification pause
```

**Retour Mode Préparation :**

```
Click [🔄 Retour Mode Préparation] :
  → Popup :
    ┌─────────────────────────────────┐
    │  ⚠️ Quitter le Mode Live ?      │
    │                                 │
    │  Le match sera marqué comme     │
    │  "Terminé". Vous pourrez le     │
    │  consulter en mode Archives.    │
    │                                 │
    │  [Confirmer] [Annuler]          │
    └─────────────────────────────────┘
  → Si [Confirmer] :
    → Match statut → "Terminé"
    → Redirection vers page liste matchs
    → WebSocket → Marc notifié (Mode Live désactivé)
```

---

## 2.4 Interface MC Smartphone - Mode Live

### 2.4.1 Vue d'Ensemble

**Device :** 📱 Smartphone (iOS/Android)

**Type :** PWA installable

**Mode :** **LIVE UNIQUEMENT** (pas de mode Préparation)

**Orientation :** Portrait (optimisée)

**Objectif :** Gérer le spectacle en temps réel depuis un smartphone sur scène.

**Offline :** **Lecture seule** (pas de modifications sans connexion)

---

### 2.4.2 Layout Smartphone (Portrait)

```
┌─────────────────────────────┐
│  🎭 LIVE 🔴        👤 Julie │
│  Match vs Les Improvisés    │
│  15/10/2025                 │
│                             │
│  [⏸️ Pause] [🔄 Terminer]   │
└─────────────────────────────┘

┌─────────────────────────────┐
│  🔴 EN COURS                │
├─────────────────────────────┤
│                             │
│  SÉQUENCE #2                │
│  ROMANCE                    │
│                             │
│  Comparée - 1v1             │
│  Durée : 5:00               │
│                             │
│  "Première rencontre"       │
│                             │
└─────────────────────────────┘

┌─────────────────────────────┐
│  ⏱️ CHRONOMÈTRE             │
├─────────────────────────────┤
│                             │
│                             │
│        02:34                │
│      ────────               │
│        05:00                │
│                             │
│   Restant : 02:26           │
│                             │
│   ┌───────────────────────┐ │
│   │  ▶️ DÉMARRER          │ │
│   └───────────────────────┘ │
│                             │
│   ┌──────┐ ┌──────┐        │
│   │ ⏸️ │ │ ⏹️ │        │
│   │Pause│ │ Stop│        │
│   └──────┘ └──────┘        │
│                             │
└─────────────────────────────┘

┌─────────────────────────────┐
│  📊 SCORE                   │
├─────────────────────────────┤
│                             │
│  🔵 Équipe A                │
│  Les Fous du Roi            │
│                             │
│       12 points             │
│                             │
│  [+1] [+2] [+3] [-1]        │
│                             │
│  ─────────────────────────  │
│                             │
│  🔴 Équipe B                │
│  Les Improvisés             │
│                             │
│       15 points             │
│                             │
│  [+1] [+2] [+3] [-1]        │
│                             │
└─────────────────────────────┘

┌─────────────────────────────┐
│  📜 PROGRESSION             │
├─────────────────────────────┤
│                             │
│  6. ✅ SÉQUENCE #1          │
│     Western                 │
│                             │
│  7. 🔴 SÉQUENCE #2          │
│     Romance    ◄── EN COURS │
│                             │
│  8. ⏳ SÉQUENCE #3          │
│     Comédie                 │
│                             │
│  9. ⏳ SÉQUENCE #4          │
│     Policier                │
│                             │
│  10. ⏳ ANNONCE INTER.      │
│                             │
│  11. ⏳ PAUSE - 15min       │
│                             │
│  ... [scroll]               │
│                             │
└─────────────────────────────┘

┌─────────────────────────────┐
│  🎬 ACTIONS                 │
├─────────────────────────────┤
│                             │
│  ┌───────────────────────┐  │
│  │  ⏭️ LIGNE SUIVANTE    │  │
│  │  (SÉQUENCE #3)        │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
```

---

### 2.4.3 Particularités Smartphone

**🎯 Optimisations Tactiles :**

- **Boutons larges** : Minimum 48x48px (recommandation Apple/Google)
- **Espacement généreux** : Éviter touches accidentelles
- **Swipe gestures** :
  - Swipe ⬅️ sur ligne EN COURS → Détails séquence
  - Swipe ⬇️ sur header → Actualiser données
  - Swipe ➡️ sur progression → Passer ligne suivante

**📱 Interactions Tactiles :**

```
Tap [▶️ DÉMARRER] :
  → Chrono démarre
  → Bouton change : [⏸️ Pause]
  → Vibration haptique légère (si supporté)
  → Notification Son via WebSocket

Long press [+1] Score :
  → Popup rapide :
    ┌─────────────────────┐
    │  Ajouter combien ?  │
    │                     │
    │  [+1] [+2] [+3]     │
    │  [+5] [+10]         │
    │                     │
    │  [Annuler]          │
    └─────────────────────┘
  → Ajout rapide points multiples

Swipe ➡️ sur séquence EN COURS :
  → Popup confirmation :
    ┌─────────────────────┐
    │  ⏭️ Passer à la     │
    │  ligne suivante ?   │
    │                     │
    │  SÉQUENCE #3        │
    │  Comédie - 5:00     │
    │                     │
    │  [Confirmer]        │
    │  [Annuler]          │
    └─────────────────────┘
```

**🔌 Mode Offline :**

```
Si connexion perdue :
  → Banner sticky en haut :
    ┌─────────────────────────────┐
    │  ⚠️ MODE HORS LIGNE        │
    │  Lecture seule              │
    │  Reconnexion auto...        │
    └─────────────────────────────┘
  → Boutons désactivés (grisés) :
    - Score (+1, +2, etc.)
    - Passer ligne suivante
    - Pause match
  → Chrono continue en lecture seule
  → Données affichées : dernière synchro
  → Reconnexion auto toutes les 5 sec
```

**💾 Installation PWA :**

```
Première visite sur smartphone :
  → Popup installation :
    ┌─────────────────────────────┐
    │  📱 Installer l'application│
    │                             │
    │  Ajouter Impro Manager à    │
    │  l'écran d'accueil pour un  │
    │  accès rapide en live.      │
    │                             │
    │  [Installer] [Plus tard]    │
    └─────────────────────────────┘

Installation iOS (Safari) :
  → Afficher instructions :
    "Appuyez sur   puis
     'Sur l'écran d'accueil'"

Installation Android (Chrome) :
  → Prompt natif Android automatique
```

**🔋 Économie Batterie :**

- **Screen wake lock** : Écran reste allumé pendant le live
- **Thème sombre** : Réduit consommation OLED
- **Animations réduites** : Préserve CPU/GPU
- **WebSocket heartbeat** : Réduit à 10 sec (vs 5 sec desktop)

---

### 2.4.4 Orientation Paysage (Optionnelle)

**Si smartphone tourné en paysage :**

```
┌──────────────────────────────────────────────────────────┐
│  🎭 LIVE 🔴  Match vs Les Improvisés    👤 Julie         │
├────────────────────────┬─────────────────────────────────┤
│  🔴 SÉQUENCE #2        │  ⏱️ CHRONO        📊 SCORE      │
│  ROMANCE               │                                  │
│  Comparée - 1v1 - 5:00 │     02:34        🔵 12  🔴 15   │
│  "1ère rencontre"      │   ────────                      │
│                        │     05:00        [+1] [+2] [+3] │
│  [▶️] [⏸️] [⏹️]         │                  [+1] [+2] [+3] │
│                        │   [⏭️ Suivant]                   │
├────────────────────────┴─────────────────────────────────┤
│  📜 PROGRESSION                                          │
│  6.✅ Western  7.🔴 Romance  8.⏳ Comédie  9.⏳ Policier  │
└──────────────────────────────────────────────────────────┘
```

**Note :** Layout paysage plus compact, tous éléments visibles sans scroll.

---

## 3. Interface Son - Mode Préparation

### 3.1 Vue d'Ensemble

**Page :** `/match/:id/sound-prep`

**Objectif :** Assigner musiques aux points INTRO/OUTRO/TRANSITION de chaque ligne.

**Layout :** Split-screen (Feuille de match | Bibliothèque musicale)

---

### 3.2 Layout Complet

```
┌────────────────────────────────────────────────────────────────────────┐
│  🎭 IMPRO MANAGER                                    👤 Marc (Son)  [⚙️] │
│  ────────────────────────────────────────────────────────────────────  │
│  [🏠 Accueil] [📋 Mes Matchs] [🎵 Bibliothèque] [👥 Personnel]        │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  ← Retour                                                              │
│                                                                         │
│  🎵 PRÉPARATION MUSICALE - Mode Son                                    │
│  Match vs Les Improvisés - 15/10/2025                                  │
│                                                                         │
│  [💾 Sauvegarder] [🔄 Passer en Mode Live]                            │
└────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┬─────────────────────────────────────────┐
│  📋 FEUILLE DE MATCH         │  🎵 BIBLIOTHÈQUE AUDIO                  │
│  (lecture seule structure)   │                                         │
├──────────────────────────────┼─────────────────────────────────────────┤
│                              │  [🎵 Musiques] [🔊 Bruitages]           │
│                              │  ───────────────────────────────────    │
│  ℹ️ Glissez-déposez les      │                                         │
│  musiques depuis la          │  📁 MUSIQUES (777 pistes)               │
│  bibliothèque →              │                                         │
│                              │  🔍 Recherche :                        │
│  🔽 Séquences seulement :    │  [______________________________]       │
│                              │                                         │
│  ┌────────────────────────┐ │  🎭 Scenarios :                        │
│  │ 7. SÉQUENCE #1         │ │  ☑ Western  ☐ Romance  ☐ Action       │
│  │    Western - 3:00      │ │  ☐ Comédie  ☐ Fantastique  ☐ Drame    │
│  │    "Duel au saloon"    │ │  [+ Plus de scenarios...]              │
│  │                        │ │                                         │
│  │    🎵 INTRO            │ │  🎼 Caractéristiques :                 │
│  │    [+ Assigner]        │ │  Tempo (BPM)  [60━━━●━━━180]          │
│  │                        │ │  ☑ Vocal  ☑ Instrumental               │
│  │    🎵 OUTRO            │ │                                         │
│  │    [+ Assigner]        │ │  📊 Émotions (avancé) :                │
│  │                        │ │  Valence  [-1━━━━●━━━+1]              │
│  │    🎵 TRANSITION       │ │  Arousal  [-1━━━━●━━━+1]              │
│  │    [+ Assigner]        │ │                                         │
│  └────────────────────────┘ │  ─────────────────────────────────────  │
│                              │  Affichage : [🔲 Grille] [☐ Liste]    │
│                              │  Tri : [Énergie ▾]                    │
│                              │  Résultats : 42 pistes                 │
│                              │                                         │
│  ┌────────────────────────┐ │  ─────────────────────────────────────  │
│  │ 8. SÉQUENCE #2         │ │  RÉSULTATS RECHERCHE (Grille) :        │
│  │    Romance - 3:00      │ │                                         │
│  │    "1ère rencontre"    │ │  ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │                        │ │  │🎸       │ │❤️       │ │🎭       │ │
│  │    🎵 INTRO            │ │  │Western  │ │Love     │ │Epic     │ │
│  │    [+ Assigner]        │ │  │Showdown │ │Theme    │ │Battle   │ │
│  │                        │ │  │         │ │         │ │         │ │
│  │    🎵 OUTRO            │ │  │Outlaws  │ │Strings  │ │Orchestra│ │
│  │    [+ Assigner]        │ │  │⚡8/10   │ │⚡3/10   │ │⚡9/10   │ │
│  │                        │ │  │⏱️2:45   │ │⏱️4:20   │ │⏱️3:15   │ │
│  │    🎵 TRANSITION       │ │  │♪ Inst.  │ │♪ Vocal  │ │♪ Inst.  │ │
│  │    [+ Assigner]        │ │  │         │ │         │ │         │ │
│  └────────────────────────┘ │  │[▶️Play] │ │[▶️Play] │ │[▶️Play] │ │
│                              │  │[🎬Clip] │ │[🎬Clip] │ │[🎬Clip] │ │
│  ┌────────────────────────┐ │  └─────────┘ └─────────┘ └─────────┘ │
│  │ 9. SÉQUENCE #3         │ │                                         │
│  │    Comédie - 5:00      │ │  ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │    "Entretien..."      │ │  │🎵       │ │🌅       │ │🎺       │ │
│  │                        │ │  │Desert   │ │Sunset   │ │Jazzy    │ │
│  │    🎵 INTRO            │ │  │Winds    │ │Romance  │ │Night    │ │
│  │    ✅ [🎸 Western...]  │ │  │⚡6/10   │ │⚡4/10   │ │⚡5/10   │ │
│  │    [✏️ Éditer]         │ │  │⏱️3:45   │ │⏱️3:20   │ │⏱️4:10   │ │
│  │                        │ │  │[▶️] [🎬]│ │[▶️] [🎬]│ │[▶️] [🎬]│ │
│  │    🎵 OUTRO            │ │  └─────────┘ └─────────┘ └─────────┘ │
│  │    ✅ [🎻 Sad Vio...] │ │                                         │
│  │    [✏️ Éditer]         │ │  ... [Plus de résultats - scroll]      │
│  │                        │ │                                         │
│  │    🎵 TRANSITION       │ │  ─────────────────────────────────────  │
│  │    [+ Assigner]        │ │  🎧 LECTEUR PREVIEW :                  │
│  └────────────────────────┘ │  ┌───────────────────────────────────┐│
│                              │  │ ▶️ Western Showdown               ││
│  ... [scroll pour voir       │  │ The Outlaws - Wild West Album     ││
│       toutes les séquences]  │  │                                   ││
│                              │  │ ●━━━━━━━━━━━━━━━━━━━━ 0:45 / 2:45││
│  [💾 Sauvegarder]            │  │                                   ││
│  [🔄 Mode Live →]            │  │ [⏮️] [▶️/⏸️] [⏹️] [⏭️]            ││
│                              │  │ Volume : [━━━━━━●━━━] 70%        ││
│                              │  │                                   ││
│                              │  │ [🎬 Jouer le clip (0:30-1:15)]    ││
│                              │  │ [📥 Détails & métadonnées]        ││
│                              │  └───────────────────────────────────┘│
└──────────────────────────────┴─────────────────────────────────────────┘
```

---

### 3.2b Layout Onglet Bruitages

**Switch onglet** : Click sur [🔊 Bruitages]

```
┌──────────────────────────────┬─────────────────────────────────────────┐
│  📋 FEUILLE DE MATCH         │  🎵 BIBLIOTHÈQUE AUDIO                  │
│  (lecture seule structure)   │                                         │
├──────────────────────────────┼─────────────────────────────────────────┤
│                              │  [🎵 Musiques] [🔊 Bruitages]           │
│                              │  ═══════════════────────────────────    │
│  ℹ️ Les bruitages ne sont    │                                         │
│  PAS assignés en Préparation │  📁 BRUITAGES (~100 fichiers)           │
│  → Recherche rapide en Live  │                                         │
│                              │  🔍 Recherche :                        │
│  🔽 Séquences seulement :    │  [______________________________]       │
│                              │                                         │
│  ┌────────────────────────┐ │  📂 Catégories :                       │
│  │ 7. SÉQUENCE #1         │ │  ☑ Animaux  ☐ Véhicules  ☐ Foule     │
│  │    Western - 3:00      │ │  ☐ Nature   ☐ Objets     ☐ Autre     │
│  │    "Duel au saloon"    │ │                                         │
│  │                        │ │  ─────────────────────────────────────  │
│  │    🎵 INTRO            │ │  Affichage : [☑ Liste] [☐ Badges]     │
│  │    [+ Assigner]        │ │  Tri : [Titre ▾]                      │
│  │                        │ │  Résultats : 12 bruitages              │
│  │    🎵 OUTRO            │ │                                         │
│  │    [+ Assigner]        │ │  ─────────────────────────────────────  │
│  │                        │ │  RÉSULTATS (Liste compacte) :          │
│  │    🎵 TRANSITION       │ │                                         │
│  │    [+ Assigner]        │ │  🐱 Cat Meow (2 sec)        [▶️ Play]  │
│  └────────────────────────┘ │  🐶 Dog Bark (3 sec)        [▶️ Play]  │
│                              │  🐦 Bird Chirp (5 sec)      [▶️ Play]  │
│                              │  🐴 Horse Neigh (4 sec)     [▶️ Play]  │
│                              │                                         │
│                              │  🚗 Car Horn (2 sec)        [▶️ Play]  │
│                              │  🚗 Car Brake (3 sec)       [▶️ Play]  │
│                              │                                         │
│                              │  👏 Applause (8 sec)        [▶️ Play]  │
│                              │  😂 Laughter (6 sec)        [▶️ Play]  │
│                              │  😱 Scream (3 sec)          [▶️ Play]  │
│                              │                                         │
│                              │  🌧️ Rain (10 sec)          [▶️ Play]  │
│                              │  ⚡ Thunder (5 sec)         [▶️ Play]  │
│                              │                                         │
│  [💾 Sauvegarder]            │  ... [Plus de bruitages - scroll]      │
│  [🔄 Mode Live →]            │                                         │
│                              │  ─────────────────────────────────────  │
│                              │  ℹ️ Bruitages utilisés en Mode Live    │
│                              │  pour les imprévus uniquement          │
└──────────────────────────────┴─────────────────────────────────────────┘
```

**Note importante** :
- Bruitages **PAS** assignables en Mode Préparation
- Usage : Recherche rapide en Mode Live
- Click [▶️ Play] → Preview immédiat (1-10 sec)
- Pas de configuration (volume, fade, clip)

---

### 3.3 Interactions & États

**Switch Onglets Bibliothèque :**

```
Click [🔊 Bruitages] :
  → Onglet "Bruitages" actif (souligné)
  → Affichage change : Liste bruitages compacte
  → Filtres changent : Catégories (Animaux, Véhicules, etc.)
  → Info affichée : "Bruitages utilisés en Mode Live uniquement"

Click [🎵 Musiques] :
  → Retour à l'onglet "Musiques"
  → Affichage change : Grille musiques avec filtres complets
```

**Drag & Drop Musique :**

```
Démarrage drag :
  → Grab carte musique "Western Showdown"
  → Carte devient semi-transparente
  → Zones de drop highlight : INTRO / OUTRO / TRANSITION

Hover zone INTRO (ligne 7) :
  → Zone INTRO s'illumine (border bleue)
  → Curseur change → 🎵

Drop sur zone INTRO :
  → Assignation immédiate
  → Affichage change :
    🎵 INTRO [+ Assigner]
      ↓
    🎵 INTRO ✅ [🎸 Western Showdown 2:45]
             [✏️ Éditer] [🗑️ Retirer]
  → Sauvegarde automatique
  → Toast : "✅ Western Showdown assigné à INTRO"
```

**Édition Musique Assignée :**

```
Click [✏️ Éditer] sur musique assignée :
  ↓
Modal d'édition s'ouvre :

┌────────────────────────────────────────────────────────────────────────┐
│  🎵 ÉDITER MUSIQUE - INTRO SÉQUENCE #1                     [❌ Fermer] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  🎸 Western Showdown - The Outlaws                                     │
│  Durée totale : 2:45 (165 secondes)                                    │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  📻 Type de lecture :                                                  │
│  ⚪ Jouer entier (0:00 → 2:45)                                         │
│  ⚫ Jouer clip automatique (0:30 → 1:15) - Recommandé                  │
│  ⚪ Clip personnalisé :                                                │
│     Début : [00:__] Fin : [__:__]                                     │
│                                                                         │
│  Visualisation :                                                       │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  Intro  │      Verse      │   Chorus   │ Bridge │ Outro         │ │
│  │  0:00   0:15            0:45         1:15     1:45            2:45│ │
│  │         │                │     ⚡      │        │                 │ │
│  │         │◄──── Clip ────►│   Climax   │        │                 │ │
│  │         0:30            1:15                                      │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  🎛️ Paramètres audio :                                                │
│  Fade in  : [2.0] sec    Fade out : [3.0] sec                         │
│  Volume   : [━━━━━━●━━━] 80%                                          │
│                                                                         │
│  🎧 Prévisualisation :                                                 │
│  [▶️ Écouter le clip configuré]  [▶️ Écouter la chanson entière]      │
│                                                                         │
│  [✅ Enregistrer] [❌ Annuler]                                         │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

**Filtres Bibliothèque :**

```
Interaction filtres :

Click checkbox [☑ Western] :
  → Filtre actif
  → Résultats mis à jour en temps réel
  → Nombre pistes affiché : "Résultats : 42 pistes"

Déplacement slider Tempo :
  → Range sélectionné : 100-140 BPM
  → Résultats mis à jour en temps réel
  → Combine avec autres filtres actifs

Recherche texte :
  Saisie "showdown" :
    → Recherche dans : Titre, Artiste, Album, Tags
    → Résultats filtrés en temps réel
    → Highlight terme recherché dans résultats
```

**Lecteur Preview :**

```
Click [▶️ Play] sur carte musique :
  → Musique se charge dans lecteur preview (bas droite)
  → Play automatique
  → Waveform/progress bar animée

Click [🎬 Clip] :
  → Lecteur joue seulement le clip (0:30-1:15)
  → Indicateur "🎬 Mode Clip" dans lecteur

Contrôles lecteur :
  [⏮️] → Revenir au début
  [▶️/⏸️] → Play/Pause
  [⏹️] → Stop
  [⏭️] → Piste suivante (dans résultats)
```

**Passage Mode Live :**

```
Click [🔄 Passer en Mode Live] :
  → Vérification : Toutes les séquences ont-elles des musiques ?
  → Si non :
    Toast warning : "⚠️ 3 séquences n'ont pas de musiques assignées"
    Popup :
    ┌─────────────────────────────────────────┐
    │  ⚠️ Musiques manquantes                │
    │                                         │
    │  Séquences sans musiques :              │
    │  - SÉQUENCE #1 (INTRO, OUTRO manquants)│
    │  - SÉQUENCE #5 (TRANSITION manquant)   │
    │                                         │
    │  [Continuer quand même] [Rester ici]    │
    └─────────────────────────────────────────┘
  → Si [Continuer] ou si tout OK :
    → Transition vers Interface Son Live
```

---

## 4. Interface Son - Mode Live

### 4.1 Vue d'Ensemble

**Page :** `/match/:id/live/sound`

**Objectif :** Jouer musiques assignées + réagir aux imprévus pendant spectacle.

**Layout :** Compact, focus sur ligne en cours et lecteur principal.

---

### 4.2 Layout Complet

```
┌────────────────────────────────────────────────────────────────────────┐
│  🎵 MODE LIVE 🔴                                        👤 Marc (Son)   │
│  Match vs Les Improvisés - 15/10/2025                                  │
│                                                                         │
│  [🔄 Retour Mode Préparation]                                          │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  🔴 EN COURS (synchronisé avec MC)                                     │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  │          SÉQUENCE D'IMPRO #2 - ROMANCE                           │ │
│  │          Comparée - 1v1 - Durée : 5:00                           │ │
│  │          Thème : "Première rencontre"                            │ │
│  │                                                                   │ │
│  │          ⏱️ Temps restant : 02:34 / 05:00                        │ │
│  │          (Synchronisé avec chrono MC)                            │ │
│  │                                                                   │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  🎵 MUSIQUES ASSIGNÉES À CETTE LIGNE                                   │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  🎵 INTRO                                                        │ │
│  │  ❤️ Love Theme - Romantic Strings (4:20)                         │ │
│  │  [▶️ JOUER INTRO] [✏️ Éditer] [ℹ️ Détails]                       │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  🎵 OUTRO                                                        │ │
│  │  🌅 Sunset Romance - Piano Solo (3:15)                           │ │
│  │  [▶️ JOUER OUTRO] [✏️ Éditer] [ℹ️ Détails]                       │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  🎵 TRANSITION                                                   │ │
│  │  🎻 String Interlude - Ensemble (1:30)                           │ │
│  │  [▶️ JOUER TRANSITION] [✏️ Éditer] [ℹ️ Détails]                  │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  🎧 LECTEUR AUDIO PRINCIPAL                                            │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  En lecture : 🎵 INTRO - Love Theme                                    │
│  Romantic Strings - Album: Love Collection                             │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  ▶️                                                               │ │
│  │  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 1:23 / 4:20     │ │
│  │                                                                   │ │
│  │  [⏮️ Précédent] [⏸️ Pause] [⏹️ Stop] [⏭️ Suivant]                 │ │
│  │                                                                   │ │
│  │  [⚡ Skip au Climax (2:15)] [🔊 Fade Out manuel]                 │ │
│  │                                                                   │ │
│  │  Volume : [━━━━━━━━━━●━━━━━━━━] 65%                              │ │
│  │  [🔇 Mute]                                                        │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  🔍 RECHERCHE RAPIDE BRUITAGES / IMPRÉVUS                              │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [Recherche rapide__________________________] [🔍]                     │
│                                                                         │
│  Suggestions rapides :                                                 │
│  [👏 Applause] [🐱 Cat] [📞 Phone] [🚗 Horn] [💥 Explosion]            │
│  [🚪 Door] [👣 Steps] [🌧️ Rain] [⚡ Thunder] [+ Plus...]              │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  📜 PROGRESSION DU MATCH                                               │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  6. ✅ SÉQUENCE #1 - Western                                     │ │
│  │  7. 🔴 SÉQUENCE #2 - Romance           ◄── EN COURS              │ │
│  │  8. ⏳ SÉQUENCE #3 - Comédie                                     │ │
│  │  9. ⏳ SÉQUENCE #4 - Policier                                    │ │
│  │  10. ⏳ ANNONCE INTERMÉDIAIRE                                    │ │
│  │  11. ⏳ PAUSE / ENTRACTE - 15min                                 │ │
│  │  12. ⏳ SÉQUENCE #5 - Fantastique                                │ │
│  │  ... [scroll]                                                    │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 4.3 Interactions & États

**Jouer Musique Assignée :**

```
Click [▶️ JOUER INTRO] :
  → Lecteur principal charge "Love Theme"
  → Play automatique avec settings configurés :
    - Clip 0:30-2:15 (si configuré)
    - Fade in 2 sec
    - Volume 80%
  → Bouton change : [🟢 EN LECTURE]
  → Indicateur : "En lecture : 🎵 INTRO - Love Theme"

Click [▶️ JOUER OUTRO] pendant lecture INTRO :
  → Popup :
    ┌─────────────────────────────────────────┐
    │  ⚠️ Musique en cours de lecture        │
    │                                         │
    │  Love Theme (INTRO) est en cours.       │
    │                                         │
    │  [Arrêter et jouer OUTRO]               │
    │  [Laisser INTRO finir puis OUTRO]       │
    │  [Annuler]                              │
    └─────────────────────────────────────────┘
```

**Contrôles Lecteur :**

```
Click [⚡ Skip au Climax] :
  → Lecteur saute à timestamp climax (2:15)
  → Continue lecture depuis ce point

Click [🔊 Fade Out manuel] :
  → Volume diminue progressivement (3 sec)
  → Puis stop automatique
  → Utile pour terminer musique en douceur

Click [🔇 Mute] :
  → Volume → 0%
  → Bouton change : [🔊 Unmute]
  → Lecture continue (silencieuse)
```

**Recherche Rapide Bruitages :**

```
Scénario imprévu : Besoin bruitage chat

Option 1 - Saisie rapide :
  Tape "cat" dans [Recherche rapide]
    → Résultats instantanés :
      [🐱 Meow 1] [🐱 Cat Purr] [🐱 Angry Cat]
    → Click [🐱 Meow 1]
    → Lecteur secondaire (mini) joue le bruitage
    → Bruitage court (3 sec) joue en overlay

Option 2 - Suggestions :
  Click [🐱 Cat] dans suggestions rapides
    → Joue bruitage "Meow" par défaut immédiatement
    → Pas de confirmation
```

**Synchronisation avec MC :**

```
MC lance SÉQUENCE #3 (côté MC) :
  ↓
WebSocket événement `line_started` reçu :
  ↓
Interface Son mise à jour :
  - Section "EN COURS" change :
    SÉQUENCE #2 → SÉQUENCE #3
  - Musiques assignées mises à jour :
    INTRO : [Western Showdown]
    OUTRO : [Desert Sunset]
    TRANSITION : [Tumbleweed]
  - Chrono synchronisé : 00:00 / 03:00
  - Progression : 🔴 passe à ligne 8

MC démarre chrono (côté MC) :
  ↓
WebSocket `chrono_update` reçu en temps réel :
  ↓
Chrono affiché chez Marc mis à jour :
  ⏱️ Temps restant : 02:45 / 03:00
  (Update toutes les secondes)
```

**Édition Musique en Mode Live :**

```
Click [✏️ Éditer] sur INTRO :
  → Modal édition s'ouvre (même que Mode Préparation)
  → Marc peut modifier :
    - Clip
    - Fade in/out
    - Volume
  → [Enregistrer] → Sauvegarde immédiate
  → Changements appliqués pour prochaine lecture

ℹ️ Permet d'ajuster à la volée si besoin
```

---

## 5. Composants Réutilisables

### 5.1 Carte Musique (MusicCard)

**Usage :** Bibliothèque musicale (grille)

```
┌─────────────────────────┐
│  🎸                     │  ← Icône selon genre/scenario
│  Western Showdown       │  ← Titre (max 20 car, ellipsis...)
│  The Outlaws            │  ← Artiste (max 15 car)
│                         │
│  ⚡ 8/10  ⏱️ 2:45       │  ← Énergie + Durée
│  ♪ Instrumental         │  ← Vocal/Inst
│  🎭 Western, Action     │  ← Scenarios (max 2 affichés)
│                         │
│  [▶️ Play] [🎬 Clip]    │  ← Actions
│                         │
│  ═════════════════      │  ← Drag handle (bottom)
└─────────────────────────┘
```

**États :**
- Normal
- Hover (border highlight)
- Drag (semi-transparent)
- Playing (border verte + icône ▶️ animée)

---

### 5.2 Ligne de Feuille de Match (MatchLine)

**Usage :** MC/Son Mode Préparation & Live

```
Mode Préparation (MC) :
┌────────────────────────────────────────────────────┐
│  7. ⋮⋮ SÉQUENCE D'IMPRO #1              [✏️] [🗑️] │
│     ─────────────────────────────────────────────  │
│     Type : Comparée | Joueurs : 2v2 | Durée : 3:00│
│     Catégorie : Western                            │
│     Thème : "Duel au saloon"                       │
│     🎵 Musiques : ⚠️ Non assignées                 │
└────────────────────────────────────────────────────┘

Mode Préparation (Son) :
┌────────────────────────────────────────────────────┐
│  7. SÉQUENCE #1 - Western - 3:00                   │
│     "Duel au saloon"                               │
│                                                     │
│     🎵 INTRO       ✅ [🎸 Western Showdown 2:45]   │
│                    [✏️ Éditer] [🗑️ Retirer]        │
│                                                     │
│     🎵 OUTRO       [+ Assigner]                    │
│                                                     │
│     🎵 TRANSITION  [+ Assigner]                    │
└────────────────────────────────────────────────────┘

Mode Live (MC & Son - condensé) :
┌────────────────────────────────────────────────────┐
│  7. ✅ SÉQUENCE #1 - Western                       │
│  8. 🔴 SÉQUENCE #2 - Romance   ◄── EN COURS        │
│  9. ⏳ SÉQUENCE #3 - Comédie                       │
└────────────────────────────────────────────────────┘
```

---

### 5.3 Chronomètre (Timer)

**Usage :** MC Mode Live + Son Mode Live (synchronisé)

```
┌──────────────────────┐
│                      │
│      02:34           │  ← Temps écoulé (gros chiffres)
│    ────────          │
│      05:00           │  ← Temps total
│                      │
│ Temps restant: 02:26 │  ← Indicateur restant
│                      │
└──────────────────────┘

États :
- ⏹️ Stopped (gris)
- ▶️ Running (vert, chiffres animés)
- ⏸️ Paused (orange)
- ⏰ Timeout (rouge, clignote)
```

---

### 5.4 Lecteur Audio (AudioPlayer)

**Usage :** Son Mode Préparation (preview) + Son Mode Live (principal)

```
Version Compacte (Preview) :
┌─────────────────────────────────────────────────┐
│ ▶️ Western Showdown - 0:45 / 2:45              │
│ [⏮️] [▶️/⏸️] [⏭️] Volume: [━━●━━━] 70%         │
└─────────────────────────────────────────────────┘

Version Complète (Principal) :
┌─────────────────────────────────────────────────┐
│ En lecture : 🎵 INTRO - Love Theme              │
│ Romantic Strings - Love Collection              │
│                                                 │
│ ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 1:23 / 4:20     │
│                                                 │
│ [⏮️] [⏸️] [⏹️] [⏭️]                             │
│ [⚡ Skip Climax] [🔊 Fade Out]                  │
│                                                 │
│ Volume : [━━━━━●━━━━] 65%  [🔇 Mute]           │
└─────────────────────────────────────────────────┘
```

---

## 6. Responsive Behavior

### 6.1 Breakpoints

**Desktop (1280px+) :**
- Layout complet
- Split-screen (Son Préparation)
- Tous éléments visibles

**Tablet (768-1279px) :**
- Réduction padding/margins
- Split-screen devient vertical (Son Préparation)
- Filtres bibliothèque collapsibles

**Mobile (< 768px) - V2 :**
- Single column
- Navigation tabs
- Filtres en drawer
- Grille musiques → 1 colonne

---

## 7. Animations & Transitions

### 7.1 Transitions Page

```
Mode Préparation → Mode Live :
  - Fade out interface complète (300ms)
  - Transition route
  - Slide in interface Live (400ms)
  - Total : < 1 seconde

Drag & Drop :
  - Grab : Scale 1.05 + opacity 0.8
  - Drop : Scale back 1.0 (200ms ease-out)
  - Drop zone highlight : Border pulse animation
```

### 7.2 États Visuels

**EN COURS (🔴) :**
- Ligne active : Border gauche rouge épaisse
- Background : rgba(255, 0, 0, 0.05)
- Icône 🔴 pulse animation

**Chrono Running :**
- Chiffres : Transition smooth à chaque seconde
- Si < 30 secondes : Couleur orange
- Si < 10 secondes : Couleur rouge + pulse

**Musique Playing :**
- Carte musique : Border verte
- Progress bar animée
- Icône ▶️ rotation animation

---

*Fin du document Wireframes*
*Version 2.0 - Octobre 2025*
