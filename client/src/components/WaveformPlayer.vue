<template>
  <div class="waveform-player">
    <div class="waveform-container">
      <div ref="waveform" class="waveform"></div>

      <!-- Cues markers overlay -->
      <div v-if="cues" class="cues-overlay">
        <div
          v-if="cues.hook"
          class="cue-marker hook"
          :style="{ left: getCuePosition(cues.hook) + '%' }"
          :title="`Hook: ${formatTime(cues.hook)}`"
        >
          <i class="fas fa-fire"></i>
        </div>
        <div
          v-if="cues.climax"
          class="cue-marker climax"
          :style="{ left: getCuePosition(cues.climax) + '%' }"
          :title="`Climax: ${formatTime(cues.climax)}`"
        >
          <i class="fas fa-mountain"></i>
        </div>
        <div
          v-if="cues.outro"
          class="cue-marker outro"
          :style="{ left: getCuePosition(cues.outro) + '%' }"
          :title="`Outro: ${formatTime(cues.outro)}`"
        >
          <i class="fas fa-flag-checkered"></i>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="waveform-controls">
      <button @click="togglePlay" class="btn btn-play">
        <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
      </button>

      <div class="time-display">
        <span>{{ formatTime(currentTime) }}</span>
        <span> / </span>
        <span>{{ formatTime(duration) }}</span>
      </div>

      <div class="cue-buttons">
        <button v-if="cues?.hook" @click="seekToCue('hook')" class="btn btn-small btn-cue">
          <i class="fas fa-fire"></i> Hook
        </button>
        <button v-if="cues?.climax" @click="seekToCue('climax')" class="btn btn-small btn-cue">
          <i class="fas fa-mountain"></i> Climax
        </button>
        <button v-if="cues?.outro" @click="seekToCue('outro')" class="btn btn-small btn-cue">
          <i class="fas fa-flag-checkered"></i> Outro
        </button>
      </div>

      <div class="volume-control">
        <i class="fas fa-volume-down"></i>
        <input
          type="range"
          min="0"
          max="100"
          v-model="volume"
          @input="updateVolume"
          class="volume-slider"
        />
        <i class="fas fa-volume-up"></i>
      </div>
    </div>
  </div>
</template>

<script>
import WaveSurfer from 'wavesurfer.js';

export default {
  name: 'WaveformPlayer',
  props: {
    audioUrl: {
      type: String,
      required: true
    },
    cues: {
      type: Object,
      default: null
      // Format: { start: 0, hook: 30, climax: 60, outro: 170 }
    },
    autoplay: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      wavesurfer: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 80
    };
  },
  mounted() {
    this.initWaveform();
  },
  beforeUnmount() {
    if (this.wavesurfer) {
      this.wavesurfer.destroy();
    }
  },
  watch: {
    audioUrl(newUrl) {
      if (newUrl && this.wavesurfer) {
        this.wavesurfer.load(newUrl);
      }
    }
  },
  methods: {
    initWaveform() {
      this.wavesurfer = WaveSurfer.create({
        container: this.$refs.waveform,
        waveColor: '#667eea',
        progressColor: '#48bb78',
        cursorColor: '#f56565',
        barWidth: 2,
        barRadius: 3,
        cursorWidth: 2,
        height: 100,
        barGap: 2,
        responsive: true,
        normalize: true
      });

      // Load audio
      this.wavesurfer.load(this.audioUrl);

      // Event listeners
      this.wavesurfer.on('ready', () => {
        this.duration = this.wavesurfer.getDuration();
        this.wavesurfer.setVolume(this.volume / 100);

        if (this.autoplay) {
          this.wavesurfer.play();
        }
      });

      this.wavesurfer.on('play', () => {
        this.isPlaying = true;
      });

      this.wavesurfer.on('pause', () => {
        this.isPlaying = false;
      });

      this.wavesurfer.on('audioprocess', () => {
        this.currentTime = this.wavesurfer.getCurrentTime();
      });

      this.wavesurfer.on('seek', () => {
        this.currentTime = this.wavesurfer.getCurrentTime();
      });

      this.wavesurfer.on('finish', () => {
        this.isPlaying = false;
        this.$emit('finished');
      });

      this.wavesurfer.on('error', (error) => {
        console.error('WaveSurfer error:', error);
        this.$emit('error', error);
      });
    },

    togglePlay() {
      if (this.wavesurfer) {
        this.wavesurfer.playPause();
      }
    },

    seekToCue(cueType) {
      if (!this.wavesurfer || !this.cues) return;

      const time = this.cues[cueType];
      if (time !== undefined) {
        const progress = time / this.duration;
        this.wavesurfer.seekTo(progress);

        if (!this.isPlaying) {
          this.wavesurfer.play();
        }
      }
    },

    updateVolume() {
      if (this.wavesurfer) {
        this.wavesurfer.setVolume(this.volume / 100);
      }
    },

    getCuePosition(timeInSeconds) {
      if (!this.duration) return 0;
      return (timeInSeconds / this.duration) * 100;
    },

    formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${String(secs).padStart(2, '0')}`;
    }
  }
};
</script>

<style scoped>
.waveform-player {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.waveform-container {
  position: relative;
  margin-bottom: 15px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
}

.waveform {
  width: 100%;
}

.cues-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.cue-marker {
  position: absolute;
  top: 0;
  width: 3px;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 5px;
  animation: pulse 2s infinite;
}

.cue-marker i {
  font-size: 1.2em;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.cue-marker.hook {
  background: linear-gradient(180deg, rgba(237, 137, 54, 0.6) 0%, transparent 100%);
  color: #ed8936;
}

.cue-marker.climax {
  background: linear-gradient(180deg, rgba(245, 101, 101, 0.6) 0%, transparent 100%);
  color: #f56565;
}

.cue-marker.outro {
  background: linear-gradient(180deg, rgba(72, 187, 120, 0.6) 0%, transparent 100%);
  color: #48bb78;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.waveform-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.btn-play {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #48bb78);
  border: none;
  color: white;
  font-size: 1.3em;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-play:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
}

.btn-play:active {
  transform: scale(0.95);
}

.time-display {
  font-family: 'Courier New', monospace;
  font-size: 1.1em;
  font-weight: 600;
  color: #e2e8f0;
  min-width: 100px;
}

.cue-buttons {
  display: flex;
  gap: 8px;
  flex: 1;
}

.btn-cue {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9em;
}

.btn-cue:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a0aec0;
}

.volume-slider {
  width: 100px;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.volume-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .waveform-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .cue-buttons {
    justify-content: center;
  }

  .volume-control {
    justify-content: center;
  }
}
</style>
