# 🎭 Action Plan - Impro Manager

## Statut Actuel du Projet

**Version:** Prototype fonctionnel avec Mode Live
**Dernière mise à jour:** 2025-10-03
**État:** Phase d'analyse et restructuration

### Fonctionnalités Opérationnelles ✅
- Interface MC complète avec création de match
- Interface Son avec bibliothèque musicale (777 pistes)
- Mode Live avec toggle Préparation/Live
- Synchronisation temps réel MC ↔ Son (WebSocket)
- Système de chronomètre et timer
- Lecteur audio avec contrôles complets
- Assignation musique par drag-and-drop

### Architecture Technique Stable
- **Frontend:** Vue.js 3 + Composition API
- **Backend:** Express.js + Socket.IO
- **Données:** JSON files (matches, music_library, templates)
- **Audio:** HTML5 Audio API
- **Scan musical:** Python script (777 fichiers indexés)

## Phase Actuelle : Analyse des Besoins & Restructuration

### 🔍 Recherche Terminée (2025-10-03)
- **Micro-étapes feuille de match d'impro** : 13 étapes identifiées
- **Standards ligues françaises** : Critères S.P.O.R.T., formats 8/12 impros
- **Gap analysis** : ~40% des besoins couverts par l'app actuelle

### 📋 Besoins Identifiés - MC Phase "Préparation"
1. **Informations générales du match**
   - En-tête : Date, heure, lieu
   - Équipes : Noms, couleurs, capitaines, joueurs (2-5 par équipe)

2. **Personnel technique**
   - Staff complet : Arbitre, ramasseur de chaussette, MC, responsable son, lumière, accueil, régisseur général
   - **BESOIN CRITIQUE :** Annuaire pour sélection des noms (propre à la troupe)

3. **Structure des improvisations**
   - Grille illimitée avec ajout/suppression dynamique
   - Champs : Numéro, Thème/sujet par improvisation

## Next Steps Actionnables

### 🏗️ PHASE 1 : Restructuration Projet (EN COURS)
- [x] Créer structure documentaire obligatoire
- [ ] action_plan.md (ce fichier)
- [ ] readme.md (user-oriented)
- [ ] best_practices_current_project.md
- [ ] /tests avec 1 seul test actif
- [ ] /logs pour debugging autonome LLM
- [ ] Commit restructuration détaillé

### 🔄 PHASE 2 : Dialogue Utilisateur (NEXT)
**Objectif :** Définir les autres scénarios d'usage avant codage
- [ ] Phase "Préparation" du responsable son
- [ ] Échanges MC ↔ Responsable Son
- [ ] Validation workflow complet

### 🛠️ PHASE 3 : Développement Features (FUTUR)
**Priorité 1 :** Annuaire troupe intégré
**Priorité 2 :** Structure impros dynamique
**Priorité 3 :** Personnel technique complet

### 📝 PHASE 4 : Tests & Validation (FUTUR)
- Test unique dans /tests
- Logs explicites pour debug LLM
- Validation avec vraie troupe d'impro

## Contexte Technique Important

### Historique des Régressions
- **app-fixed.js regression** : Mode Live perdu (restauré)
- **Duplicate updateVolume()** : Erreur JS corrigée
- **Template binding issues** : {{ currentMode }} résolu

### Contraintes Spécifiques
- **Fichiers audio :** Ne pas déplacer de `C:\Users\JulienFernandez\OneDrive\Zic impro`
- **Troupe spécifique :** Annuaire personnel requis
- **Formats standards :** Compatibilité ligues françaises

## Points de Vigilance LLM

1. **NE JAMAIS** recréer de fichiers from scratch sans préserver les fonctionnalités
2. **TOUJOURS** tester le Mode Live après modifications
3. **RESPECTER** la structure documentaire obligatoire
4. **PRIVILÉGIER** l'édition de fichiers existants vs création
5. **COMMITER** avec messages détaillés sur le contexte

## Références
- Recherche complète micro-étapes : 2025-10-03
- Standards S.P.O.R.T. : Structure, Personnages, Originalité, Rythme, Technique
- Formats officiels : 8 ou 12 improvisations selon ligues