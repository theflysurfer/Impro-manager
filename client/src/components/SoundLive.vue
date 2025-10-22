<template>
  <div class="sound-live">
    <header class="live-header">
      <button @click="$router.push(`/sound/${route.params.matchId}`)" class="btn-back" aria-label="Retour à la préparation">
        ← Retour
      </button>
      <h1>🎵 MODE LIVE SON 🔴</h1>
      <p>{{ matchTitle }}</p>
      <div class="connection-status" role="status" :aria-label="socketState.connected ? 'Connecté au serveur' : 'Déconnecté du serveur'">
        <span v-if="socketState.connected" class="status-connected" aria-label="Connecté">🟢 Connecté</span>
        <span v-else class="status-disconnected" aria-label="Déconnecté">🔴 Déconnecté</span>
      </div>
    </header>

    <div class="live-container">
      <!-- Ligne Actuelle -->
      <section class="section-current-line card">
        <h2>🎬 Ligne Actuelle</h2>
        <div v-if="currentLine" class="current-line-info">
          <h3 class="line-title">{{ currentLine.title }}</h3>
          <div class="line-meta">
            <span class="line-type">{{ currentLine.type }}</span>
            <span class="line-duration">⏱️ {{ formatTime(currentLine.duration_planned) }}</span>
          </div>

          <!-- Chronomètre Synchronisé -->
          <div class="chrono-display" aria-live="polite" aria-atomic="true">
            <div class="chrono-time" role="timer">{{ formatTime(socketState.chronoElapsed) }}</div>
            <div class="chrono-status" :class="`status-${socketState.chronoStatus}`">
              {{ chronoStatusLabel }}
            </div>
          </div>

          <!-- Musique Assignée -->
          <div v-if="currentLine.music" class="assigned-music">
            <h4>🎵 Musique Assignée</h4>
            <div class="music-info">
              <p class="music-title">{{ getMusicTitle(currentLine.music) }}</p>
              <p class="music-artist">{{ getMusicArtist(currentLine.music) }}</p>
            </div>
            <div class="player-controls">
              <button @click="playMusic(currentLine.music)" :disabled="isPlaying" class="btn btn-play" aria-label="Lire la musique">
                ▶️ Play
              </button>
              <button @click="pauseMusic" :disabled="!isPlaying" class="btn btn-pause" aria-label="Mettre en pause la musique">
                ⏸️ Pause
              </button>
              <button @click="stopMusic" class="btn btn-stop" aria-label="Arrêter la musique">
                ⏹️ Stop
              </button>
            </div>
            <div class="volume-control">
              <label>🔊 Volume</label>
              <input type="range" v-model="volume" @input="setVolume" min="0" max="100" />
              <span>{{ volume }}%</span>
            </div>
          </div>
          <div v-else class="no-music">
            <p>⚠️ Aucune musique assignée</p>
          </div>
        </div>
        <div v-else class="no-current-line">
          <p>En attente du démarrage...</p>
        </div>
      </section>

      <!-- Progression Complète -->
      <section class="section-progression card">
        <h2>📜 Toutes les Lignes</h2>
        <div class="lines-list">
          <div
            v-for="(line, index) in lines"
            :key="line.line_id"
            :class="['line-item', { 'active': line.line_id === socketState.currentLine }]"
          >
            <span class="line-number">{{ index + 1 }}.</span>
            <span class="line-title">{{ line.title }}</span>
            <span class="line-duration">{{ formatTime(line.duration_planned) }}</span>
            <span v-if="line.music" class="has-music">🎵</span>
            <span v-else class="no-music-icon">⚠️</span>
          </div>
        </div>
      </section>

      <!-- Recherche Rapide Bruitages -->
      <section class="section-quick-search card">
        <h2>🔍 Recherche Rapide</h2>
        <input
          type="text"
          v-model="quickSearch"
          placeholder="Chercher bruitage ou musique..."
          class="search-input"
        />
        <div class="quick-results">
          <div
            v-for="music in filteredQuickResults"
            :key="music.id"
            class="quick-result-item"
            @click="playMusic(music.id)"
          >
            <span class="music-title">{{ music.title }}</span>
            <span class="music-duration">{{ formatTime(music.duration) }}</span>
          </div>
        </div>
      </section>

      <!-- Score (lecture seule) -->
      <section class="section-score card">
        <h2>📊 Score</h2>
        <div class="score-container">
          <div class="team">
            <h3>{{ match?.teams?.home?.name || 'Équipe A' }}</h3>
            <div class="score">{{ socketState.scores.home }}</div>
          </div>
          <div class="team">
            <h3>{{ match?.teams?.away?.name || 'Équipe B' }}</h3>
            <div class="score">{{ socketState.scores.away }}</div>
          </div>
        </div>
      </section>
    </div>

    <!-- Audio Player (caché) -->
    <audio ref="audioPlayer" @ended="onAudioEnded"></audio>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWebSocket } from '../composables/useWebSocket'

