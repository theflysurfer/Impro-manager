<template>
  <div class="audio-player" :class="{ 'player-active': currentTrack }">
    <div class="player-info">
      <div class="player-icon">
        <i class="fas fa-music"></i>
      </div>
      <div class="player-details" v-if="currentTrack">
        <h4 class="player-title">{{ currentTrack.title || currentTrack.filename }}</h4>
        <p class="player-artist">{{ currentTrack.artist || 'Artiste inconnu' }}</p>
      </div>
      <div class="player-details" v-else>
        <h4 class="player-title">Aucune musique</h4>
        <p class="player-artist">Sélectionnez une piste pour commencer</p>
      </div>
    </div>

    <div class="player-controls">
      <button class="btn-control" @click="playPause" :disabled="!currentTrack">
        <i class="fas" :class="isPlaying ? 'fa-pause' : 'fa-play'"></i>
      </button>
      <button class="btn-control" @click="stop" :disabled="!currentTrack">
        <i class="fas fa-stop"></i>
      </button>
      <button class="btn-control" @click="skipToClip" :disabled="!currentTrack || !currentTrack.cues?.climax" title="Aller au climax">
        <i class="fas fa-forward"></i>
      </button>
    </div>

    <div class="player-progress">
      <span class="time-display">{{ formatTime(currentTime) }}</span>
      <div class="progress-bar" @click="seek">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <span class="time-display">{{ formatTime(duration) }}</span>
    </div>

    <div class="player-volume">
      <i class="fas fa-volume-up"></i>
      <input
        type="range"
        min="0"
        max="100"
        v-model.number="volume"
        @input="updateVolume"
        class="volume-slider"
      />
      <span class="volume-display">{{ volume }}%</span>
    </div>

    <audio
      ref="audioElement"
      @timeupdate="updateTime"
      @loadedmetadata="onMetadataLoaded"
      @ended="onEnded"
      @play="isPlaying = true"
      @pause="isPlaying = false"
    ></audio>
  </div>
</template>

<script>
export default {
  name: 'AudioPlayer',
  props: {
    track: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 80
    }
  },
  computed: {
    progressPercent() {
      return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
    }
  },
  methods: {
    async loadTrack(track) {
      if (!track) return;

      this.currentTrack = track;
      const audio = this.$refs.audioElement;

      // Construct the URL for the audio file
      const audioUrl = `http://localhost:3001${track.web_url}`;
      audio.src = audioUrl;

      try {
        await audio.load();
      } catch (error) {
        console.error('Error loading track:', error);
      }
    },
    playPause() {
      const audio = this.$refs.audioElement;
      if (this.isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(err => {
          console.error('Error playing audio:', err);
        });
      }
    },
    stop() {
      const audio = this.$refs.audioElement;
      audio.pause();
      audio.currentTime = 0;
    },
    skipToClip() {
      if (this.currentTrack?.cues?.climax) {
        this.$refs.audioElement.currentTime = this.currentTrack.cues.climax;
      }
    },
    seek(event) {
      const progressBar = event.currentTarget;
      const clickX = event.offsetX;
      const width = progressBar.offsetWidth;
      const percent = clickX / width;
      this.$refs.audioElement.currentTime = this.duration * percent;
    },
    updateTime() {
      this.currentTime = this.$refs.audioElement.currentTime;
    },
    onMetadataLoaded() {
      this.duration = this.$refs.audioElement.duration;
    },
    onEnded() {
      this.isPlaying = false;
      this.$emit('ended');
    },
    updateVolume() {
      this.$refs.audioElement.volume = this.volume / 100;
    },
    formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  },
  watch: {
    track(newTrack) {
      if (newTrack) {
        this.loadTrack(newTrack);
      }
    }
  },
  mounted() {
    this.updateVolume();
  }
}
</script>

<style scoped>
.audio-player {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  position: sticky;
  bottom: 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.player-active {
  border-color: #4299e1;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.player-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.player-details {
  flex: 1;
  min-width: 0;
}

.player-title {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.player-artist {
  font-size: 12px;
  color: #718096;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.player-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
}

.btn-control {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: #4299e1;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-control:hover:not(:disabled) {
  background: #3182ce;
  transform: scale(1.05);
}

.btn-control:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.player-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.time-display {
  font-size: 11px;
  color: #718096;
  min-width: 40px;
  text-align: center;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.1s linear;
}

.player-volume {
  display: flex;
  align-items: center;
  gap: 8px;
}

.player-volume i {
  color: #718096;
  font-size: 14px;
}

.volume-slider {
  flex: 1;
  cursor: pointer;
}

.volume-display {
  font-size: 11px;
  color: #718096;
  min-width: 35px;
  text-align: right;
}
</style>
