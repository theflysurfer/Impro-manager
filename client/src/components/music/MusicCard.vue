<template>
  <div class="music-card" @click="$emit('select', track)">
    <div class="music-card-header">
      <div class="music-icon">
        <i class="fas fa-music"></i>
      </div>
      <div class="music-info">
        <h3 class="music-title">{{ track.title || track.filename }}</h3>
        <p class="music-artist" v-if="track.artist">{{ track.artist }}</p>
      </div>
    </div>

    <div class="music-meta">
      <span class="meta-item">
        <i class="fas fa-clock"></i>
        {{ formatDuration(track.duration) }}
      </span>
      <span class="meta-item" v-if="track.tags?.energy">
        <i class="fas fa-bolt"></i>
        {{ track.tags.energy }}/10
      </span>
      <span class="meta-item" v-if="track.tags?.tempo">
        <i class="fas fa-tachometer-alt"></i>
        {{ track.tags.tempo }}
      </span>
    </div>

    <div class="music-tags" v-if="track.tags?.genre?.length > 0 || track.impro_context?.scenarios?.length > 0">
      <span class="tag tag-genre" v-for="genre in track.tags.genre" :key="genre">
        {{ genre }}
      </span>
      <span class="tag tag-scenario" v-for="scenario in track.impro_context.scenarios?.slice(0, 2)" :key="scenario">
        {{ scenario }}
      </span>
    </div>

    <div class="music-actions">
      <button class="btn-icon" @click.stop="$emit('play', track)" title="Écouter">
        <i class="fas fa-play"></i>
      </button>
      <button class="btn-icon" @click.stop="$emit('assign', track)" title="Assigner">
        <i class="fas fa-plus"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MusicCard',
  props: {
    track: {
      type: Object,
      required: true
    }
  },
  emits: ['select', 'play', 'assign'],
  methods: {
    formatDuration(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  }
}
</script>

<style scoped>
.music-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.music-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #4299e1;
  transform: translateY(-2px);
}

.music-card-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.music-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  flex-shrink: 0;
}

.music-info {
  flex: 1;
  min-width: 0;
}

.music-title {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.music-artist {
  font-size: 12px;
  color: #718096;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.music-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 11px;
  color: #718096;
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-item i {
  font-size: 10px;
}

.music-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.tag {
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.tag-genre {
  background: #e6fffa;
  color: #047857;
}

.tag-scenario {
  background: #fef3c7;
  color: #92400e;
}

.music-actions {
  display: flex;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #f7fafc;
}

.btn-icon {
  flex: 1;
  padding: 8px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  color: #4a5568;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #4299e1;
  border-color: #4299e1;
  color: white;
}

.btn-icon i {
  pointer-events: none;
}
</style>
