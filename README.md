# 🎭 Impro Manager

Application web complète pour la gestion des matchs d'improvisation théâtrale, développée spécifiquement pour optimiser la préparation et le déroulement des spectacles d'impro.

## 🚀 Fonctionnalités

### Interface MC (Maître de Cérémonie)
- ✅ Création et gestion de matchs d'improvisation
- ✅ Gestion des équipes et joueurs
- ✅ Chronomètre intégré avec contrôles
- ✅ Assignation de musiques par thème
- ✅ Synchronisation temps réel avec l'interface Son

### Interface Son (Responsable Audio)
- ✅ Bibliothèque musicale complète (777 pistes indexées)
- ✅ Lecteur audio professionnel avec cue points
- ✅ Mode Live pour performance temps réel
- ✅ Recherche rapide de bruitages et musiques
- ✅ Set de bruitages préparés par match

### Synchronisation Temps Réel
- ✅ Communication WebSocket MC ↔ Son
- ✅ Toggle Préparation/Live synchronisé
- ✅ Mise à jour automatique des états

## 🛠️ Installation

### Prérequis
- Node.js 18+
- Python 3.8+ (pour scan musical)

### Démarrage rapide
```bash
# Installation des dépendances
npm install

# Génération de la bibliothèque musicale (optionnel)
python generate_music_library.py

# Démarrage du serveur
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 📚 Utilisation

### Mode Préparation
1. **MC** : Créer un nouveau match, ajouter équipes et improvisations
2. **Son** : Associer musiques aux thèmes, préparer set de bruitages
3. **Synchronisation** : Les deux interfaces se mettent à jour automatiquement

### Mode Live
1. Basculer en Mode Live via le toggle
2. **MC** : Interface compacte de suivi du match
3. **Son** : Accès rapide aux musiques et recherche de bruitages imprévus

## 🎵 Bibliothèque Musicale

Le système scanne automatiquement votre collection musicale et catégorise :
- **Genres** : Classique, Rock, Jazz, Électro, etc.
- **Ambiances** : Mystérieux, Joyeux, Dramatique, etc.
- **Énergie** : Échelle de 1 à 10
- **Scenarios d'impro** : Action, Romance, Comédie, etc.

## 📱 Interfaces

### Navigation
- **Accueil** : Vue d'ensemble et accès rapide
- **Mode MC** : Gestion complète des matchs
- **Mode Son** : Contrôle audio et musical

### Design
- Interface glassmorphisme moderne
- Responsive design
- Animations fluides
- Indicateurs visuels Mode Live

## 🔧 Architecture Technique

- **Frontend** : Vue.js 3 avec Composition API
- **Backend** : Express.js + Socket.IO
- **Stockage** : Fichiers JSON pour flexibilité
- **Audio** : HTML5 Audio API
- **Temps réel** : WebSocket pour synchronisation

## 📈 Changelog

### v0.3.0 - 2025-10-03
- ✨ Recherche complète des micro-étapes feuille de match d'impro
- 📋 Identification des besoins Phase "Préparation" MC
- 🏗️ Restructuration projet avec documentation obligatoire
- 📊 Gap analysis : 40% des besoins standards couverts

### v0.2.1 - 2025-10-03
- 🚀 Restauration complète Mode Live après régression critique
- 🐛 Fix erreur duplicate updateVolume()
- ✅ Validation fonctionnement complet MC + Son + Live
- 🔒 Point de sauvegarde sans régression

### v0.2.0 - 2025-10-03
- ✨ Implémentation Mode Live avec toggle Préparation/Live
- 🎵 Set de bruitages préparés automatiquement
- 🔍 Recherche rapide de bruitages pendant spectacle
- 🎨 Animations et styles spécifiques Mode Live
- ⚡ Interface compacte optimisée performance temps réel

### v0.1.0 - 2025-10-03
- 🎭 Interfaces MC et Son complètes selon wireframes
- 🎵 Intégration bibliothèque musicale (777 pistes)
- 🔄 Synchronisation WebSocket temps réel
- ⏱️ Système de chronomètre et timer
- 🎧 Lecteur audio avec contrôles complets
- 🖱️ Drag-and-drop pour assignation musiques

## 🤝 Contribution

Application développée spécifiquement pour les besoins d'une troupe d'improvisation théâtrale.

### Standards de développement
- Documentation obligatoire : `action_plan.md`, `readme.md`, `best_practices_current_project.md`
- Tests unitaires dans `/tests` (1 seul test actif)
- Logs détaillés dans `/logs` pour debugging LLM
- Commits détaillés avec contexte complet

## 📞 Support

Pour toute question ou suggestion d'amélioration, consulter le `action_plan.md` pour les prochaines étapes de développement.

---

*Développé avec ❤️ pour la communauté d'improvisation théâtrale*