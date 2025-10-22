<template>
  <div class="sound-interface">
    <!-- En-tête avec sélection de match -->
    <div class="sound-header card">
      <h2 class="card-title">
        <i class="fas fa-volume-up"></i>
        Mode Son - Responsable Sonorisation
      </h2>

      <div class="match-selector" style="display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">
        <label class="form-label" style="margin: 0;">Match actuel :</label>
        <select v-model="selectedMatchId" @change="loadMatch" class="form-input" style="width: auto;">
          <option value="">Sélectionner un match...</option>
          <option v-for="match in availableMatches" :key="match.id" :value="match.id">
            {{ match.title }}
          </option>
        </select>

        <button v-if="currentMatch" @click="syncWithMC" class="btn btn-success">
          <i class="fas fa-sync"></i> Sync MC
        </button>
      </div>
    </div>

    <!-- Lecteur audio principal -->
    <div class="audio-player card">
      <h3 class="card-title">
        <i class="fas fa-play"></i>
        Lecteur Principal
      </h3>

      <div v-if="currentTrack" class="current-track">
        <div class="track-info">
          <h4>{{ currentTrack.title }}</h4>
          <p style="color: rgba(255,255,255,0.8); margin: 5px 0;">{{ currentTrack.artist || 'Artiste inconnu' }}</p>
          <div class="track-tags">
            <span v-for="tag in currentTrack.tags.mood" :key="tag" class="tag mood">{{ tag }}</span>
            <span class="tag energy">Énergie: {{ currentTrack.tags.energy }}/10</span>
          </div>
        </div>

        <div class="audio-progress">
          <div class="audio-progress-bar" :style="{ width: progressPercent + '%' }"></div>
        </div>

        <div class="audio-controls">
          <button @click="skipToCue('start')" class="btn btn-small">
            <i class="fas fa-step-backward"></i> Début
          </button>
          <button @click="skipToCue('hook')" class="btn btn-small">
            <i class="fas fa-fire"></i> Hook
          </button>
          <button @click="togglePlay" class="btn">
            <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
            {{ isPlaying ? 'Pause' : 'Play' }}
          </button>
          <button @click="skipToCue('climax')" class="btn btn-small">
            <i class="fas fa-mountain"></i> Climax
          </button>
          <button @click="stop" class="btn btn-danger">
            <i class="fas fa-stop"></i> Stop
          </button>

          <div class="volume-control" style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-volume-down"></i>
            <input
              type="range"
              min="0"
              max="100"
              v-model="volume"
              @input="updateVolume"
              style="width: 100px;"
            >
            <i class="fas fa-volume-up"></i>
          </div>
        </div>

        <div class="playback-info" style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; color: rgba(255,255,255,0.8); font-size: 0.9em;">
          <span>{{ formatTime(currentTime) }} / {{ formatTime(currentTrack.duration) }}</span>
          <div class="mode-selector">
            <label style="margin-right: 10px;">Mode :</label>
            <select v-model="playbackMode" @change="updatePlaybackMode" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 4px 8px; border-radius: 4px;">
              <option value="full">Complet</option>
              <option value="hook">Hook Start</option>
              <option value="short">Version courte</option>
              <option value="loop">Boucle Hook</option>
            </select>
          </div>
        </div>
      </div>

      <div v-else class="no-track" style="text-align: center; padding: 40px; color: rgba(255,255,255,0.6);">
        <i class="fas fa-music" style="font-size: 3em; margin-bottom: 15px; opacity: 0.3;"></i>
        <p>Aucune musique sélectionnée</p>
        <p style="font-size: 0.9em;">Choisissez une musique dans la bibliothèque ci-dessous</p>
      </div>

      <!-- Élément audio HTML5 caché -->
      <audio
        ref="audioPlayer"
        @timeupdate="updateProgress"
        @ended="onTrackEnded"
        @loadedmetadata="onTrackLoaded"
      ></audio>
    </div>

    <!-- Raccourcis rapides -->
    <div class="quick-actions card">
      <h3 class="card-title">
        <i class="fas fa-bolt"></i>
        Lancement Rapide
      </h3>

      <div class="quick-buttons" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px;">
        <button
          v-for="quick in quickLaunchButtons"
          :key="quick.id"
          @click="quickPlay(quick)"
          class="btn"
          :style="{ background: quick.color }"
        >
          <i :class="quick.icon"></i>
          {{ quick.label }}
        </button>
      </div>
    </div>

    <!-- Bibliothèque musicale -->
    <div class="music-library card">
      <div class="library-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 class="card-title" style="margin: 0;">
          <i class="fas fa-folder-open"></i>
          Bibliothèque Musicale
        </h3>

        <div class="library-controls" style="display: flex; gap: 15px; align-items: center;">
          <input
            v-model="searchQuery"
            placeholder="Rechercher musiques..."
            class="form-input"
            style="width: 200px;"
          >

          <select v-model="filterMood" class="form-input" style="width: auto;">
            <option value="">Toutes les ambiances</option>
            <option v-for="mood in availableMoods" :key="mood" :value="mood">{{ mood }}</option>
          </select>

          <select v-model="filterEnergy" class="form-input" style="width: auto;">
            <option value="">Toute énergie</option>
            <option value="1-3">Calme (1-3)</option>
            <option value="4-6">Modéré (4-6)</option>
            <option value="7-10">Énergique (7-10)</option>
          </select>

          <button @click="randomMusic" class="btn btn-secondary">
            <i class="fas fa-random"></i>
          </button>
        </div>
      </div>

      <!-- Liste des musiques -->
      <div class="music-list" style="max-height: 400px; overflow-y: auto;">
        <div
          v-for="music in filteredMusic"
          :key="music.id"
          class="music-item"
          :class="{ active: currentTrack && currentTrack.id === music.id }"
          @click="selectMusic(music)"
          @dragstart="onDragStart($event, music)"
          draggable="true"
        >
          <div class="music-info">
            <div class="music-title">{{ music.title }}</div>
            <div class="music-artist">{{ music.artist || 'Artiste inconnu' }}</div>
            <div class="music-duration">{{ formatTime(music.duration) }}</div>
          </div>

          <div class="music-tags">
            <span v-for="tag in music.tags.mood.slice(0, 2)" :key="tag" class="tag mood">{{ tag }}</span>
            <span class="tag energy">{{ music.tags.energy }}/10</span>
            <span v-if="music.tags.tempo" class="tag">{{ music.tags.tempo }}</span>
          </div>

          <div class="music-actions">
            <button @click.stop="playMusic(music)" class="btn btn-small">
              <i class="fas fa-play"></i>
            </button>
            <button @click.stop="playMusicHook(music)" class="btn btn-small btn-secondary">
              <i class="fas fa-fire"></i> Hook
            </button>
            <button @click.stop="addToFavorites(music)" class="btn btn-small" :class="{ 'btn-warning': music.favorite }">
              <i class="fas fa-star"></i>
            </button>
          </div>

          <!-- Cues visuels -->
          <div class="music-cues" style="margin-top: 8px; display: flex; gap: 5px; font-size: 0.8em;">
            <span class="cue" @click.stop="previewCue(music, 'hook')">
              🎯 Hook {{ formatTime(music.cues.hook) }}
            </span>
            <span class="cue" @click.stop="previewCue(music, 'climax')">
              🔥 Climax {{ formatTime(music.cues.climax) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Zone de drop pour assignment -->
      <div v-if="currentMatch" class="drop-zone" style="margin-top: 20px; padding: 15px; border: 2px dashed #667eea; border-radius: 10px; background: rgba(102, 126, 234, 0.1);">
        <h4 style="margin-bottom: 10px; color: #4a5568;">
          <i class="fas fa-hand-point-right"></i>
          Glisser-déposer vers les improvisations
        </h4>
        <div class="improv-slots" style="display: flex; flex-wrap: wrap; gap: 10px;">
          <div
            v-for="(improv, index) in currentMatch.improvs"
            :key="improv.id"
            class="improv-slot"
            :class="{ 'has-music': improv.music, 'active': improv.status === 'in-progress' }"
            @drop="onDrop($event, index)"
            @dragover.prevent
            @dragenter.prevent
            style="flex: 1; min-width: 200px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px; text-align: center; border: 2px dashed transparent; transition: all 0.3s ease;"
          >
            <div style="font-weight: 600; margin-bottom: 5px;">{{ index + 1 }}. {{ improv.title }}</div>
            <div style="font-size: 0.9em; color: rgba(255,255,255,0.8); margin-bottom: 5px;">{{ formatTime(improv.duration) }}</div>
            <div v-if="improv.music" style="color: #48bb78;">
              <i class="fas fa-music"></i> {{ getMusicTitle(improv.music) }}
              <button @click="removeMusic(index)" class="btn btn-small btn-danger" style="margin-left: 5px;">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div v-else style="color: rgba(255,255,255,0.5);">
              <i class="fas fa-plus"></i> Glissez une musique ici
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Feuille MC (lecture seule) -->
    <div v-if="currentMatch" class="mc-sync card">
      <h3 class="card-title">
        <i class="fas fa-clipboard-list"></i>
        Feuille de Match (Sync MC)
      </h3>

      <div class="match-overview">
        <div class="match-info" style="margin-bottom: 15px;">
          <h4>{{ currentMatch.title }}</h4>
          <div style="display: flex; justify-content: space-between; color: #718096;">
            <span>{{ currentMatch.teamA.name }} ({{ currentMatch.teamA.score }})</span>
            <span>VS</span>
            <span>{{ currentMatch.teamB.name }} ({{ currentMatch.teamB.score }})</span>
          </div>
        </div>

        <div class="improvs-overview">
          <div
            v-for="(improv, index) in currentMatch.improvs"
            :key="improv.id"
            class="improv-overview"
            :class="improv.status"
            style="display: flex; justify-content: space-between; align-items: center; padding: 8px; margin-bottom: 5px; background: rgba(255,255,255,0.1); border-radius: 6px;"
          >
            <div>
              <span style="font-weight: 600;">{{ index + 1 }}. {{ improv.title }}</span>
              <span v-if="improv.theme" style="margin-left: 10px; color: rgba(255,255,255,0.7);">({{ improv.theme }})</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 0.9em;">{{ formatTime(improv.duration) }}</span>
              <span v-if="improv.music" style="color: #48bb78;">
                <i class="fas fa-music"></i> {{ getMusicTitle(improv.music) }}
                <button @click="playImprovMusic(improv)" class="btn btn-small" style="margin-left: 5px;">
                  <i class="fas fa-play"></i>
                </button>
              </span>
              <span v-else style="color: rgba(255,255,255,0.5);">
                <i class="fas fa-music-slash"></i> Pas de musique
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client';

export default {
  name: 'SoundInterface',
  props: ['matchId'],
  data() {
    return {
      socket: null,
      currentMatch: null,
      availableMatches: [],
      selectedMatchId: '',
      musicLibrary: [],
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      volume: 80,
      playbackMode: 'hook',

      // Filtres
      searchQuery: '',
      filterMood: '',
      filterEnergy: '',

      // Drag & Drop
      draggedMusic: null,

      // Quick launch
      quickLaunchButtons: [
        { id: 'applause', label: 'Applause', icon: 'fas fa-hands-clapping', color: '#48bb78' },
        { id: 'gong', label: 'Gong', icon: 'fas fa-bell', color: '#ed8936' },
        { id: 'transition', label: 'Transition', icon: 'fas fa-forward', color: '#667eea' },
        { id: 'suspense', label: 'Suspense', icon: 'fas fa-question', color: '#9f7aea' },
        { id: 'comedy', label: 'Comique', icon: 'fas fa-laugh', color: '#f56565' },
        { id: 'energy', label: 'Énergique', icon: 'fas fa-bolt', color: '#38b2ac' }
      ]
    }
  },
  computed: {
    progressPercent() {
      if (!this.currentTrack || this.currentTrack.duration === 0) return 0;
      return (this.currentTime / this.currentTrack.duration) * 100;
    },

    filteredMusic() {
      let filtered = this.musicLibrary;

      // Recherche textuelle
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(music =>
          music.title.toLowerCase().includes(query) ||
          (music.artist && music.artist.toLowerCase().includes(query)) ||
          music.tags.mood.some(mood => mood.toLowerCase().includes(query)) ||
          music.impro_context.scenarios.some(scenario => scenario.toLowerCase().includes(query))
        );
      }

      // Filtre par ambiance
      if (this.filterMood) {
        filtered = filtered.filter(music =>
          music.tags.mood.includes(this.filterMood)
        );
      }

      // Filtre par énergie
      if (this.filterEnergy) {
        const [min, max] = this.filterEnergy.split('-').map(Number);
        filtered = filtered.filter(music =>
          music.tags.energy >= min && music.tags.energy <= max
        );
      }

      return filtered;
    },

    availableMoods() {
      const moods = new Set();
      this.musicLibrary.forEach(music => {
        music.tags.mood.forEach(mood => moods.add(mood));
      });
      return Array.from(moods).sort();
    }
  },
  async mounted() {
    await this.initializeSocket();
    await this.loadMusicLibrary();
    await this.loadAvailableMatches();

    if (this.matchId) {
      this.selectedMatchId = this.matchId;
      await this.loadMatch();
    }

    // Keyboard shortcuts
    window.addEventListener('keydown', this.handleKeyboard);
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
    window.removeEventListener('keydown', this.handleKeyboard);
  },
  methods: {
    async initializeSocket() {
      this.socket = io(window.location.origin.replace(/^http/, 'ws'));

      this.socket.on('connect', () => {
        console.log('Connecté au serveur en tant que responsable son');
        if (this.currentMatch) {
          this.socket.emit('join-match', this.currentMatch.id);
        }
      });

      this.socket.on('match-updated', (matchData) => {
        if (this.currentMatch && matchData.id === this.currentMatch.id) {
          this.currentMatch = matchData;
        }
      });
    },

    async loadMusicLibrary() {
      try {
        const response = await fetch('/api/music');
        this.musicLibrary = await response.json();
      } catch (error) {
        console.error('Erreur lors du chargement de la bibliothèque musicale:', error);
      }
    },

    async loadAvailableMatches() {
      try {
        const response = await fetch('/api/matches');
        this.availableMatches = await response.json();
      } catch (error) {
        console.error('Erreur lors du chargement des matchs:', error);
      }
    },

    async loadMatch() {
      if (!this.selectedMatchId) {
        this.currentMatch = null;
        return;
      }

      try {
        const response = await fetch(`/api/matches/${this.selectedMatchId}`);
        this.currentMatch = await response.json();

        if (this.socket) {
          this.socket.emit('join-match', this.currentMatch.id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du match:', error);
      }
    },

    async syncWithMC() {
      if (!this.currentMatch) return;

      // Forcer le rechargement des données du match
      await this.loadMatch();
      console.log('Synchronisation avec MC effectuée');
    },

    // Audio player methods
    selectMusic(music) {
      this.currentTrack = music;
      this.loadAudioTrack();
    },

    playMusic(music) {
      this.selectMusic(music);
      this.playbackMode = 'full';
      this.play();
    },

    playMusicHook(music) {
      this.selectMusic(music);
      this.playbackMode = 'hook';
      this.play();
    },

    loadAudioTrack() {
      if (!this.currentTrack) return;

      const audio = this.$refs.audioPlayer;
      // Simuler le chargement - en réalité, il faudrait l'URL du fichier
      audio.src = `/uploads/${this.currentTrack.filename}`;
      audio.volume = this.volume / 100;
    },

    play() {
      if (!this.currentTrack) return;

      const audio = this.$refs.audioPlayer;

      // Positionner selon le mode de lecture
      switch (this.playbackMode) {
        case 'hook':
          audio.currentTime = this.currentTrack.cues.hook;
          break;
        case 'climax':
          audio.currentTime = this.currentTrack.cues.climax;
          break;
        case 'full':
        default:
          audio.currentTime = this.currentTrack.cues.start;
          break;
      }

      audio.play();
      this.isPlaying = true;

      // Notifier les autres interfaces
      if (this.socket && this.currentMatch) {
        this.socket.emit('music-play', {
          matchId: this.currentMatch.id,
          musicId: this.currentTrack.id,
          mode: this.playbackMode
        });
      }
    },

    togglePlay() {
      const audio = this.$refs.audioPlayer;

      if (this.isPlaying) {
        audio.pause();
        this.isPlaying = false;
      } else {
        audio.play();
        this.isPlaying = true;
      }
    },

    stop() {
      const audio = this.$refs.audioPlayer;
      audio.pause();
      audio.currentTime = 0;
      this.isPlaying = false;
      this.currentTime = 0;
    },

    skipToCue(cueType) {
      if (!this.currentTrack) return;

      const audio = this.$refs.audioPlayer;
      const cueTime = this.currentTrack.cues[cueType];

      if (cueTime !== undefined) {
        audio.currentTime = cueTime;
      }
    },

    updateVolume() {
      const audio = this.$refs.audioPlayer;
      audio.volume = this.volume / 100;
    },

    updatePlaybackMode() {
      // Si la musique joue, repositionner selon le nouveau mode
      if (this.isPlaying) {
        this.skipToCue(this.playbackMode === 'hook' ? 'hook' : 'start');
      }
    },

    // Audio events
    updateProgress() {
      const audio = this.$refs.audioPlayer;
      this.currentTime = audio.currentTime;

      // Auto-stop pour version courte
      if (this.playbackMode === 'short' && this.currentTime >= this.currentTrack.cues.outro) {
        this.stop();
      }
    },

    onTrackEnded() {
      this.isPlaying = false;
      this.currentTime = 0;
    },

    onTrackLoaded() {
      // Track chargé avec succès
      console.log('Track loaded:', this.currentTrack.title);
    },

    // Quick actions
    quickPlay(quickAction) {
      // Trouver une musique correspondante dans la bibliothèque
      let targetMusic = null;

      switch (quickAction.id) {
        case 'applause':
          targetMusic = this.musicLibrary.find(m =>
            m.tags.mood.includes('applaudissements') ||
            m.title.toLowerCase().includes('applause')
          );
          break;
        case 'gong':
          targetMusic = this.musicLibrary.find(m =>
            m.title.toLowerCase().includes('gong') ||
            m.tags.mood.includes('transition')
          );
          break;
        case 'energy':
          targetMusic = this.musicLibrary.find(m => m.tags.energy >= 8);
          break;
        case 'comedy':
          targetMusic = this.musicLibrary.find(m =>
            m.tags.mood.includes('comique') ||
            m.tags.mood.includes('joyeux')
          );
          break;
        default:
          targetMusic = this.musicLibrary.find(m =>
            m.tags.mood.includes(quickAction.id)
          );
      }

      if (targetMusic) {
        this.playMusicHook(targetMusic);
      } else {
        console.log(`Aucune musique trouvée pour ${quickAction.label}`);
      }
    },

    randomMusic() {
      if (this.filteredMusic.length === 0) return;

      const randomIndex = Math.floor(Math.random() * this.filteredMusic.length);
      const randomMusic = this.filteredMusic[randomIndex];
      this.playMusicHook(randomMusic);
    },

    // Drag & Drop
    onDragStart(event, music) {
      this.draggedMusic = music;
      event.dataTransfer.effectAllowed = 'move';
    },

    onDrop(event, improvIndex) {
      event.preventDefault();

      if (!this.draggedMusic || !this.currentMatch) return;

      // Assigner la musique à l'improv
      this.currentMatch.improvs[improvIndex].music = this.draggedMusic.id;

      // Sauvegarder le match
      this.saveMatch();

      // Notifier l'interface MC
      if (this.socket) {
        this.socket.emit('music-assigned', {
          matchId: this.currentMatch.id,
          improvId: this.currentMatch.improvs[improvIndex].id,
          musicId: this.draggedMusic.id
        });
      }

      this.draggedMusic = null;
    },

    removeMusic(improvIndex) {
      if (!this.currentMatch) return;

      this.currentMatch.improvs[improvIndex].music = null;
      this.saveMatch();
    },

    async saveMatch() {
      if (!this.currentMatch) return;

      try {
        await fetch(`/api/matches/${this.currentMatch.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentMatch)
        });
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      }
    },

    // Utility methods
    getMusicTitle(musicId) {
      const music = this.musicLibrary.find(m => m.id === musicId);
      return music ? music.title : 'Musique inconnue';
    },

    playImprovMusic(improv) {
      if (!improv.music) return;

      const music = this.musicLibrary.find(m => m.id === improv.music);
      if (music) {
        this.playMusicHook(music);
      }
    },

    previewCue(music, cueType) {
      this.selectMusic(music);
      this.skipToCue(cueType);
      this.play();

      // Auto-stop après 5 secondes pour preview
      setTimeout(() => {
        if (this.isPlaying) {
          this.stop();
        }
      }, 5000);
    },

    addToFavorites(music) {
      music.favorite = !music.favorite;
      // TODO: Persister les favoris
    },

    handleKeyboard(event) {
      // Raccourcis clavier
      if (event.target.tagName === 'INPUT') return;

      switch (event.key) {
        case ' ':
          event.preventDefault();
          this.togglePlay();
          break;
        case 'Escape':
          this.stop();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
          const quickIndex = parseInt(event.key) - 1;
          if (this.quickLaunchButtons[quickIndex]) {
            this.quickPlay(this.quickLaunchButtons[quickIndex]);
          }
          break;
      }
    },

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  }
}
</script>

<style scoped>
.music-item {
  transition: all 0.3s ease;
  cursor: pointer;
}

.music-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.music-item.active {
  border: 2px solid #48bb78;
  background: rgba(72, 187, 120, 0.1);
}

.music-item.dragging {
  opacity: 0.5;
  transform: rotate(3deg);
}

.improv-slot {
  transition: all 0.3s ease;
}

.improv-slot.has-music {
  background: rgba(72, 187, 120, 0.2) !important;
  border-color: #48bb78 !important;
}

.improv-slot.active {
  border-color: #ed8936 !important;
  background: rgba(237, 137, 54, 0.1) !important;
}

.improv-slot:hover {
  border-color: #667eea !important;
  background: rgba(102, 126, 234, 0.1) !important;
}

.cue {
  cursor: pointer;
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  transition: background 0.2s ease;
}

.cue:hover {
  background: rgba(255, 255, 255, 0.2);
}

.improv-overview.in-progress {
  background: rgba(72, 187, 120, 0.2) !important;
  border-left: 3px solid #48bb78;
}

.improv-overview.completed {
  opacity: 0.6;
}

.quick-buttons .btn {
  transition: all 0.3s ease;
}

.quick-buttons .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
</style>