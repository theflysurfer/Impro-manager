<template>
  <div class="mc-live">
    <header class="live-header">
      <button @click="$router.push(`/mc/${route.params.matchId}`)" class="btn-back" aria-label="Retour à la préparation">
        ← Retour
      </button>
      <h1>🎭 MODE LIVE 🔴</h1>
      <p>{{ matchTitle }}</p>
      <div class="connection-status" role="status" :aria-label="socketState.connected ? 'Connecté au serveur' : 'Déconnecté du serveur'">
        <span v-if="socketState.connected" class="status-connected" aria-label="Connecté">🟢 Connecté</span>
        <span v-else class="status-disconnected" aria-label="Déconnecté">🔴 Déconnecté</span>
      </div>
    </header>

    <div class="live-container">
      <!-- Chronomètre -->
      <section class="section-chrono card">
        <h2>⏱️ Chronomètre</h2>
        <div class="chrono-display" aria-live="polite" aria-atomic="true">
          <div class="chrono-time" role="timer">{{ formatTime(chronoElapsed) }}</div>
          <div class="chrono-total">/ {{ formatTime(currentLineDuration) }}</div>
        </div>
        <div class="chrono-controls">
          <button @click="startChrono" :disabled="chronoStatus === 'running'" class="btn btn-success" aria-label="Démarrer le chronomètre">▶️ Démarrer</button>
          <button @click="pauseChrono" :disabled="chronoStatus !== 'running'" class="btn btn-warning" aria-label="Mettre en pause le chronomètre">⏸️ Pause</button>
          <button @click="stopChrono" class="btn btn-danger" aria-label="Arrêter le chronomètre">⏹️ Stop</button>
          <button @click="resetChrono" class="btn btn-secondary" aria-label="Réinitialiser le chronomètre">🔄 Reset</button>
        </div>
      </section>

      <!-- Score -->
      <section class="section-score card">
        <h2>📊 Score</h2>
        <div class="score-container">
          <div class="team">
            <h3>{{ match?.teams?.home?.name || 'Équipe A' }}</h3>
            <div class="score">{{ scores.home }}</div>
            <div class="score-controls">
              <button @click="addScore('home', 1)" class="btn btn-sm btn-score" :aria-label="`Ajouter 1 point à ${match?.teams?.home?.name || 'Équipe A'}`">+1</button>
              <button @click="addScore('home', 2)" class="btn btn-sm btn-score" :aria-label="`Ajouter 2 points à ${match?.teams?.home?.name || 'Équipe A'}`">+2</button>
              <button @click="addScore('home', 3)" class="btn btn-sm btn-score" :aria-label="`Ajouter 3 points à ${match?.teams?.home?.name || 'Équipe A'}`">+3</button>
            </div>
          </div>
          <div class="team">
            <h3>{{ match?.teams?.away?.name || 'Équipe B' }}</h3>
            <div class="score">{{ scores.away }}</div>
            <div class="score-controls">
              <button @click="addScore('away', 1)" class="btn btn-sm btn-score" :aria-label="`Ajouter 1 point à ${match?.teams?.away?.name || 'Équipe B'}`">+1</button>
              <button @click="addScore('away', 2)" class="btn btn-sm btn-score" :aria-label="`Ajouter 2 points à ${match?.teams?.away?.name || 'Équipe B'}`">+2</button>
              <button @click="addScore('away', 3)" class="btn btn-sm btn-score" :aria-label="`Ajouter 3 points à ${match?.teams?.away?.name || 'Équipe B'}`">+3</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Progression -->
      <section class="section-progression card">
        <h2>📜 Progression</h2>
        <div class="lines-list">
          <div
            v-for="(line, index) in lines"
            :key="line.line_id"
            :class="['line-item', { 'active': line.line_id === currentLineId }]"
            @click="setCurrentLine(line.line_id, index)"
          >
            <span class="line-number">{{ index + 1 }}.</span>
            <span class="line-title">{{ line.title }}</span>
            <span class="line-duration">{{ formatTime(line.duration_planned) }}</span>
          </div>
        </div>
        <button @click="nextLine" class="btn btn-primary btn-block">⏭️ Ligne Suivante</button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWebSocket } from '../composables/useWebSocket'