const route = useRoute()
const { socketState, connect, disconnect } = useWebSocket()

const match = ref(null)
const matchTitle = ref('Chargement...')
const lines = ref([])
const currentLine = computed(() => {
  if (!socketState.currentLine) return null
  return lines.value.find(l => l.line_id === socketState.currentLine)
})

const musicLibrary = ref([])
const audioPlayer = ref(null)
const isPlaying = ref(false)
const volume = ref(80)
const quickSearch = ref('')

const chronoStatusLabel = computed(() => {
  switch (socketState.chronoStatus) {
    case 'running': return '▶️ En cours'
    case 'paused': return '⏸️ Pause'
    case 'stopped': return '⏹️ Arrêté'
    default: return '—'
  }
})

const filteredQuickResults = computed(() => {
  if (!quickSearch.value) return musicLibrary.value.slice(0, 10)
  const query = quickSearch.value.toLowerCase()
  return musicLibrary.value.filter(m =>
    m.title.toLowerCase().includes(query) ||
    m.artist?.toLowerCase().includes(query) ||
    m.scenarios?.some(s => s.toLowerCase().includes(query))
  ).slice(0, 10)
})

async function loadMatch() {
  try {
    const matchId = route.params.matchId
    const response = await fetch(`/api/matches/${matchId}`)
    match.value = await response.json()
    matchTitle.value = match.value.title || 'Match'
    lines.value = match.value.lines || []
  } catch (error) {
    console.error('Erreur chargement match:', error)
  }
}

async function loadMusicLibrary() {
  try {
    const response = await fetch('/api/music')
    musicLibrary.value = await response.json()
  } catch (error) {
    console.error('Erreur chargement bibliothèque:', error)
  }
}

function getMusicTitle(musicId) {
  const music = musicLibrary.value.find(m => m.id === musicId)
  return music?.title || 'Titre inconnu'
}

function getMusicArtist(musicId) {
  const music = musicLibrary.value.find(m => m.id === musicId)
  return music?.artist || 'Artiste inconnu'
}

function playMusic(musicId) {
  const music = musicLibrary.value.find(m => m.id === musicId)
  if (!music) {
    console.error('Musique introuvable:', musicId)
    return
  }

  if (audioPlayer.value) {
    audioPlayer.value.src = `/api/music/${musicId}/file`
    audioPlayer.value.volume = volume.value / 100
    audioPlayer.value.play()
    isPlaying.value = true
  }
}

function pauseMusic() {
  if (audioPlayer.value) {
    audioPlayer.value.pause()
    isPlaying.value = false
  }
}

function stopMusic() {
  if (audioPlayer.value) {
    audioPlayer.value.pause()
    audioPlayer.value.currentTime = 0
    isPlaying.value = false
  }
}

function setVolume() {
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value / 100
  }
}

