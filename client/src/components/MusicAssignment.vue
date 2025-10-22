<template>
  <div class="music-assignment">
    <!-- Zone d'assignation -->
    <div v-if="!assignedMusic" class="empty-zone" @click="openMusicSelector">
      <i class="fas fa-plus"></i>
      <span>Assigner une musique</span>
    </div>

    <!-- Musique assignée -->
    <div v-else class="assigned-zone">
      <div class="music-info">
        <i class="fas fa-music"></i>
        <div class="music-details">
          <span class="music-title">{{ musicTitle }}</span>
          <span class="music-artist">{{ musicArtist }}</span>
          <span class="music-duration">{{ formatDuration(musicDuration) }}</span>
        </div>
      </div>
      <div class="actions">
        <button @click="openSettings" class="btn-icon" title="Paramètres">
          <i class="fas fa-cog"></i>
        </button>
        <button @click="removeMusic" class="btn-icon btn-danger" title="Retirer">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <!-- Modal Settings (si musique assignée) -->
    <div v-if="showSettings" class="modal-overlay" @click="closeSettings">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>⚙️ Paramètres Musique</h3>
          <button @click="closeSettings" class="btn-close">×</button>
        </div>

        <div class="modal-body">
          <div class="setting-group">
            <label>Type de lecture</label>
            <select v-model="settings.play_type" class="form-input">
              <option value="full">Lecture entière</option>
              <option value="clip_auto">Clip auto (meilleur extrait)</option>
              <option value="clip_custom">Clip personnalisé</option>
            </select>
          </div>

          <div v-if="settings.play_type === 'clip_custom'" class="setting-group">
            <label>Point de départ (secondes)</label>
            <input
              type="number"
              v-model.number="settings.clip_start"
              :max="musicDuration"
              class="form-input"
            />
          </div>

          <div v-if="settings.play_type === 'clip_custom'" class="setting-group">
            <label>Point de fin (secondes)</label>
            <input
              type="number"
              v-model.number="settings.clip_end"
              :max="musicDuration"
              class="form-input"
            />
          </div>

          <div class="setting-group">
            <label>Fade in (secondes)</label>
            <input
              type="range"
              v-model.number="settings.fade_in"
              min="0"
              max="10"
              step="0.5"
              class="slider"
            />
            <span>{{ settings.fade_in }}s</span>
          </div>

          <div class="setting-group">
            <label>Fade out (secondes)</label>
            <input
              type="range"
              v-model.number="settings.fade_out"
              min="0"
              max="10"
              step="0.5"
              class="slider"
            />
            <span>{{ settings.fade_out }}s</span>
          </div>

          <div class="setting-group">
            <label>Volume (%)</label>
            <input
              type="range"
              v-model.number="settings.volume"
              min="0"
              max="100"
              step="5"
              class="slider"
            />
            <span>{{ settings.volume }}%</span>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="saveSettings" class="btn btn-primary">
            <i class="fas fa-save"></i> Sauvegarder
          </button>
          <button @click="closeSettings" class="btn btn-secondary">
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MusicAssignment',
  props: {
    modelValue: {
      type: Object,
      default: null
    },
    musicLibrary: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'openSelector'],
  data() {
    return {
      showSettings: false,
      settings: {
        play_type: 'full',
        clip_start: null,
        clip_end: null,
        fade_in: 2,
        fade_out: 3,
        volume: 80
      }
    }
  },
  computed: {
    assignedMusic() {
      return this.modelValue
    },
    musicData() {
      if (!this.assignedMusic?.music_id) return null
      return this.musicLibrary.find(m => m.id === this.assignedMusic.music_id)
    },
    musicTitle() {
      return this.musicData?.title || 'Titre inconnu'
    },
    musicArtist() {
      return this.musicData?.artist || 'Artiste inconnu'
    },
    musicDuration() {
      return this.musicData?.duration || 0
    }
  },
  watch: {
    assignedMusic: {
      handler(newVal) {
        if (newVal?.settings) {
          this.settings = { ...this.settings, ...newVal.settings }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    openMusicSelector() {
      this.$emit('openSelector')
    },
    openSettings() {
      if (this.assignedMusic?.settings) {
        this.settings = { ...this.assignedMusic.settings }
      }
      this.showSettings = true
    },
    closeSettings() {
      this.showSettings = false
    },
    saveSettings() {
      const updated = {
        music_id: this.assignedMusic.music_id,
        settings: { ...this.settings }
      }
      this.$emit('update:modelValue', updated)
      this.closeSettings()
    },
    removeMusic() {
      if (confirm('Retirer cette musique ?')) {
        this.$emit('update:modelValue', null)
      }
    },
    formatDuration(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${String(secs).padStart(2, '0')}`
    }
  }
}
</script>

<style scoped>
.music-assignment {
  width: 100%;
}

.empty-zone {
  border: 2px dashed #cbd5e0;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.5);
}

.empty-zone:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.empty-zone i {
  font-size: 2em;
  color: #cbd5e0;
  display: block;
  margin-bottom: 10px;
}

.empty-zone span {
  color: #718096;
  font-size: 0.9em;
}

.assigned-zone {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: rgba(102, 126, 234, 0.1);
  border: 2px solid #667eea;
  border-radius: 8px;
  transition: all 0.2s;
}

.assigned-zone:hover {
  background: rgba(102, 126, 234, 0.15);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.music-info {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.music-info i {
  font-size: 2em;
  color: #667eea;
}

.music-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.music-title {
  font-weight: bold;
  color: #2d3748;
  font-size: 1em;
}

.music-artist {
  color: #718096;
  font-size: 0.9em;
}

.music-duration {
  color: #a0aec0;
  font-size: 0.85em;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: white;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s;
  color: #4a5568;
}

.btn-icon:hover {
  background: #f7fafc;
  border-color: #667eea;
  color: #667eea;
}

.btn-icon.btn-danger:hover {
  border-color: #ef4444;
  color: #ef4444;
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
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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
  color: #2d3748;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2em;
  color: #a0aec0;
  cursor: pointer;
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
}

.setting-group {
  margin-bottom: 20px;
}

.setting-group label {
  display: block;
  margin-bottom: 8px;
  color: #4a5568;
  font-weight: 600;
  font-size: 0.9em;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 1em;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.slider {
  width: 80%;
  margin-right: 10px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #cbd5e0;
}
</style>
