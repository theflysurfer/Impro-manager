# 🔍 Research Findings - PWA + Audio + WebSocket

**Synthèse des recherches web pour Impro Manager v2.0**
*Octobre 2025*

---

## Table des Matières

1. [PWA avec Vue.js 3 + vite-plugin-pwa](#1-pwa-avec-vuejs-3--vite-plugin-pwa)
2. [Cache Strategies pour Fichiers Audio](#2-cache-strategies-pour-fichiers-audio)
3. [Socket.IO + Vue.js 3 Composition API](#3-socketio--vuejs-3-composition-api)
4. [HTML5 Audio Offline + Preloading](#4-html5-audio-offline--preloading)
5. [Recommendations Finales pour Impro Manager](#5-recommendations-finales-pour-impro-manager)

---

## 1. PWA avec Vue.js 3 + vite-plugin-pwa

### 1.1 Configuration Optimale 2025

**Source :** [Vite Plugin PWA Documentation](https://vite-pwa-org.netlify.app/)

**Stratégie recommandée : `generateSW` (par défaut)**

```js
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto', // Registration automatique

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],

        // Stratégies de cache
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 an
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\.example\.com\/data/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 jours
              }
            }
          }
        ]
      },

      manifest: {
        name: 'Impro Manager',
        short_name: 'ImproMgr',
        description: 'Gestion de matchs d\'improvisation avec musique',
        theme_color: '#4A90E2',
        background_color: '#1A1A2E',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
}
```

### 1.2 Stratégies de Cache Workbox

**Source :** [Chrome Developers - Workbox Caching Strategies](https://developer.chrome.com/docs/workbox/caching-strategies-overview)

**2 stratégies principales pour 2025 :**

1. **StaleWhileRevalidate** (Données fréquemment mises à jour)
   - Sert le cache immédiatement
   - Fetch update en arrière-plan
   - Idéal pour : API JSON, métadonnées musiques
   - Limite : 50 entrées max
   - Expiration : 30 jours

2. **CacheFirst** (Assets statiques)
   - Sert le cache sans requête réseau
   - Idéal pour : Images, fichiers audio
   - Limite : 100 entrées max
   - Expiration : 60 jours

### 1.3 Architecture Offline-First

**Principe :** "Design comme si offline par défaut, réseau = bonus"

```js
// Composable useOnlineStatus.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useOnlineStatus() {
  const isOnline = ref(navigator.onLine)

  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
  }

  onMounted(() => {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
  })

  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
  })

  return { isOnline }
}
```

**Utilisation dans composant :**

```vue
<template>
  <div v-if="!isOnline" class="offline-banner">
    ⚠️ MODE HORS LIGNE - Reconnexion automatique...
  </div>
</template>

<script setup>
import { useOnlineStatus } from '@/composables/useOnlineStatus'

const { isOnline } = useOnlineStatus()
</script>
```

### 1.4 Testing PWA

**Chrome DevTools :**
- Application tab → Manifest : Vérifier chargement manifest.json
- Application tab → Service Workers : Vérifier registration + status "activated"

**Lighthouse Audit :**
- Run → PWA category
- Score minimum : 80/100 pour installabilité

---

## 2. Cache Strategies pour Fichiers Audio

### 2.1 Limites de Stockage

**Source :** [Love2Dev - Service Worker Cache Storage Limit](https://love2dev.com/blog/what-is-the-service-worker-cache-storage-limit/)

**Limites par navigateur :**

| Navigateur | Cache Storage Limit |
|-----------|---------------------|
| **Safari/iOS** | ~50 MB (50 MiB) ⚠️ |
| **Chrome Desktop** | 500 MB (si espace disque > 1 GB) |
| **Chrome Android** | 500 MB |
| **Firefox** | 10% de l'espace disque libre |

**⚠️ PROBLÈME CRITIQUE pour Impro Manager :**
- Chansons totales : ~150-250 MB
- Bruitages : ~10 MB
- **Safari limite à 50 MB** → Impossible de tout cacher !

### 2.2 Solution : IndexedDB pour Gros Fichiers

**Source :** [Stack Overflow - Audio Caching Service Workers](https://stackoverflow.com/questions/52021966/how-to-cache-audio-file-for-service-workers)

**Approche recommandée :**

1. **Cache Storage API** : Petits fichiers (< 10 MB)
   - Bruitages (~100 fichiers, 10 MB total) ✅
   - Métadonnées JSON ✅

2. **IndexedDB** : Gros fichiers (> 10 MB)
   - Chansons individuelles (2-5 min, 3-8 MB chacune) ✅
   - Pas de limite stricte (sauf quota global navigateur)

**Implémentation IndexedDB pour Audio :**

```js
// utils/audioCache.js

const DB_NAME = 'impro-manager-audio'
const STORE_NAME = 'songs'
const DB_VERSION = 1

// Ouvrir la base de données
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

// Télécharger et cacher un fichier audio
export async function cacheSong(songId, audioUrl) {
  try {
    // 1. Fetch le fichier
    const response = await fetch(audioUrl)
    const blob = await response.blob()

    // 2. Stocker dans IndexedDB
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    await store.put({
      id: songId,
      blob: blob,
      url: audioUrl,
      cachedAt: Date.now()
    })

    return true
  } catch (error) {
    console.error('Cache song failed:', error)
    return false
  }
}

// Récupérer un fichier audio du cache
export async function getCachedSong(songId) {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)

    return new Promise((resolve, reject) => {
      const request = store.get(songId)
      request.onsuccess = () => {
        if (request.result) {
          // Créer un Blob URL pour lecture audio
          const blobUrl = URL.createObjectURL(request.result.blob)
          resolve(blobUrl)
        } else {
          resolve(null)
        }
      }
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Get cached song failed:', error)
    return null
  }
}

// Vérifier si un fichier est en cache
export async function isSongCached(songId) {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)

    return new Promise((resolve) => {
      const request = store.get(songId)
      request.onsuccess = () => resolve(!!request.result)
      request.onerror = () => resolve(false)
    })
  } catch (error) {
    return false
  }
}

// Liste toutes les chansons en cache
export async function listCachedSongs() {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)

    return new Promise((resolve, reject) => {
      const request = store.getAllKeys()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('List cached songs failed:', error)
    return []
  }
}

// Supprimer une chanson du cache
export async function deleteCachedSong(songId) {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    await store.delete(songId)
    return true
  } catch (error) {
    console.error('Delete cached song failed:', error)
    return false
  }
}
```

### 2.3 Progressive Download avec Progress Tracking

**Source :** [Micah Engle - Track Audio/Video Loading Progress with Workbox](https://micahjon.com/2022/track-download-progress-workbox/)

**GitHub Repo :** [fetch-progress-indicators](https://github.com/AnthumChris/fetch-progress-indicators)

**Implémentation avec ReadableStream :**

```js
// composables/useProgressiveDownload.js
import { ref } from 'vue'

export function useProgressiveDownload() {
  const downloadProgress = ref({})

  async function downloadWithProgress(songId, url) {
    const response = await fetch(url)
    const contentLength = response.headers.get('content-length')

    if (!contentLength) {
      // Pas de progress tracking si pas de Content-Length
      const blob = await response.blob()
      return blob
    }

    const total = parseInt(contentLength, 10)
    let loaded = 0

    downloadProgress.value[songId] = { loaded: 0, total, percent: 0 }

    const reader = response.body.getReader()
    const chunks = []

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      chunks.push(value)
      loaded += value.length

      // Update progress
      downloadProgress.value[songId] = {
        loaded,
        total,
        percent: Math.round((loaded / total) * 100)
      }
    }

    // Combine chunks into blob
    const blob = new Blob(chunks)
    return blob
  }

  return {
    downloadProgress,
    downloadWithProgress
  }
}
```

**Utilisation dans composant :**

```vue
<template>
  <div v-if="progress.percent < 100">
    Téléchargement : {{ progress.percent }}%
    <progress :value="progress.loaded" :max="progress.total"></progress>
  </div>
</template>

<script setup>
import { useProgressiveDownload } from '@/composables/useProgressiveDownload'
import { cacheSong } from '@/utils/audioCache'

const { downloadProgress, downloadWithProgress } = useProgressiveDownload()

const props = defineProps(['songId', 'url'])

const progress = computed(() => downloadProgress.value[props.songId] || { percent: 0 })

async function downloadSong() {
  const blob = await downloadWithProgress(props.songId, props.url)
  await cacheSong(props.songId, blob)
}
</script>
```

### 2.4 Range Requests pour Audio/Video

**Source :** [Chrome Developers - Serving Cached Audio and Video](https://developer.chrome.com/docs/workbox/serving-cached-audio-and-video)

**⚠️ IMPORTANT :** Les médias doivent être ajoutés au cache **explicitement** (précache ou cache.add()), car cacher pendant le streaming ne fonctionne pas (seul du contenu partiel est fetché).

**Configuration Workbox pour Range Requests :**

```js
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA({
      workbox: {
        // Activer workbox-range-requests
        runtimeCaching: [
          {
            urlPattern: /\.mp3$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache',
              plugins: [
                {
                  // Plugin pour Range Requests
                  cacheableResponse: {
                    statuses: [200, 206] // 206 = Partial Content
                  }
                }
              ]
            }
          }
        ]
      }
    })
  ]
}
```

**⚠️ Pour Impro Manager :** Utiliser IndexedDB au lieu de Range Requests (plus fiable pour gros fichiers).

---

## 3. Socket.IO + Vue.js 3 Composition API

### 3.1 Configuration Recommandée

**Source :** [Socket.IO Official - How to use with Vue 3](https://socket.io/how-to/use-with-vue)

**Architecture centralisée : Fichier socket.js séparé**

```js
// utils/socket.js
import { io } from 'socket.io-client'
import { reactive } from 'vue'

export const state = reactive({
  connected: false,
  currentMatch: null,
  currentLine: null,
  chronoElapsed: 0
})

// Initialisation Socket.IO (lazy)
let socket = null

export function initSocket(matchId, role) {
  if (socket) {
    socket.disconnect()
  }

  socket = io('https://api.impro-manager.com', {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000
  })

  // Events de connexion
  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket.id)
    state.connected = true

    // Rejoindre la room du match
    socket.emit('join_match', { matchId, role })
  })

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason)
    state.connected = false
  })

  // Events de reconnexion
  socket.on('reconnect', (attemptNumber) => {
    console.log('[Socket] Reconnected after', attemptNumber, 'attempts')
    state.connected = true

    // Re-joindre la room
    socket.emit('join_match', { matchId, role })
  })

  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('[Socket] Reconnection attempt', attemptNumber)
  })

  socket.on('reconnect_error', (error) => {
    console.error('[Socket] Reconnection error:', error)
  })

  // Events métier
  socket.on('line_started', (data) => {
    console.log('[Socket] Line started:', data)
    state.currentLine = data.lineId
  })

  socket.on('chrono_update', (data) => {
    state.chronoElapsed = data.elapsed
  })

  return socket
}

export function emitEvent(eventName, data) {
  if (!socket || !state.connected) {
    console.warn('[Socket] Cannot emit, not connected')
    return
  }

  socket.emit(eventName, data)
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
```

**Composable useWebSocket.js :**

```js
// composables/useWebSocket.js
import { readonly } from 'vue'
import { state, initSocket, emitEvent, disconnectSocket } from '@/utils/socket'

export function useWebSocket() {
  return {
    // State en lecture seule
    socketState: readonly(state),

    // Méthodes
    connect: initSocket,
    emit: emitEvent,
    disconnect: disconnectSocket
  }
}
```

**Utilisation dans composant :**

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useWebSocket } from '@/composables/useWebSocket'
import { useRoute } from 'vue-router'

const route = useRoute()
const { socketState, connect, emit, disconnect } = useWebSocket()

onMounted(() => {
  const matchId = route.params.id
  const role = 'MC' // ou 'Son'

  connect(matchId, role)
})

onUnmounted(() => {
  disconnect()
})

const startChrono = () => {
  emit('chrono_start', { matchId: route.params.id })
}
</script>

<template>
  <div>
    <div v-if="!socketState.connected" class="offline-indicator">
      🔴 Déconnecté - Reconnexion...
    </div>

    <div v-else class="online-indicator">
      🟢 Connecté
    </div>

    <p>Chrono : {{ socketState.chronoElapsed }}s</p>
    <button @click="startChrono">Démarrer</button>
  </div>
</template>
```

### 3.2 Gestion des Reconnexions

**Source :** [Socket.IO Client API](https://socket.io/docs/v3/client-api/)

**Best practices :**

1. **Message Queue pour ordre garantie :**

```js
// utils/messageQueue.js
class MessageQueue {
  constructor() {
    this.queue = []
    this.processing = false
  }

  enqueue(message) {
    this.queue.push(message)
    this.process()
  }

  async process() {
    if (this.processing || this.queue.length === 0) return

    this.processing = true

    while (this.queue.length > 0) {
      const message = this.queue.shift()
      await this.handleMessage(message)
    }

    this.processing = false
  }

  async handleMessage(message) {
    // Traiter le message selon son type
    console.log('Processing message:', message)
  }
}

export const messageQueue = new MessageQueue()
```

2. **Réémission événements après reconnexion :**

```js
socket.on('reconnect', () => {
  // Re-synchroniser l'état
  socket.emit('request_match_state', { matchId })
})

socket.on('match_state_sync', (data) => {
  // Mettre à jour l'état local
  state.currentLine = data.currentLine
  state.chronoElapsed = data.chronoElapsed
})
```

### 3.3 Heartbeat Adaptatif

```js
// Heartbeat différent selon device
const heartbeatInterval = navigator.userAgent.match(/Mobile|Android|iPhone/i)
  ? 10000  // 10 sec sur smartphone
  : 5000   // 5 sec sur desktop

socket = io(url, {
  heartbeatInterval,
  heartbeatTimeout: heartbeatInterval * 2
})
```

---

## 4. HTML5 Audio Offline + Preloading

### 4.1 Preload Strategy

**Source :** [MDN - HTMLMediaElement.preload](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/preload)

**Valeurs `preload` :**

| Valeur | Comportement | Usage Impro Manager |
|--------|--------------|---------------------|
| `none` | Aucun préchargement | ✅ Bibliothèque (preview on-demand) |
| `metadata` | Métadonnées seulement | ❌ Combat de bande passante |
| `auto` | Précharge tout | ❌ Trop coûteux (777 pistes) |

**Recommandation :**

```vue
<!-- Bibliothèque : Preload none -->
<audio :src="musicUrl" preload="none" ref="audioRef"></audio>

<!-- Mode Live : Preload manuel contrôlé -->
<audio :src="currentMusicUrl" preload="metadata" ref="audioRef"></audio>
```

**Preload manuel intelligent (Mode Live) :**

```js
// composables/useAudioPreloader.js
import { ref, watch } from 'vue'

export function useAudioPreloader(currentLineRef) {
  const preloadedAudios = ref(new Map())

  // Preload INTRO/OUTRO/TRANSITION de la ligne actuelle + suivante
  watch(currentLineRef, (newLine, oldLine) => {
    if (!newLine) return

    // Preload ligne actuelle
    preloadLineAudios(newLine)

    // Preload ligne suivante
    const nextLine = getNextLine(newLine)
    if (nextLine) {
      preloadLineAudios(nextLine)
    }

    // Nettoyer ancienne ligne (sauf si playing)
    if (oldLine) {
      cleanupLineAudios(oldLine)
    }
  }, { immediate: true })

  async function preloadLineAudios(line) {
    const audioUrls = [
      line.music?.intro?.url,
      line.music?.outro?.url,
      line.music?.transition?.url
    ].filter(Boolean)

    for (const url of audioUrls) {
      if (!preloadedAudios.value.has(url)) {
        const audio = new Audio()
        audio.preload = 'auto'
        audio.src = url

        preloadedAudios.value.set(url, audio)
      }
    }
  }

  function cleanupLineAudios(line) {
    const audioUrls = [
      line.music?.intro?.url,
      line.music?.outro?.url,
      line.music?.transition?.url
    ].filter(Boolean)

    for (const url of audioUrls) {
      const audio = preloadedAudios.value.get(url)
      if (audio && audio.paused) {
        audio.src = '' // Libérer mémoire
        preloadedAudios.value.delete(url)
      }
    }
  }

  return {
    preloadedAudios
  }
}
```

### 4.2 Lecture depuis Cache (Blob URLs)

**Source :** [GitHub - audio-cache-test](https://github.com/daffinm/audio-cache-test)

```js
// Récupérer et jouer un audio depuis IndexedDB
async function playAudioFromCache(songId) {
  // 1. Récupérer depuis IndexedDB
  const blobUrl = await getCachedSong(songId)

  if (!blobUrl) {
    console.error('Song not in cache:', songId)
    return
  }

  // 2. Charger dans element audio
  const audio = new Audio(blobUrl)

  // 3. Appliquer settings (fade in, volume, clip)
  audio.volume = 0.8

  // Fade in
  let currentVolume = 0
  audio.volume = 0
  const fadeInInterval = setInterval(() => {
    if (currentVolume < 0.8) {
      currentVolume += 0.05
      audio.volume = Math.min(currentVolume, 0.8)
    } else {
      clearInterval(fadeInInterval)
    }
  }, 100) // Fade in sur 2 sec (20 steps × 100ms)

  // 4. Play
  await audio.play()

  // 5. Cleanup Blob URL après lecture
  audio.addEventListener('ended', () => {
    URL.revokeObjectURL(blobUrl)
  })

  return audio
}
```

---

## 5. Recommendations Finales pour Impro Manager

### 5.1 Architecture de Cache Hybride

**Stratégie finale recommandée :**

```
┌─────────────────────────────────────────────────────┐
│           ARCHITECTURE DE CACHE HYBRIDE             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📦 Cache Storage API (Service Worker)             │
│  ├─ Assets statiques (JS, CSS, HTML, images)       │
│  ├─ Bruitages (~100 fichiers, 10 MB total) ✅      │
│  └─ Métadonnées JSON (music_library.json) ✅       │
│                                                     │
│  💾 IndexedDB                                       │
│  ├─ Chansons individuelles (3-8 MB chacune) ✅     │
│  ├─ Download progressif avec progress tracking     │
│  └─ Pas de limite stricte (quota navigateur)       │
│                                                     │
│  🌐 Network (fallback)                             │
│  └─ Si pas en cache → Fetch depuis serveur         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 5.2 Flow de Téléchargement

**Mode Préparation (Son) :**

```
1. Marc assigne musique "Western Showdown" à INTRO Séquence #1
   ↓
2. Trigger download automatique en arrière-plan
   ↓
3. IndexedDB.cacheSong('music_042', 'https://.../western.mp3')
   ↓
4. Progress bar affichée : "Téléchargement : 45%"
   ↓
5. Icône ✅ quand terminé
```

**Bouton "Télécharger tout" :**

```
1. Click [💾 Télécharger toutes les musiques]
   ↓
2. Liste toutes les musiques assignées au match
   ↓
3. Download batch avec Promise.all()
   ↓
4. Progress bar global : "12 / 24 musiques téléchargées"
   ↓
5. Toast : "✅ Toutes les musiques sont disponibles offline"
```

### 5.3 Configuration vite-plugin-pwa Finale

```js
// vite.config.js - Configuration complète
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      devOptions: {
        enabled: true // PWA en dev mode
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],

        // Exclure les gros fichiers audio (gérés par IndexedDB)
        globIgnores: ['**/audio/**/*.mp3'],

        runtimeCaching: [
          // API JSON (StaleWhileRevalidate)
          {
            urlPattern: /^https:\/\/api\.impro-manager\.com\/api\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 jours
              }
            }
          },

          // Bruitages (CacheFirst depuis /audio/sfx/)
          {
            urlPattern: /^https:\/\/api\.impro-manager\.com\/audio\/sfx\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'sfx-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 an
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },

      manifest: {
        name: 'Impro Manager',
        short_name: 'ImproMgr',
        description: 'Gestion de matchs d\'improvisation avec musique live',
        theme_color: '#4A90E2',
        background_color: '#1A1A2E',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
}
```

### 5.4 Composable Complet pour Audio

```js
// composables/useAudioPlayer.js - Version complète
import { ref, computed } from 'vue'
import { getCachedSong, cacheSong, isSongCached } from '@/utils/audioCache'

export function useAudioPlayer() {
  const currentAudio = ref(null)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(0.8)

  const progress = computed(() => {
    return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
  })

  async function loadAudio(songId, audioUrl, settings = {}) {
    // 1. Vérifier si en cache
    let audioSrc
    const cached = await isSongCached(songId)

    if (cached) {
      // Charger depuis IndexedDB
      audioSrc = await getCachedSong(songId)
    } else {
      // Charger depuis réseau
      audioSrc = audioUrl

      // Trigger cache en arrière-plan
      cacheSong(songId, audioUrl).catch(err => {
        console.error('Background caching failed:', err)
      })
    }

    // 2. Créer Audio element
    if (currentAudio.value) {
      currentAudio.value.pause()
      currentAudio.value.src = ''
    }

    currentAudio.value = new Audio(audioSrc)

    // 3. Appliquer settings
    currentAudio.value.volume = settings.volume || volume.value

    // Si clip défini
    if (settings.clipStart !== undefined) {
      currentAudio.value.currentTime = settings.clipStart

      // Event pour stop à clipEnd
      if (settings.clipEnd !== undefined) {
        currentAudio.value.addEventListener('timeupdate', () => {
          if (currentAudio.value.currentTime >= settings.clipEnd) {
            fadeOut(settings.fadeOut || 3)
          }
        })
      }
    }

    // 4. Event listeners
    currentAudio.value.addEventListener('loadedmetadata', () => {
      duration.value = currentAudio.value.duration
    })

    currentAudio.value.addEventListener('timeupdate', () => {
      currentTime.value = currentAudio.value.currentTime
    })

    currentAudio.value.addEventListener('ended', () => {
      isPlaying.value = false

      // Cleanup Blob URL si depuis cache
      if (audioSrc.startsWith('blob:')) {
        URL.revokeObjectURL(audioSrc)
      }
    })

    return currentAudio.value
  }

  async function play(fadeInDuration = 0) {
    if (!currentAudio.value) return

    if (fadeInDuration > 0) {
      await fadeIn(fadeInDuration)
    } else {
      await currentAudio.value.play()
    }

    isPlaying.value = true
  }

  function pause() {
    if (currentAudio.value) {
      currentAudio.value.pause()
      isPlaying.value = false
    }
  }

  function stop() {
    if (currentAudio.value) {
      currentAudio.value.pause()
      currentAudio.value.currentTime = 0
      isPlaying.value = false
    }
  }

  async function fadeIn(duration) {
    const targetVolume = currentAudio.value.volume
    const steps = 20
    const stepDuration = (duration * 1000) / steps
    const volumeStep = targetVolume / steps

    currentAudio.value.volume = 0
    await currentAudio.value.play()

    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration))
      currentAudio.value.volume = Math.min(volumeStep * i, targetVolume)
    }
  }

  async function fadeOut(duration) {
    const initialVolume = currentAudio.value.volume
    const steps = 20
    const stepDuration = (duration * 1000) / steps
    const volumeStep = initialVolume / steps

    for (let i = steps; i >= 0; i--) {
      await new Promise(resolve => setTimeout(resolve, stepDuration))
      currentAudio.value.volume = Math.max(volumeStep * i, 0)
    }

    currentAudio.value.pause()
    isPlaying.value = false
  }

  function seek(time) {
    if (currentAudio.value) {
      currentAudio.value.currentTime = time
    }
  }

  function setVolume(vol) {
    volume.value = vol
    if (currentAudio.value) {
      currentAudio.value.volume = vol
    }
  }

  return {
    // State
    isPlaying,
    currentTime,
    duration,
    volume,
    progress,

    // Methods
    loadAudio,
    play,
    pause,
    stop,
    fadeIn,
    fadeOut,
    seek,
    setVolume
  }
}
```

### 5.5 Liens Utiles

**Documentation officielle :**
- vite-plugin-pwa : https://vite-pwa-org.netlify.app/
- Workbox : https://developer.chrome.com/docs/workbox/
- Socket.IO : https://socket.io/docs/v4/
- IndexedDB : https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

**Repos GitHub utiles :**
- audio-cache-test : https://github.com/daffinm/audio-cache-test
- fetch-progress-indicators : https://github.com/AnthumChris/fetch-progress-indicators
- vite-plugin-pwa examples : https://github.com/vite-pwa/vite-plugin-pwa/tree/main/examples

**Articles :**
- PWA with offline streaming : https://web.dev/articles/pwa-with-offline-streaming
- Building PWA Music Player : https://dev.to/ndesmic/building-a-pwa-music-player-part-2-offline-2pbb
- Vue 3 + Socket.IO : https://dev.to/grawl/vue-3-composition-api-socketio-5den

---

*Fin des Research Findings*
*Octobre 2025*
*Prêt pour implémentation 🚀*
