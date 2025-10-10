# 🎨 Frontend Rules - Impro Manager v2.0

**Règles strictes de développement frontend**
*Version 2.0 - Octobre 2025*

---

## Table des Matières

1. [Philosophie Générale](#1-philosophie-générale)
2. [Méthodologie CSS](#2-méthodologie-css)
3. [Design System](#3-design-system)
4. [Layout & Grid System](#4-layout--grid-system)
5. [Architecture Vue.js](#5-architecture-vuejs)
6. [Naming Conventions](#6-naming-conventions)
7. [Responsive Design](#7-responsive-design)
8. [Performance](#8-performance)
9. [Accessibilité](#9-accessibilité)
10. [Règles Spécifiques Impro Manager](#10-règles-spécifiques-impro-manager)

---

## 1. Philosophie Générale

### 1.1 Principe Central

**"Utility-First + Component-Scoped + Design Tokens"**

- **80%** : Classes utilitaires (espacements, flexbox, couleurs)
- **15%** : CSS scopé Vue pour composants complexes
- **5%** : CSS global (reset, variables, keyframes)

### 1.2 Objectifs

✅ **Cohérence** : Même approche partout
✅ **Maintenabilité** : Code prévisible et modulaire
✅ **Performance** : CSS minimal, pas de duplication
✅ **Scalabilité** : Ajout features sans casser l'existant

### 1.3 Anti-Patterns (À ÉVITER)

❌ **Styles inline** : `<div style="color: red">` → Jamais !
❌ **!important** : Sauf cas extrêmes (override lib externe)
❌ **Magic numbers** : `margin: 17px` → Utiliser design tokens
❌ **Deep nesting** : Max 3 niveaux de sélecteurs CSS
❌ **Classes non descriptives** : `.wrapper`, `.container2`, `.temp`

---

## 2. Méthodologie CSS

### 2.1 Approche Hybrid

**Utility-First pour 80% des cas :**

```vue
<!-- ✅ BON : Classes utilitaires -->
<div class="flex items-center gap-4 p-4 bg-glass rounded-lg">
  <button class="btn btn-primary">Sauvegarder</button>
</div>

<!-- ❌ MAUVAIS : Styles inline -->
<div style="display: flex; align-items: center; gap: 16px;">
  <button style="background: blue;">Sauvegarder</button>
</div>
```

**BEM pour composants complexes avec états :**

```vue
<!-- ✅ BON : BEM pour composants stateful -->
<div class="music-card music-card--playing">
  <div class="music-card__header">
    <h3 class="music-card__title">Western Showdown</h3>
  </div>
  <div class="music-card__actions">
    <button class="music-card__btn music-card__btn--primary">Play</button>
  </div>
</div>
```

### 2.2 Structure BEM

**Block__Element--Modifier**

```css
/* Block */
.music-card { }

/* Element */
.music-card__header { }
.music-card__title { }
.music-card__actions { }

/* Modifier */
.music-card--playing { }
.music-card--disabled { }
.music-card__btn--primary { }
```

### 2.3 Classes Utilitaires (Framework Maison)

**Créer `/src/assets/styles/utilities.css` :**

```css
/* Spacing (système 4px) */
.mt-1 { margin-top: 4px; }
.mt-2 { margin-top: 8px; }
.mt-3 { margin-top: 12px; }
.mt-4 { margin-top: 16px; }
.mt-6 { margin-top: 24px; }
.mt-8 { margin-top: 32px; }

.p-2 { padding: 8px; }
.p-4 { padding: 16px; }
.p-6 { padding: 24px; }

/* Flexbox */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: 8px; }
.gap-4 { gap: 16px; }

/* Grid */
.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

/* Text */
.text-center { text-align: center; }
.text-sm { font-size: 14px; }
.text-base { font-size: 16px; }
.text-lg { font-size: 18px; }
.text-xl { font-size: 24px; }

/* Colors (design tokens) */
.text-primary { color: var(--color-primary); }
.text-secondary { color: var(--color-secondary); }
.bg-glass { background: var(--bg-glass); }
.bg-dark { background: var(--bg-dark); }

/* Border Radius */
.rounded { border-radius: 8px; }
.rounded-lg { border-radius: 12px; }
.rounded-full { border-radius: 9999px; }
```

**Note** : Pas de Tailwind complet (trop lourd), juste les classes essentielles.

---

## 3. Design System

### 3.1 Design Tokens (Variables CSS)

**Fichier `/src/assets/styles/tokens.css` :**

```css
:root {
  /* === COLORS === */

  /* Primary (Bleu troupe) */
  --color-primary: #4A90E2;
  --color-primary-dark: #357ABD;
  --color-primary-light: #6FA8E8;

  /* Secondary (Violet) */
  --color-secondary: #9B59B6;
  --color-secondary-dark: #8E44AD;

  /* Accent (Orange/Rouge) */
  --color-accent: #E67E22;
  --color-danger: #E74C3C;
  --color-success: #27AE60;
  --color-warning: #F39C12;

  /* Neutrals */
  --color-text: #2C3E50;
  --color-text-light: #7F8C8D;
  --color-text-inverse: #FFFFFF;

  --color-bg: #FFFFFF;
  --color-bg-dark: #1A1A2E;
  --color-bg-light: #F8F9FA;

  /* Glassmorphisme */
  --bg-glass: rgba(255, 255, 255, 0.1);
  --bg-glass-dark: rgba(0, 0, 0, 0.3);
  --border-glass: rgba(255, 255, 255, 0.2);
  --backdrop-blur: 10px;

  /* === SPACING (4px base) === */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* === TYPOGRAPHY === */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-mono: 'Fira Code', 'Courier New', monospace;

  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  --font-size-3xl: 40px;

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* === BORDER RADIUS === */
  --radius-sm: 4px;
  --radius: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* === SHADOWS === */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15);
  --shadow-glass: 0 8px 32px 0 rgba(31, 38, 135, 0.37);

  /* === Z-INDEX === */
  --z-base: 1;
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-modal: 30;
  --z-toast: 40;
  --z-tooltip: 50;

  /* === TRANSITIONS === */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;

  /* === BREAKPOINTS (pour JS) === */
  --breakpoint-mobile: 768px;
  --breakpoint-tablet: 1024px;
  --breakpoint-desktop: 1280px;
}

/* Dark mode (optionnel V2) */
[data-theme="dark"] {
  --color-text: #ECF0F1;
  --color-bg: #1A1A2E;
  --bg-glass: rgba(0, 0, 0, 0.5);
}
```

### 3.2 Utilisation des Tokens

```vue
<style scoped>
/* ✅ BON : Utiliser les tokens */
.card {
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  background: var(--bg-glass);
  backdrop-filter: blur(var(--backdrop-blur));
  box-shadow: var(--shadow-glass);
  transition: all var(--transition-base);
}

/* ❌ MAUVAIS : Valeurs en dur */
.card {
  padding: 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
}
</style>
```

---

## 4. Layout & Grid System

### 4.1 Approche Mobile-First

**Toujours partir du mobile, puis adapter desktop :**

```css
/* ✅ BON : Mobile-first */
.container {
  padding: var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding: var(--space-6);
  }
}

@media (min-width: 1280px) {
  .container {
    padding: var(--space-8);
    max-width: 1440px;
    margin: 0 auto;
  }
}

/* ❌ MAUVAIS : Desktop-first */
.container {
  padding: 32px;
}

@media (max-width: 768px) {
  .container {
    padding: 16px;
  }
}
```

### 4.2 Grid vs Flexbox

**Règle simple :**
- **CSS Grid** : Layouts 2D (colonnes + lignes)
- **Flexbox** : Layouts 1D (ligne OU colonne)

**Exemples :**

```vue
<!-- Grid : Grille de cartes musiques -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <MusicCard v-for="music in musics" :key="music.id" />
</div>

<!-- Flexbox : Header navigation -->
<header class="flex items-center justify-between p-4">
  <div class="flex items-center gap-4">
    <Logo />
    <Nav />
  </div>
  <UserMenu />
</header>

<!-- Flexbox : Formulaire vertical -->
<form class="flex flex-col gap-4">
  <input type="text" />
  <button>Submit</button>
</form>
```

### 4.3 Breakpoints Standards

```css
/* Mobile-first breakpoints */
@media (min-width: 640px) { /* sm: Smartphones landscape */ }
@media (min-width: 768px) { /* md: Tablets */ }
@media (min-width: 1024px) { /* lg: Laptops */ }
@media (min-width: 1280px) { /* xl: Desktops */ }
@media (min-width: 1536px) { /* 2xl: Large screens */ }
```

**Utiliser les classes responsive :**

```vue
<!-- Responsive grid -->
<div class="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- 1 col mobile, 2 col tablet, 3 col desktop -->
</div>

<!-- Responsive hide/show -->
<div class="hidden md:block">
  <!-- Caché mobile, visible desktop -->
</div>
```

---

## 5. Architecture Vue.js

### 5.1 Structure Dossiers

```
/frontend
  /src
    /assets
      /styles
        tokens.css          # Design tokens
        utilities.css       # Classes utilitaires
        base.css            # Reset + global
        animations.css      # Keyframes
      /images
      /icons
    /components
      /ui                   # Composants génériques réutilisables
        Button.vue
        Input.vue
        Card.vue
        Modal.vue
        Toast.vue
      /match                # Composants spécifiques match
        MatchLine.vue
        LineEditor.vue
        MatchHeader.vue
      /music                # Composants bibliothèque
        MusicCard.vue
        MusicFilters.vue
        AudioPlayer.vue
      /live                 # Composants mode live
        LiveTimer.vue
        ScoreBoard.vue
        ProgressionList.vue
    /views                  # Pages complètes
      HomeView.vue
      MatchListView.vue
      MatchEditView.vue
      SoundPrepView.vue
      LiveMCView.vue
      LiveSoundView.vue
      LoginView.vue
    /composables            # Logique réutilisable
      useAuth.js
      useWebSocket.js
      useAudioPlayer.js
      useOnlineStatus.js
    /utils                  # Fonctions utilitaires
      formatters.js
      validators.js
      api.js
    /router
      index.js
    /store                  # Pinia (si utilisé)
      auth.js
      match.js
    App.vue
    main.js
```

### 5.2 Règles Composants Vue

**Taille fichier :**
- ✅ **< 250 lignes** par composant
- ✅ **< 80 lignes** par `<style>` scoped
- ❌ Si plus grand → Découper en sous-composants

**Structure composant standard :**

```vue
<template>
  <!-- 1. Commentaire si complexe -->
  <!-- 2. HTML simple et lisible -->
  <!-- 3. Max 3 niveaux imbrication -->
  <div class="music-card">
    <div class="music-card__header">
      <h3>{{ title }}</h3>
    </div>
    <div class="music-card__actions">
      <button @click="handlePlay">Play</button>
    </div>
  </div>
</template>

<script setup>
// 1. Imports
import { ref, computed } from 'vue'

// 2. Props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 0
  }
})

// 3. Emits
const emit = defineEmits(['play', 'stop'])

// 4. Refs & Reactive
const isPlaying = ref(false)

// 5. Computed
const formattedDuration = computed(() => {
  const min = Math.floor(props.duration / 60)
  const sec = props.duration % 60
  return `${min}:${sec.toString().padStart(2, '0')}`
})

// 6. Methods
const handlePlay = () => {
  isPlaying.value = true
  emit('play', props.title)
}

// 7. Lifecycle hooks (si nécessaire)
// onMounted(() => { ... })
</script>

<style scoped>
/* 1. Variables locales (si besoin) */
.music-card {
  --card-padding: var(--space-4);
}

/* 2. Styles BEM */
.music-card {
  padding: var(--card-padding);
  background: var(--bg-glass);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.music-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.music-card__header {
  margin-bottom: var(--space-3);
}

/* 3. States */
.music-card--playing {
  border: 2px solid var(--color-primary);
}

/* 4. Responsive (si nécessaire) */
@media (min-width: 768px) {
  .music-card {
    --card-padding: var(--space-6);
  }
}
</style>
```

### 5.3 Props & Emits

**Props : Toujours typer et documenter**

```vue
<script setup>
const props = defineProps({
  // ✅ BON : Type + default + validator
  status: {
    type: String,
    default: 'pending',
    validator: (value) => ['pending', 'in_progress', 'completed'].includes(value)
  },

  // ✅ BON : Required
  matchId: {
    type: String,
    required: true
  },

  // ❌ MAUVAIS : Pas de type
  data: Object
})

// ✅ BON : Emits documentés
const emit = defineEmits(['update', 'delete', 'complete'])
</script>
```

---

## 6. Naming Conventions

### 6.1 Composants Vue

**PascalCase + 2 mots minimum :**

```
✅ BON :
  MusicCard.vue
  AudioPlayer.vue
  LiveTimer.vue
  ScoreBoard.vue
  UserMenu.vue

❌ MAUVAIS :
  card.vue          (minuscule)
  Music.vue         (1 seul mot)
  music-card.vue    (kebab-case)
  MCard.vue         (abréviation)
```

### 6.2 Classes CSS

**kebab-case + BEM si composant :**

```css
/* ✅ BON */
.music-card { }
.music-card__header { }
.music-card__title { }
.music-card--playing { }

.btn { }
.btn-primary { }
.btn-lg { }

/* ❌ MAUVAIS */
.musicCard { }     /* camelCase */
.MusicCard { }     /* PascalCase */
.music_card { }    /* snake_case */
```

### 6.3 Variables JavaScript

**camelCase :**

```js
// ✅ BON
const isPlaying = ref(false)
const currentMusic = ref(null)
const handlePlayClick = () => {}

// ❌ MAUVAIS
const is_playing = ref(false)     // snake_case
const IsPlaying = ref(false)      // PascalCase
const current_music_id = ref(1)   // snake_case
```

### 6.4 Fichiers

```
✅ BON :
  MusicCard.vue         (Composants : PascalCase)
  useAuth.js            (Composables : camelCase + "use" prefix)
  formatters.js         (Utils : camelCase)
  tokens.css            (Styles : kebab-case)

❌ MAUVAIS :
  music-card.vue
  Auth.js
  Formatters.js
  Tokens.css
```

---

## 7. Responsive Design

### 7.1 Stratégie Mobile-First

**Ordre de développement :**

1. **Mobile (320px-767px)** : Design de base
2. **Tablet (768px-1023px)** : Ajustements layout
3. **Desktop (1024px+)** : Optimisations large screen

### 7.2 Touch Targets (Mobile)

**Taille minimale boutons : 48x48px**

```css
/* ✅ BON : Touch-friendly */
.btn {
  min-height: 48px;
  min-width: 48px;
  padding: var(--space-3) var(--space-6);
}

/* Interface smartphone MC */
.live-btn {
  min-height: 64px; /* Encore plus grand pour le live */
  font-size: var(--font-size-lg);
}

/* ❌ MAUVAIS : Trop petit */
.btn {
  padding: 4px 8px; /* Impossible à cliquer sur mobile */
}
```

### 7.3 Breakpoints Spécifiques

**MC Smartphone (prioritaire) :**

```css
/* Portrait smartphone (défaut) */
.live-timer {
  font-size: var(--font-size-3xl);
}

/* Landscape smartphone */
@media (max-width: 767px) and (orientation: landscape) {
  .live-timer {
    font-size: var(--font-size-xl); /* Plus compact */
  }
}

/* Tablet/Desktop */
@media (min-width: 768px) {
  .live-timer {
    font-size: var(--font-size-2xl);
  }
}
```

---

## 8. Performance

### 8.1 CSS Performance

**Règles :**

1. **Éviter sélecteurs coûteux :**

```css
/* ❌ LENT : Sélecteurs universels */
* { box-sizing: border-box; }
div * { color: red; }

/* ✅ RAPIDE : Sélecteurs précis */
.music-card { }
.music-card__title { }
```

2. **Limiter `box-shadow` et `backdrop-filter` :**

```css
/* ✅ BON : Utiliser sur peu d'éléments */
.card {
  backdrop-filter: blur(10px); /* OK si < 10 éléments */
}

/* ❌ MAUVAIS : Sur tous les éléments */
div {
  backdrop-filter: blur(10px); /* Trop coûteux */
}
```

3. **Animations GPU-accelerated :**

```css
/* ✅ BON : transform, opacity */
.card:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

/* ❌ ÉVITER : top, left, width, height */
.card:hover {
  top: -2px; /* Cause reflow */
}
```

### 8.2 Lazy Loading Composants

```js
// ✅ BON : Lazy load routes
const routes = [
  {
    path: '/matches',
    component: () => import('@/views/MatchListView.vue')
  }
]

// ✅ BON : Lazy load gros composants
const AudioPlayer = defineAsyncComponent(() =>
  import('@/components/music/AudioPlayer.vue')
)
```

---

## 9. Accessibilité

### 9.1 Règles de Base

**1. Contraste couleurs (WCAG AA) :**

```css
/* ✅ BON : Ratio >= 4.5:1 pour texte normal */
.text {
  color: #2C3E50; /* Sur fond blanc : ratio 12.6:1 ✓ */
}

/* ❌ MAUVAIS : Ratio < 4.5:1 */
.text-light {
  color: #D3D3D3; /* Sur fond blanc : ratio 1.9:1 ✗ */
}
```

**2. Focus visible :**

```css
/* ✅ BON : Focus outline personnalisé */
button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* ❌ MAUVAIS : Supprimer focus */
button:focus {
  outline: none; /* Dangereux pour navigation clavier */
}
```

**3. Labels ARIA :**

```vue
<!-- ✅ BON : Labels explicites -->
<button aria-label="Jouer Western Showdown">
  <PlayIcon />
</button>

<input
  type="text"
  aria-label="Rechercher une musique"
  placeholder="Rechercher..."
/>

<!-- ❌ MAUVAIS : Pas de label -->
<button>
  <PlayIcon /> <!-- Aucune indication pour screen readers -->
</button>
```

---

## 10. Règles Spécifiques Impro Manager

### 10.1 Glassmorphisme

**Style signature du projet :**

```css
/* Template glassmorphisme réutilisable */
.glass {
  background: var(--bg-glass);
  backdrop-filter: blur(var(--backdrop-blur));
  border: 1px solid var(--border-glass);
  box-shadow: var(--shadow-glass);
}

/* Variations */
.glass-dark {
  background: var(--bg-glass-dark);
}

.glass-solid {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
}
```

**Utilisation :**

```vue
<template>
  <div class="card glass rounded-lg p-6">
    <h2>Titre</h2>
  </div>
</template>
```

### 10.2 États Live (Rouge 🔴)

**Indicateurs visuels Mode Live :**

```css
/* États EN COURS */
.live-indicator {
  color: var(--color-danger);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Badge LIVE */
.badge-live {
  background: var(--color-danger);
  color: white;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  animation: pulse 2s infinite;
}
```

### 10.3 Mode Préparation vs Live

**Toggle visuel clair :**

```vue
<template>
  <div :class="['mode-header', liveMode ? 'mode-header--live' : 'mode-header--prep']">
    <h2>Mode {{ liveMode ? 'LIVE 🔴' : 'Préparation' }}</h2>
  </div>
</template>

<style scoped>
.mode-header--prep {
  background: var(--color-primary);
  color: white;
}

.mode-header--live {
  background: var(--color-danger);
  color: white;
  animation: pulse 2s infinite;
}
</style>
```

### 10.4 Cartes Musiques

**Design uniforme :**

```css
.music-card {
  /* Base */
  background: var(--bg-glass);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  backdrop-filter: blur(var(--backdrop-blur));
  border: 1px solid var(--border-glass);

  /* Hover */
  transition: all var(--transition-base);
  cursor: pointer;
}

.music-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

/* État playing */
.music-card--playing {
  border: 2px solid var(--color-primary);
  background: rgba(74, 144, 226, 0.1);
}

.music-card--playing::before {
  content: '▶️';
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  animation: spin 2s linear infinite;
}
```

### 10.5 Drag & Drop Visuel

**Feedback clair pendant drag :**

```css
/* Élément draggé */
.music-card.dragging {
  opacity: 0.5;
  transform: scale(0.95);
  cursor: grabbing;
}

/* Zone de drop */
.drop-zone {
  border: 2px dashed var(--border-glass);
  background: rgba(74, 144, 226, 0.05);
  transition: all var(--transition-fast);
}

.drop-zone--active {
  border-color: var(--color-primary);
  background: rgba(74, 144, 226, 0.15);
  box-shadow: inset 0 0 20px rgba(74, 144, 226, 0.3);
}

.drop-zone--hover {
  border-color: var(--color-success);
  background: rgba(39, 174, 96, 0.1);
}
```

### 10.6 Lecteur Audio

**Design compact et fonctionnel :**

```css
.audio-player {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--bg-glass);
  border-radius: var(--radius-lg);
}

.audio-player__controls {
  display: flex;
  gap: var(--space-2);
}

.audio-player__progress {
  position: relative;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  cursor: pointer;
}

.audio-player__progress-bar {
  position: absolute;
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width var(--transition-fast);
}
```

---

## 11. Checklist Pre-Commit

**Avant chaque commit, vérifier :**

- [ ] Pas de `!important` (sauf justifié)
- [ ] Pas de magic numbers (utiliser tokens)
- [ ] Pas de styles inline
- [ ] Composants < 250 lignes
- [ ] Classes BEM respectées
- [ ] Responsive mobile-first testé
- [ ] Touch targets >= 48px (mobile)
- [ ] Contraste WCAG AA respecté
- [ ] Focus visible sur éléments interactifs
- [ ] Pas de console.log oubliés

---

## 12. Ressources

**Documentation CSS :**
- MDN CSS : https://developer.mozilla.org/en-US/docs/Web/CSS
- CSS Tricks : https://css-tricks.com/

**Design Tokens :**
- Style Dictionary : https://amzn.github.io/style-dictionary/

**Accessibilité :**
- WCAG Guidelines : https://www.w3.org/WAI/WCAG21/quickref/
- A11y Project : https://www.a11yproject.com/

**Vue.js Style Guide :**
- Vue Official : https://vuejs.org/style-guide/

---

*Fin des Frontend Rules*
*Version 2.0 - Octobre 2025*
*Cohérence garantie 🎨*