const route = useRoute()
const { socketState, connect, disconnect, emitLineStarted, emitChronoUpdate } = useWebSocket()

const match = ref(null)
const matchTitle = ref('Chargement...')
const lines = ref([])
const currentLineId = ref(null)
const currentLineIndex = ref(0)
const currentLineDuration = computed(() => {
  const line = lines.value[currentLineIndex.value]
  return line?.duration_planned || 0
})

const chronoElapsed = ref(0)
const chronoStatus = ref('stopped')
const chronoInterval = ref(null)

const scores = ref({ home: 0, away: 0 })

async function loadMatch() {
  try {
    const matchId = route.params.matchId
    const response = await fetch(`/api/matches/${matchId}`)
    match.value = await response.json()
    matchTitle.value = match.value.title || 'Match'
    lines.value = match.value.lines || []

    if (lines.value.length > 0) {
      currentLineId.value = lines.value[0].line_id
      currentLineIndex.value = 0
    }

    scores.value = {
      home: match.value.teams?.home?.score || 0,
      away: match.value.teams?.away?.score || 0
    }
  } catch (error) {
    console.error('Erreur chargement match:', error)
  }
}

function startChrono() {
  if (chronoStatus.value === 'running') return

  chronoStatus.value = 'running'
  chronoInterval.value = setInterval(() => {
    chronoElapsed.value++
    emitChronoUpdate(chronoElapsed.value, 'running')
  }, 1000)
}

function pauseChrono() {
  chronoStatus.value = 'paused'
  clearInterval(chronoInterval.value)
  emitChronoUpdate(chronoElapsed.value, 'paused')
}

function stopChrono() {
  chronoStatus.value = 'stopped'
  clearInterval(chronoInterval.value)
  chronoElapsed.value = 0
  emitChronoUpdate(0, 'stopped')
}

function resetChrono() {
  stopChrono()
}

function setCurrentLine(lineId, index) {
  currentLineId.value = lineId
  currentLineIndex.value = index
  stopChrono()
  emitLineStarted(lineId)
}

function nextLine() {
  if (currentLineIndex.value < lines.value.length - 1) {
    const nextIndex = currentLineIndex.value + 1
    const nextLineId = lines.value[nextIndex].line_id
    setCurrentLine(nextLineId, nextIndex)
  }
}

function addScore(team, points) {
  scores.value[team] += points
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

onMounted(async () => {
  await loadMatch()
  connect(route.params.matchId, 'MC')
})

onUnmounted(() => {
  clearInterval(chronoInterval.value)
  disconnect()
})
</script>

<style scoped>
.mc-live {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.connection-status {
  margin-top: 10px;
}

.status-connected { color: #4ade80; font-weight: bold; }
.status-disconnected { color: #ef4444; font-weight: bold; }

.live-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.section-progression {
  grid-column: 1 / -1;
}

.chrono-display {
  text-align: center;
  margin: 30px 0;
}

.chrono-time {
  font-size: 4em;
  font-weight: bold;
  color: #667eea;
}

.chrono-total {
  font-size: 1.5em;
  color: #333;
}

.chrono-controls {
  display: flex;
  gap: 10px;
  justify-content: center;
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
}

.score {
  font-size: 3em;
  font-weight: bold;
  color: #667eea;
  margin: 20px 0;
}

.score-controls {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.lines-list {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.line-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.line-item:hover {
  background: #e5e7eb;
  transform: translateX(5px);
}

.line-item.active {
  background: #667eea;
  color: white;
  font-weight: bold;
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

.btn-success { background: #4ade80; color: white; }
.btn-warning { background: #fbbf24; color: white; }
.btn-danger { background: #ef4444; color: white; }
.btn-secondary { background: #6b7280; color: white; }
.btn-primary { background: #667eea; color: white; }
.btn-block { width: 100%; }
.btn-sm { padding: 8px 16px; font-size: 14px; }

/* Mobile optimizations */
@media (max-width: 768px) {
  .live-container {
    grid-template-columns: 1fr;
  }

  .section-progression {
    grid-column: 1;
  }

  .btn-back {
    position: static;
    margin-bottom: 20px;
  }

  .btn-score {
    padding: 12px 20px !important;
    font-size: 16px !important;
    min-width: 60px;
  }

  .score-controls {
    gap: 10px !important;
  }
}
</style>
