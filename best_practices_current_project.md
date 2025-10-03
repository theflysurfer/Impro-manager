# 🛠️ Best Practices - Impro Manager

## Conventions de Développement

### Structure Obligatoire à la Racine
```
/
├── readme.md                        # User-oriented documentation
├── action_plan.md                   # LLM-oriented project status
├── best_practices_current_project.md # Ce fichier
├── /tests                           # 1 seul test actif par étape
├── /logs                            # Logs explicites pour debug LLM
└── ...
```

**RÈGLE ABSOLUE :** Pas d'autres .md à la racine. Les comptes-rendus se font dans les commits avec détails.

### Méthodologie de Code

#### Commits Élégants
- **Messages détaillés** avec contexte complet
- **Émojis conventionnels** : ✨ (feat), 🐛 (fix), 🔧 (config), 📝 (docs)
- **Format** : `🎭 [TYPE] Description courte + contexte détaillé`
- **Exemples** :
  - `🚀 Restauration complète du Mode Live après régression critique`
  - `🏗️ Restructuration projet avec documentation obligatoire`

#### Tests
- **1 seul fichier test** dans `/tests`
- **1 seul test actif** à chaque étape du développement
- Focalisé sur la fonctionnalité en cours de développement

#### Logs
- **Tous les logs** dans `/logs`
- **Le plus explicite possible** pour debugging LLM autonome
- Inclure le contexte, les paramètres, les états avant/après

## Architecture Technique

### Vue.js 3 + Composition API
```javascript
// Structure standard des composants
const ComponentName = {
  template: `<div class="component-name">...</div>`,
  setup(props) {
    // Reactive variables
    const state = ref('initial')

    // Functions
    const handleAction = () => {
      // Logic here
    }

    // Return pour template
    return {
      state,
      handleAction
    }
  }
}
```

### WebSocket Synchronisation
```javascript
// Pattern standard pour Socket.IO
socket.emit('event-name', data)
socket.on('event-name', (data) => {
  // Handle response
})
```

### Gestion d'État
```javascript
// Variables réactives pour synchronisation MC ↔ Son
const liveMode = ref(false)
const currentMatch = ref(null)
const soundSet = ref([])
```

## Découvertes de Debugging

### Régressions Critiques Identifiées

#### 1. App-fixed.js Regression (2025-10-03)
**Problème :** Création de `app-fixed.js` from scratch → perte Mode Live complet
**Cause :** Non-préservation des fonctionnalités existantes
**Solution :** Toujours copier l'original puis modifier incrémentalement
**Leçon :** **JAMAIS recréer from scratch sans préserver features**

#### 2. Duplicate Function Error
**Problème :** `Uncaught SyntaxError: Identifier 'updateVolume' has already been declared`
**Cause :** Duplication de fonction lors de la restauration
**Solution :** Vérification systématique des fonctions existantes avant ajout
**Pattern de fix :**
```javascript
// Vérifier l'existence avant déclaration
if (typeof updateVolume !== 'function') {
  function updateVolume(value) { ... }
}
```

#### 3. Template Binding Issues
**Problème :** `{{ currentMode }}` non résolu dans template
**Cause :** Variable non retournée dans setup()
**Solution :** Toujours vérifier return statement
```javascript
return {
  // OBLIGATOIRE : toutes les variables utilisées dans template
  currentMode,
  liveMode,
  // ...
}
```

### OneDrive File Permissions
**Problème :** Accès aux fichiers OneDrive depuis Node.js
**Solution :** Chemins absolus avec échappement Windows
```javascript
const musicPath = "C:\\Users\\JulienFernandez\\OneDrive\\Zic impro"
```

### NPM Create Vue Timeout
**Problème :** `npm create vue` timeout sur Windows
**Solution :** Structure manuelle Vue.js sans build tools complexes

## Standards de Fichiers

### JSON Data Files
```json
{
  "id": "unique-identifier",
  "timestamp": "2025-10-03T10:30:00Z",
  "data": { ... }
}
```

### Audio Files Integration
- **Ne jamais déplacer** les fichiers de leur emplacement original
- Indexer avec chemins absolus
- Métadonnées séparées dans JSON

### CSS Conventions
```css
/* Structure modulaire */
.component-name { }
.component-name__element { }
.component-name--modifier { }

/* Variables CSS pour thèmes */
:root {
  --primary-color: #667eea;
  --live-color: #ef4444;
}
```

## Gestion des Modes

### Toggle Préparation/Live
```javascript
// Pattern pour mode switching
const liveMode = ref(false)

// Synchronisation WebSocket
watch(liveMode, (newValue) => {
  socket.emit('mode-change', { live: newValue })
})
```

### Interface Conditionnelle
```html
<!-- Pattern pour interfaces conditionnelles -->
<div v-if="!liveMode" class="preparation-mode">
  <!-- Interface complète préparation -->
</div>
<div v-if="liveMode" class="live-mode">
  <!-- Interface compacte live -->
</div>
```

## Points de Vigilance LLM

### Actions Interdites
1. **NE JAMAIS** recréer `app.js` ou `app-fixed.js` from scratch
2. **NE JAMAIS** oublier le Mode Live dans les modifications
3. **NE JAMAIS** commiter sans tester le fonctionnement complet
4. **NE JAMAIS** ignorer les erreurs JavaScript dans la console

### Actions Obligatoires
1. **TOUJOURS** préserver les fonctionnalités existantes
2. **TOUJOURS** tester Mode Live après modifications
3. **TOUJOURS** vérifier la synchronisation MC ↔ Son
4. **TOUJOURS** utiliser Edit tool au lieu de Write sur fichiers existants

### Workflow de Debug
1. **Lire le fichier complet** avant modification
2. **Identifier les patterns existants** (variables, fonctions, structure)
3. **Modifier incrémentalement** avec Edit tool
4. **Tester immédiatement** après chaque modification
5. **Logger explicitement** dans `/logs` en cas d'erreur

## Music Library Integration

### Python Script Pattern
```python
# generate_music_library.py structure
def scan_directory(path):
    # Recursive scan with metadata extraction

def determine_genre_and_mood(filename, folder_path):
    # Intelligent categorization based on patterns

def save_library(music_data):
    # JSON output with complete metadata
```

### Metadata Standards
```json
{
  "title": "Extracted or inferred title",
  "artist": "Artist name or 'Unknown'",
  "genre": "Auto-detected genre",
  "mood": "Inferred mood",
  "energy": 1-10,
  "scenarios": ["action", "romance", "comedy"]
}
```

## Performance Guidelines

### WebSocket Optimization
- Éviter les émissions trop fréquentes
- Batching des updates si nécessaire
- Déconnexion propre lors du changement de page

### Audio Performance
- Preload des musiques critiques
- Gestion mémoire pour bibliothèque 777+ pistes
- Fallback gracieux si fichier indisponible

## Références Importantes

### Standards Ligues Françaises
- Critères **S.P.O.R.T.** : Structure, Personnages, Originalité, Rythme, Technique
- Formats **8 ou 12** improvisations selon ligues
- Système de **pénalités automatiques** (3 pénalités = 1 point adverse)

### Micro-étapes Feuille de Match
- **13 étapes** identifiées pour création complète
- **3 phases prioritaires** pour MC Préparation
- **Gap analysis** : 40% des besoins couverts actuellement

---

*Document mis à jour le 2025-10-03 après restructuration complète*