function onAudioEnded() {
  isPlaying.value = false
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Watch pour ligne active
watch(() => socketState.currentLine, (newLineId) => {
  console.log('[Sound] Nouvelle ligne active:', newLineId)
})

// Watch pour chrono
watch(() => socketState.chronoElapsed, (elapsed) => {
  // Possibilité d'ajouter logique auto-play à certains moments
})

onMounted(async () => {
  await loadMatch()
  await loadMusicLibrary()
  connect(route.params.matchId, 'SOUND')
})

onUnmounted(() => {
  stopMusic()
  disconnect()
})
</script>

<style scoped>
.sound-live {
  min-height: 100vh;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 20px;
}

.live-header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.live-header h1 {
  font-size: 2.5em;
  margin: 0;
}

.connection-status {
  margin-top: 10px;
}

.status-connected { color: #4ade80; font-weight: bold; }
.status-disconnected { color: #ef4444; font-weight: bold; }

.live-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.section-current-line {
  grid-row: 1 / 3;
}

.section-progression {
  grid-column: 2;
}

.section-quick-search {
  grid-column: 1;
}

.section-score {
  grid-column: 2;
}

.current-line-info {
  text-align: center;
}

.line-title {
  font-size: 2em;
  color: #667eea;
  margin: 20px 0;
}

.line-meta {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.line-type {
  background: #fbbf24;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  color: white;
}

.line-duration {
  background: #667eea;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  color: white;
}

.chrono-display {
  margin: 30px 0;
  padding: 30px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
}

.chrono-time {
  font-size: 4em;
  font-weight: bold;
  color: #667eea;
}

.chrono-status {
  font-size: 1.2em;
  margin-top: 10px;
  font-weight: bold;
}

.status-running { color: #4ade80; }
.status-paused { color: #fbbf24; }
.status-stopped { color: #6b7280; }

.assigned-music {
  margin-top: 30px;
  padding: 20px;
  background: rgba(245, 87, 108, 0.1);
  border-radius: 12px;
}

.music-info {
  margin: 20px 0;
}

.music-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #f5576c;
  margin: 10px 0;
}

.music-artist {
  font-size: 1.1em;
  color: #333;
}

.player-controls {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.volume-control input[type="range"] {
  width: 200px;
}

.no-music {
  margin-top: 30px;
  padding: 30px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 12px;
  color: #ef4444;
  font-weight: bold;
}

.no-current-line {
  text-align: center;
  padding: 60px 20px;
  color: #333;
  font-size: 1.2em;
}

.lines-list {
  max-height: 400px;
  overflow-y: auto;
  margin-top: 20px;
}

.line-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: #f3f4f6;
  border-radius: 8px;
  transition: all 0.2s;
}

.line-item.active {
  background: #f5576c;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
}

.has-music {
  font-size: 1.2em;
}

.no-music-icon {
  color: #ef4444;
}

.search-input {
  width: 100%;
  padding: 15px;
  font-size: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  margin-top: 10px;
}

.search-input:focus {
  outline: none;
  border-color: #f5576c;
}

.quick-results {
  margin-top: 15px;
  max-height: 300px;
  overflow-y: auto;
}

.quick-result-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  margin-bottom: 8px;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-result-item:hover {
  background: #f5576c;
  color: white;
  transform: translateX(5px);
}

.score-container {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.team {
  text-align: center;
}

.team h3 {
  margin: 0 0 10px 0;
  font-size: 1em;
}

.score {
  font-size: 3em;
  font-weight: bold;
  color: #f5576c;
  margin: 10px 0;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-play { background: #4ade80; color: white; }
.btn-pause { background: #fbbf24; color: white; }
.btn-stop { background: #ef4444; color: white; }

.btn-back {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-5px);
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .live-container {
    grid-template-columns: 1fr;
  }

  .section-current-line {
    grid-row: auto;
  }

  .section-progression,
  .section-quick-search,
  .section-score {
    grid-column: 1;
  }

  .btn-back {
    position: static;
    margin-bottom: 20px;
  }
}
</style>
