<template>
  <div class="music-assignment-panel card">
    <h3 class="card-title">
      <i class="fas fa-music"></i>
      Assignation Musicale (3 Points)
    </h3>

    <div v-if="!lines || lines.length === 0" class="empty-state">
      <p>Aucune ligne dans ce match.</p>
    </div>

    <div v-else class="lines-list">
      <div
        v-for="(line, index) in lines"
        :key="line.line_id"
        class="line-panel"
        :class="{ 'collapsed': collapsedLines[line.line_id] }"
      >
        <div class="line-header" @click="toggleLine(line.line_id)">
          <div class="line-info">
            <span class="line-number">{{ index + 1 }}.</span>
            <span class="line-title">{{ line.title }}</span>
            <span class="line-type">{{ line.type }}</span>
            <span class="line-duration">{{ formatDuration(line.duration_planned) }}</span>
          </div>
          <div class="music-status">
            <span v-if="getMusicCount(line) === 3" class="status-complete">
              <i class="fas fa-check-circle"></i> 3/3
            </span>
            <span v-else-if="getMusicCount(line) > 0" class="status-partial">
              <i class="fas fa-exclamation-triangle"></i> {{ getMusicCount(line) }}/3
            </span>
            <span v-else class="status-empty">
              <i class="fas fa-music-slash"></i> 0/3
            </span>
            <i class="fas fa-chevron-down toggle-icon"></i>
          </div>
        </div>

        <div class="line-body" v-if="!collapsedLines[line.line_id]">
          <div class="music-points">
            <!-- INTRO -->
            <div class="music-point">
              <h4>🎬 INTRO (Début)</h4>
              <MusicAssignment
                v-model="line.music.intro"
                :musicLibrary="musicLibrary"
                @openSelector="openSelector(line.line_id, 'intro')"
                @update:modelValue="updateMusic(line.line_id, 'intro', $event)"
              />
            </div>

            <!-- OUTRO -->
            <div class="music-point">
              <h4>🎭 OUTRO (Fin)</h4>
              <MusicAssignment
                v-model="line.music.outro"
                :musicLibrary="musicLibrary"
                @openSelector="openSelector(line.line_id, 'outro')"
                @update:modelValue="updateMusic(line.line_id, 'outro', $event)"
              />
            </div>

            <!-- TRANSITION -->
            <div class="music-point">
              <h4>🔄 TRANSITION</h4>
              <MusicAssignment
                v-model="line.music.transition"
                :musicLibrary="musicLibrary"
                @openSelector="openSelector(line.line_id, 'transition')"
                @update:modelValue="updateMusic(line.line_id, 'transition', $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Music Selector Modal -->
    <div v-if="showSelector" class="modal-overlay" @click="closeSelector">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>🎵 Sélectionner une Musique</h3>
          <button @click="closeSelector" class="btn-close">×</button>
        </div>

        <div class="modal-body">
          <!-- Search and filters -->
          <div class="search-filters">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher par titre, artiste, scénario..."
              class="form-input"
              style="width: 100%; margin-bottom: 15px;"
            />

            <div class="filters" style="display: flex; gap: 10px; margin-bottom: 15px;">
              <select v-model="filterScenario" class="form-input" style="flex: 1;">
                <option value="">Tous scénarios</option>
                <option v-for="scenario in availableScenarios" :key="scenario" :value="scenario">
                  {{ scenario }}
                </option>
              </select>

              <select v-model="filterTempo" class="form-input" style="flex: 1;">
                <option value="">Tous tempos</option>
                <option value="slow">Lent (< 100 BPM)</option>
                <option value="medium">Modéré (100-140 BPM)</option>
                <option value="fast">Rapide (> 140 BPM)</option>
              </select>
            </div>
          </div>

          <!-- Music list -->
          <div class="music-selector-list" style="max-height: 400px; overflow-y: auto;">
            <div
              v-for="music in filteredMusic"
              :key="music.id"
              class="music-selector-item"
              @click="selectMusic(music)"
            >
              <div class="music-selector-info">
                <span class="music-title">{{ music.title }}</span>
                <span class="music-artist">{{ music.artist || 'Inconnu' }}</span>
              </div>
              <div class="music-selector-meta">
                <span class="music-duration">{{ formatDuration(music.duration) }}</span>
                <span v-if="music.scenarios" class="music-scenarios">
                  {{ music.scenarios.slice(0, 2).join(', ') }}
                </span>
              </div>
            </div>

            <div v-if="filteredMusic.length === 0" class="empty-results">
              <p>Aucune musique trouvée</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MusicAssignment from './MusicAssignment.vue'

