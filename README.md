# 🎭 Impro Manager

Application web complète pour la gestion de matchs d'improvisation théâtrale avec bibliothèque musicale intégrée.

## 🎯 Fonctionnalités

### Mode MC (Maître de Cérémonie)
- ✅ Création et gestion de feuilles de match
- ✅ Templates de match prédéfinis
- ✅ Timer intégré avec alertes visuelles
- ✅ Gestion des équipes et scores
- ✅ Assignment de musiques aux improvisations
- ✅ Synchronisation temps réel avec l'interface Son

### Mode Son (Responsable Sonorisation)
- ✅ Bibliothèque musicale avec métadonnées enrichies
- ✅ Lecteur audio HTML5 avec points de lecture (Hook, Climax, Outro)
- ✅ Modes de lecture : Complet, Hook Start, Version courte, Boucle
- ✅ Filtres et recherche avancée (ambiance, énergie, genre)
- ✅ Glisser-déposer pour assignment aux improvisations
- ✅ Raccourcis clavier et boutons de lancement rapide
- ✅ Synchronisation avec l'interface MC

### Synchronisation Temps Réel
- ✅ WebSocket pour communication MC ↔ Son
- ✅ Partage d'état des matchs et musiques
- ✅ Notifications d'assignment musical

## 🚀 Installation

### Prérequis
- Node.js (version 16+)
- npm

### Étapes d'installation

1. **Cloner et installer les dépendances serveur :**
```bash
npm install
```

2. **Installer les dépendances client :**
```bash
cd client
npm install
cd ..
```

3. **Démarrer l'application :**
```bash
npm run dev
```

Cela lancera :
- Serveur Express sur http://localhost:3000
- Interface Vue.js sur http://localhost:5173

## 🎵 Structure des Données Musicales

Chaque fichier audio contient des métadonnées complètes :

```json
{
  "id": "music-001",
  "filename": "jazz-cool-cafe.mp3",
  "title": "Jazz Cool Café",
  "artist": "Django's Cats",
  "duration": 245,
  "cues": {
    "start": 0,
    "hook": 32,
    "climax": 98,
    "outro": 210,
    "fade_duration": 8
  },
  "tags": {
    "mood": ["énergique", "joyeux", "décontracté"],
    "genre": ["jazz", "swing"],
    "energy": 7,
    "tempo": "medium"
  },
  "impro_context": {
    "scenarios": ["café", "années-20", "détective"],
    "emotions": ["nostalgie", "légèreté", "sophistication"]
  }
}
```

## 📁 Structure du Projet

```
impro-manager/
├── server/
│   ├── app.js              # Serveur Express + Socket.IO
│   └── ...
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.vue           # Page d'accueil
│   │   │   ├── MCInterface.vue    # Interface MC
│   │   │   └── SoundInterface.vue # Interface Son
│   │   ├── App.vue
│   │   └── main.js
│   └── ...
├── data/
│   ├── matches.json        # Données des matchs
│   ├── music.json          # Bibliothèque musicale
│   └── templates.json      # Templates de match
├── uploads/               # Fichiers audio uploadés
└── package.json
```

## 🎮 Utilisation

### Workflow Typique

1. **Préparation (Mode MC) :**
   - Créer un nouveau match avec template
   - Définir les équipes
   - Ajouter/modifier les improvisations

2. **Configuration Son :**
   - Sélectionner le match actuel
   - Assigner les musiques par glisser-déposer
   - Tester les points de lecture

3. **Pendant le Match :**
   - **MC :** Gère la progression, timer, scores
   - **Son :** Lance les musiques au bon moment
   - Synchronisation automatique entre les deux

### Raccourcis Clavier (Mode Son)
- `Espace` : Play/Pause
- `Échap` : Stop
- `1-6` : Lancement rapide (Applause, Gong, etc.)

## 🔧 Configuration

### Ajouter des Musiques
1. Placer les fichiers audio dans `/uploads/`
2. Ajouter les métadonnées dans `/data/music.json`
3. Redémarrer l'application

### Créer des Templates
Modifier `/data/templates.json` pour ajouter de nouveaux templates de match.

## 🤝 Workflow de Troupe

### Rôles
- **MC :** Maître de cérémonie, gère le match
- **Son :** Responsable sonorisation, gère la musique
- **Équipes :** Peuvent consulter en lecture seule

### Synchronisation
Les deux interfaces se synchronisent automatiquement :
- Assignment de musiques → visible côté MC
- Progression du match → visible côté Son
- État temps réel via WebSocket

## 📱 Accès Multi-Appareils

- **MC :** `http://localhost:3000/mc`
- **Son :** `http://localhost:3000/sound`
- **Accueil :** `http://localhost:3000/`

Compatible tablettes et mobiles pour utilisation en direct.

## 🛠️ Développement

### Technologies
- **Backend :** Node.js, Express, Socket.IO
- **Frontend :** Vue.js 3, Vue Router
- **Styling :** CSS3 avec design moderne
- **Audio :** HTML5 Audio API

### Améliorations Futures
- [ ] Upload de fichiers audio via interface
- [ ] Détection automatique des points de lecture
- [ ] Statistiques de match
- [ ] Mode hors-ligne
- [ ] Export PDF des feuilles
- [ ] Gestion utilisateurs multi-troupes

## 📄 License

MIT - Libre d'utilisation pour votre troupe d'impro !

---

🎭 **Créé avec passion pour la communauté théâtrale d'improvisation** 🎭