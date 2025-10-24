<template>
  <div class="music-point-assignment" :class="`point-${point.toLowerCase()}`">
    <div class="point-header">
      <h3 class="point-title">
        <span class="point-icon">{{ pointIcon }}</span>
        {{ pointLabel }}
      </h3>
    </div>

    <div v-if="assignedTrack" class="assigned-track">
      <div class="track-info">
        <p class="track-title">{{ assignedTrack.title }}</p>
        <p class="track-artist">{{ assignedTrack.artist }}</p>
        <p class="track-duration">{{ formatDuration(assignedTrack.duration) }}</p>
      </div>

      <div class="track-settings">
        <div class="setting-group">
          <label>Clip (secondes)</label>
          <div class="clip-inputs">
            <input
              type="number"
              v-model.number="localSettings.clip.start"
              @change="emitUpdate"
              min="0"
              :max="assignedTrack.duration"
              placeholder="Début"
              :data-testid="`${point.toLowerCase()}-clip-start`"
            />
            <span>→</span>
            <input
              type="number"
              v-model.number="localSettings.clip.end"
              @change="emitUpdate"
              :min="localSettings.clip.start"
              :max="assignedTrack.duration"
              placeholder="Fin (auto)"
              :data-testid="`${point.toLowerCase()}-clip-end`"
            />
          </div>
        </div>

        <div class="setting-group">
          <label>Fade (secondes)</label>
          <div class="fade-inputs">
            <input
              type="number"
              v-model.number="localSettings.fade.in"
              @change="emitUpdate"
              min="0"
              max="10"
              step="0.5"
              placeholder="In"
            />
            <span>→</span>
            <input
              type="number"
              v-model.number="localSettings.fade.out"
              @change="emitUpdate"
              min="0"
              max="10"
              step="0.5"
              placeholder="Out"
            />
          </div>
        </div>

        <div class="setting-group">
          <label>Volume: {{ Math.round(localSettings.volume * 100) }}%</label>
          <input
            type="range"
            v-model.number="localSettings.volume"
            @change="emitUpdate"
            min="0"
            max="1"
            step="0.1"
            class="volume-slider"
          />
        </div>
      </div>

      <div class="track-actions">
        <button @click="$emit('remove', point)" class="btn btn-danger btn-sm">
          🗑️ Retirer
        </button>
      </div>
    </div>

    <div v-else class="no-track">
      <p>Aucune musique assignée</p>
      <button
        @click="$emit('assign', point)"
        class="btn btn-primary"
        :data-testid="`assign-${point.toLowerCase()}`"
      >
        🎵 Assigner musique
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  point: {
    type: String,
    required: true,
    validator: (value) => ['INTRO', 'OUTRO', 'TRANSITION'].includes(value)
  },
  trackId: {
    type: String,
    default: null
  },
  settings: {
    type: Object,
    default: () => ({
      clip: { start: 0, end: null },
      fade: { in: 2, out: 2 },
      volume: 0.8
    })
  },
  musicLibrary: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['assign', 'remove', 'update-settings'])

// Local settings state
const localSettings = ref({
  clip: {
    start: props.settings?.clip?.start ?? 0,
    end: props.settings?.clip?.end ?? null
  },
  fade: {
    in: props.settings?.fade?.in ?? 2,
    out: props.settings?.fade?.out ?? 2
  },
  volume: props.settings?.volume ?? 0.8
})

// Watch for external settings changes
watch(() => props.settings, (newSettings) => {
  if (newSettings) {
    localSettings.value = {
      clip: {
        start: newSettings.clip?.start ?? 0,
        end: newSettings.clip?.end ?? null
      },
      fade: {
        in: newSettings.fade?.in ?? 2,
        out: newSettings.fade?.out ?? 2
      },
      volume: newSettings.volume ?? 0.8
    }
  }
}, { deep: true })

const assignedTrack = computed(() => {
  if (!props.trackId) return null
  return props.musicLibrary.find(t => t.id === props.trackId) || null
})

const pointIcon = computed(() => {
  switch (props.point) {
    case 'INTRO': return '▶️'
    case 'OUTRO': return '⏹️'
    case 'TRANSITION': return '🔄'
    default: return '🎵'
  }
})

const pointLabel = computed(() => {
  switch (props.point) {
    case 'INTRO': return 'Intro (Début de ligne)'
    case 'OUTRO': return 'Outro (Fin de ligne)'
    case 'TRANSITION': return 'Transition (Inter-ligne)'
    default: return props.point
  }
})

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function emitUpdate() {
  emit('update-settings', props.point, localSettings.value)
}
</script>

<style scoped>
.music-point-assignment {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid var(--point-color, #667eea);
}

.point-intro {
  --point-color: #10b981;
}

.point-outro {
  --point-color: #ef4444;
}

.point-transition {
  --point-color: #f59e0b;
}

.point-header {
  margin-bottom: 15px;
}

.point-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 1.2em;
  color: var(--point-color);
}

.point-icon {
  font-size: 1.5em;
}

.assigned-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 15px;
}

.track-info {
  margin-bottom: 15px;
}

.track-title {
  font-size: 1.1em;
  font-weight: bold;
  margin: 0 0 5px 0;
  color: white;
}

.track-artist {
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 5px 0;
}

.track-duration {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9em;
  margin: 0;
}

.track-settings {
  display: grid;
  gap: 15px;
  margin-bottom: 15px;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-group label {
  font-size: 0.9em;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
}

.clip-inputs,
.fade-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.clip-inputs input,
.fade-inputs input {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 14px;
}

.clip-inputs span,
.fade-inputs span {
  color: rgba(255, 255, 255, 0.5);
}

.volume-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--point-color);
  cursor: pointer;
}

.track-actions {
  display: flex;
  justify-content: flex-end;
}

.no-track {
  text-align: center;
  padding: 30px;
}

.no-track p {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 15px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--point-color);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .music-point-assignment {
    padding: 15px;
  }

  .clip-inputs,
  .fade-inputs {
    flex-direction: column;
    align-items: stretch;
  }

  .clip-inputs span,
  .fade-inputs span {
    display: none;
  }
}
</style>