export default {
  name: 'MusicAssignmentPanel',
  components: {
    MusicAssignment
  },
  props: {
    lines: {
      type: Array,
      default: () => []
    },
    musicLibrary: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:lines'],
  data() {
    return {
      collapsedLines: {},
      showSelector: false,
      currentLineId: null,
      currentPoint: null, // 'intro', 'outro', or 'transition'
      searchQuery: '',
      filterScenario: '',
      filterTempo: ''
    }
  },
  computed: {
    availableScenarios() {
      const scenarios = new Set()
      this.musicLibrary.forEach(music => {
        if (music.scenarios) {
          music.scenarios.forEach(s => scenarios.add(s))
        }
      })
      return Array.from(scenarios).sort()
    },
    filteredMusic() {
      let filtered = this.musicLibrary

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(m =>
          m.title?.toLowerCase().includes(query) ||
          m.artist?.toLowerCase().includes(query) ||
          m.scenarios?.some(s => s.toLowerCase().includes(query))
        )
      }

      if (this.filterScenario) {
        filtered = filtered.filter(m =>
          m.scenarios?.includes(this.filterScenario)
        )
      }

      if (this.filterTempo) {
        filtered = filtered.filter(m => {
          const tempo = m.tempo || 0
          if (this.filterTempo === 'slow') return tempo < 100
          if (this.filterTempo === 'medium') return tempo >= 100 && tempo <= 140
          if (this.filterTempo === 'fast') return tempo > 140
          return true
        })
      }

      return filtered
    }
  },
  methods: {
    toggleLine(lineId) {
      this.collapsedLines[lineId] = !this.collapsedLines[lineId]
      this.$forceUpdate()
    },
    getMusicCount(line) {
      if (!line.music) return 0
      let count = 0
      if (line.music.intro?.music_id) count++
      if (line.music.outro?.music_id) count++
      if (line.music.transition?.music_id) count++
      return count
    },
    formatDuration(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${String(secs).padStart(2, '0')}`
    },
    openSelector(lineId, point) {
      this.currentLineId = lineId
      this.currentPoint = point
      this.showSelector = true
    },
    closeSelector() {
      this.showSelector = false
      this.currentLineId = null
      this.currentPoint = null
      this.searchQuery = ''
      this.filterScenario = ''
      this.filterTempo = ''
    },
    selectMusic(music) {
      const assignment = {
        music_id: music.id,
        settings: {
          play_type: 'full',
          clip_start: null,
          clip_end: null,
          fade_in: 2,
          fade_out: 3,
          volume: 80
        }
      }

      this.updateMusic(this.currentLineId, this.currentPoint, assignment)
      this.closeSelector()
    },
    updateMusic(lineId, point, assignment) {
      const lineIndex = this.lines.findIndex(l => l.line_id === lineId)
      if (lineIndex === -1) return

      const updatedLines = [...this.lines]
      if (!updatedLines[lineIndex].music) {
        updatedLines[lineIndex].music = {
          intro: null,
          outro: null,
          transition: null
        }
      }

      updatedLines[lineIndex].music[point] = assignment

      this.$emit('update:lines', updatedLines)
    }
  }
}
</script>

<style scoped>
.music-assignment-panel {
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #a0aec0;
}

.lines-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.line-panel {
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s;
}

.line-panel.collapsed .line-body {
  display: none;
}

.line-panel.collapsed .toggle-icon {
  transform: rotate(-90deg);
}

.line-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f7fafc;
  cursor: pointer;
  transition: background 0.2s;
}

.line-header:hover {
  background: #edf2f7;
}

.line-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.line-number {
  font-weight: bold;
  color: #667eea;
  font-size: 1.1em;
}

.line-title {
  font-weight: 600;
  color: #2d3748;
}

.line-type {
  background: #fbbf24;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 600;
}

.line-duration {
  color: #718096;
  font-size: 0.9em;
}

.music-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-complete {
  color: #48bb78;
  font-weight: 600;
}

.status-partial {
  color: #ed8936;
  font-weight: 600;
}

.status-empty {
  color: #a0aec0;
}

.toggle-icon {
  transition: transform 0.3s;
  color: #a0aec0;
}

.line-body {
  padding: 20px;
  background: white;
}

.music-points {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.music-point h4 {
  margin: 0 0 10px 0;
  color: #4a5568;
  font-size: 0.95em;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2em;
  cursor: pointer;
  color: #a0aec0;
  line-height: 1;
  padding: 0;
  width: 40px;
  height: 40px;
}

.btn-close:hover {
  color: #4a5568;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.form-input {
  padding: 10px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 1em;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.music-selector-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.music-selector-item:hover {
  background: #f7fafc;
  border-color: #667eea;
  transform: translateX(5px);
}

.music-selector-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.music-title {
  font-weight: 600;
  color: #2d3748;
}

.music-artist {
  font-size: 0.9em;
  color: #718096;
}

.music-selector-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.music-duration {
  font-weight: 600;
  color: #667eea;
}

.music-scenarios {
  font-size: 0.85em;
  color: #a0aec0;
}

.empty-results {
  text-align: center;
  padding: 40px;
  color: #a0aec0;
}
</style>
