<template>
  <div class="mc-interface">
    <!-- En-tête avec création/sélection de match -->
    <div class="match-selector card">
      <h2 class="card-title">
        <i class="fas fa-clipboard-list"></i>
        Mode MC - Maître de Cérémonie
      </h2>

      <div class="match-controls" style="display: flex; gap: 15px; flex-wrap: wrap; align-items: center;">
        <select v-model="selectedMatchId" @change="loadMatch()" class="form-input" style="width: auto; min-width: 250px;">
          <option value="">Sélectionner un match...</option>
          <option v-for="match in availableMatches" :key="match.match_id || match.id" :value="match.match_id || match.id">
            {{ match.title }} - {{ formatDate(match.date) }}
          </option>
        </select>

        <button @click="showNewMatchModal = true" class="btn">
          <i class="fas fa-plus"></i> Nouveau Match
        </button>

        <select v-model="selectedTemplate" class="form-input" style="width: auto;">
          <option value="">Choisir un template...</option>
          <option v-for="template in templates" :key="template.id" :value="template.id">
            {{ template.name }}
          </option>
        </select>

        <button v-if="currentMatch" @click="saveMatch" class="btn btn-success">
          <i class="fas fa-save"></i> Sauvegarder
        </button>

        <button v-if="currentMatch" @click="goToLiveMode" class="btn btn-primary" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); border: none;">
          <i class="fas fa-circle" style="color: #fff; animation: pulse 2s infinite;"></i> Passer en Mode Live
        </button>
      </div>
    </div>

    <!-- Feuille de match active -->
    <div v-if="currentMatch" class="match-sheet">
      <!-- Informations du match -->
      <div class="match-info card">
        <div class="match-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
          <div>
            <h3 style="color: #2d3748; margin-bottom: 5px;">{{ currentMatch.title }}</h3>
            <p style="color: #718096; margin: 0;">{{ formatDate(currentMatch.date) }}</p>
          </div>

          <div class="score-board" style="display: flex; gap: 20px; align-items: center;">
            <div class="team">
              <label class="form-label">Équipe A</label>
              <input v-model="currentMatch.teamA.name" class="form-input" style="margin-bottom: 5px;">
              <input v-model.number="currentMatch.teamA.score" type="number" min="0" class="form-input" style="width: 80px;">
            </div>
            <div class="vs" style="font-size: 1.5em; font-weight: bold; color: #718096;">VS</div>
            <div class="team">
              <label class="form-label">Équipe B</label>
              <input v-model="currentMatch.teamB.name" class="form-input" style="margin-bottom: 5px;">
              <input v-model.number="currentMatch.teamB.score" type="number" min="0" class="form-input" style="width: 80px;">
            </div>
          </div>
        </div>
      </div>

      <!-- Timer général -->
      <div class="timer-section card">
        <div class="timer" :class="timerClass">
          {{ formatTime(currentTime) }}
        </div>

        <div class="timer-controls" style="text-align: center;">
          <button @click="startTimer" :disabled="isTimerRunning" class="btn">
            <i class="fas fa-play"></i> Démarrer
          </button>
          <button @click="pauseTimer" :disabled="!isTimerRunning" class="btn btn-secondary">
            <i class="fas fa-pause"></i> Pause
          </button>
          <button @click="resetTimer" class="btn btn-danger">
            <i class="fas fa-stop"></i> Reset
          </button>
        </div>
      </div>

      <!-- Liste des improvisations -->
      <div class="improvs-section card">
        <div class="card-title">
          <i class="fas fa-list"></i>
          Improvisations
          <button @click="addImprov" class="btn btn-small" style="margin-left: auto;">
            <i class="fas fa-plus"></i> Ajouter
          </button>
        </div>

        <div class="improv-list">
          <div
            v-for="(improv, index) in currentMatch.improvs"
            :key="improv.id"
            class="improv-item"
            :class="improv.status"
          >
            <div class="improv-header">
              <div class="improv-info">
                <span class="improv-title">
                  {{ index + 1 }}. {{ improv.title }}
                </span>
                <span class="improv-duration">{{ formatDuration(improv.duration) }}</span>
              </div>

              <div class="improv-actions">
                <button
                  @click="setActiveImprov(index)"
                  :disabled="improv.status === 'completed'"
                  class="btn btn-small"
                  :class="improv.status === 'in-progress' ? 'btn-success' : ''"
                >
                  <i :class="getImprovIcon(improv.status)"></i>
                  {{ getImprovButtonText(improv.status) }}
                </button>
              </div>
            </div>

            <!-- Thème de l'improv -->
            <div class="improv-details">
              <div class="form-group">
                <label class="form-label">Thème/Contrainte :</label>
                <input v-model="improv.theme" class="form-input" placeholder="Entrez le thème ou la contrainte...">
              </div>

              <!-- Musique assignée -->
              <div class="improv-music">
                <i class="fas fa-music"></i>
                <span v-if="improv.music">
                  {{ getMusicTitle(improv.music) }}
                  <button @click="previewMusic(improv.music)" class="btn btn-small">
                    <i class="fas fa-play"></i>
                  </button>
                  <button @click="improv.music = null" class="btn btn-small btn-danger">
                    <i class="fas fa-times"></i>
                  </button>
                </span>
                <span v-else style="color: #718096;">
                  Musique non assignée
                  <button @click="openMusicSelector(index)" class="btn btn-small">
                    <i class="fas fa-music"></i> Choisir
                  </button>
                </span>
              </div>

              <!-- Suggestions musicales -->
              <div v-if="!improv.music && improv.theme" class="music-suggestions">
                <span style="color: #718096; font-size: 0.9em;">
                  <i class="fas fa-lightbulb"></i> Suggestions :
                </span>
                <div class="suggestions-list" style="margin-top: 5px; display: flex; gap: 10px; flex-wrap: wrap;">
                  <button
                    v-for="suggestion in getMusicSuggestions(improv.theme)"
                    :key="suggestion.id"
                    @click="assignMusic(index, suggestion.id)"
                    class="btn btn-small btn-secondary"
                    style="font-size: 0.8em;"
                  >
                    {{ suggestion.title }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal nouveau match -->
    <div v-if="showNewMatchModal" class="modal-overlay" @click="showNewMatchModal = false">
      <div class="modal" @click.stop>
        <h3 style="margin-bottom: 20px;">
          <i class="fas fa-plus"></i> Nouveau Match
        </h3>

        <div class="form-group">
          <label class="form-label">Titre du match :</label>
          <input v-model="newMatch.title" class="form-input" placeholder="Ex: Match vs Les Fous du Rire">
        </div>

        <div class="form-group">
          <label class="form-label">Équipe adverse :</label>
          <input v-model="newMatch.teamB" class="form-input" placeholder="Nom de l'équipe adverse">
        </div>

        <div class="form-group">
          <label class="form-label">Template :</label>
          <select v-model="newMatch.template" class="form-input">
            <option value="">Match vide</option>
            <option v-for="template in templates" :key="template.id" :value="template.id">
              {{ template.name }}
            </option>
          </select>
        </div>

        <div class="modal-actions">
          <button @click="createMatch" class="btn btn-success">
            <i class="fas fa-check"></i> Créer
          </button>
          <button @click="showNewMatchModal = false" class="btn btn-secondary">
            Annuler
          </button>
        </div>
      </div>
    </div>

    <!-- Audio Player (caché) pour preview -->
    <audio ref="audioPlayer"></audio>
  </div>
</template>

<script>
import { io } from 'socket.io-client';

export default {
  name: 'MCInterface',
  props: ['matchId'],
  data() {
    return {
      socket: null,
      currentMatch: null,
      availableMatches: [],
      selectedMatchId: '',
      templates: [],
      musicLibrary: [],
      selectedTemplate: '',
      showNewMatchModal: false,
      newMatch: {
        title: '',
        teamB: '',
        template: ''
      },
      // Timer
      currentTime: 0,
      targetTime: 0,
      isTimerRunning: false,
      timerInterval: null,
      activeImprovIndex: -1
    }
  },
  computed: {
    timerClass() {
      if (!this.isTimerRunning) return '';

      const remaining = this.targetTime - this.currentTime;
      if (remaining <= 10) return 'danger';
      if (remaining <= 30) return 'warning';
      return 'running';
    }
  },
  watch: {
    // Adapt backend schema to frontend expectations
    currentMatch: {
      handler(newMatch) {
        if (!newMatch) return;

        // Add compatibility fields if using new backend schema
        if (newMatch.lines && !newMatch.improvs) {
          newMatch.improvs = newMatch.lines.map(line => ({
            id: line.line_id,
            title: line.title,
            duration: line.duration_planned,
            theme: line.theme,
            status: line.status,
            music: line.music,
            type: line.category
          }));
        }

        if (newMatch.teams && !newMatch.teamA) {
          newMatch.teamA = newMatch.teams.home || { name: 'Équipe A', score: 0 };
          newMatch.teamB = newMatch.teams.away || { name: 'Équipe B', score: 0 };
        }

        if (newMatch.match_id && !newMatch.id) {
          newMatch.id = newMatch.match_id;
        }
      },
      immediate: true,
      deep: false
    }
  },
  async mounted() {
    await this.initializeSocket();
    await this.loadTemplates();
    await this.loadMusicLibrary();
    await this.loadAvailableMatches();

    if (this.matchId) {
      await this.loadMatch(this.matchId);
      this.selectedMatchId = this.matchId;
    }
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.clearTimer();

    // Arrêter l'audio preview
    if (this.$refs.audioPlayer) {
      this.$refs.audioPlayer.pause();
      this.$refs.audioPlayer.src = '';
    }
  },
  methods: {
    async initializeSocket() {
      this.socket = io(window.location.origin.replace(/^http/, 'ws'));

      this.socket.on('connect', () => {
        console.log('Connecté au serveur en tant que MC');
        if (this.currentMatch) {
          this.socket.emit('join-match', this.currentMatch.id);
        }
      });

      this.socket.on('music-assigned', (data) => {
        if (this.currentMatch && data.matchId === this.currentMatch.id) {
          const improv = this.currentMatch.improvs.find(i => i.id === data.improvId);
          if (improv) {
            improv.music = data.musicId;
          }
        }
      });
    },

    async loadTemplates() {
      try {
        const response = await fetch('/api/templates');
        const data = await response.json();
        this.templates = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Erreur lors du chargement des templates:', error);
        this.templates = [];
      }
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

    async loadMatch(matchId = null) {
      try {
        // Si pas de matchId fourni, utiliser le selectedMatchId
        const idToLoad = matchId || this.selectedMatchId;
        if (!idToLoad) return;

        const response = await fetch(`/api/matches/${idToLoad}`);
        this.currentMatch = await response.json();
        this.selectedMatchId = idToLoad;

        if (this.socket) {
          this.socket.emit('join-match', this.currentMatch.id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du match:', error);
      }
    },

    async createMatch() {
      if (!this.newMatch.title || !this.newMatch.teamB) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }

      const template = Array.isArray(this.templates) ? this.templates.find(t => t.id === this.newMatch.template) : null;

      const matchData = {
        title: this.newMatch.title,
        teamA: { name: 'Notre Troupe', score: 0 },
        teamB: { name: this.newMatch.teamB, score: 0 },
        improvs: template ? template.improvs.map((improv, index) => ({
          id: `improv-${Date.now()}-${index}`,
          title: improv.title,
          duration: improv.duration,
          type: improv.type,
          status: 'pending',
          music: null,
          theme: ''
        })) : [],
        status: 'active'
      };

      try {
        const response = await fetch('/api/matches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(matchData)
        });

        this.currentMatch = await response.json();
        this.selectedMatchId = this.currentMatch.id || this.currentMatch.match_id;
        this.showNewMatchModal = false;
        this.newMatch = { title: '', teamB: '', template: '' };

        // Recharger la liste des matchs disponibles
        await this.loadAvailableMatches();

        // Naviguer vers le nouveau match
        this.$router.push(`/mc/${this.currentMatch.id}`);

        if (this.socket) {
          this.socket.emit('join-match', this.currentMatch.id);
        }
      } catch (error) {
        console.error('Erreur lors de la création du match:', error);
        alert('Erreur lors de la création du match');
      }
    },

    async saveMatch() {
      if (!this.currentMatch) return;

      try {
        await fetch(`/api/matches/${this.currentMatch.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentMatch)
        });

        console.log('Match sauvegardé');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      }
    },

    addImprov() {
      if (!this.currentMatch) return;

      const newImprov = {
        id: `improv-${Date.now()}`,
        title: `Improv ${this.currentMatch.improvs.length + 1}`,
        duration: 120,
        status: 'pending',
        music: null,
        theme: ''
      };

      this.currentMatch.improvs.push(newImprov);
    },

    setActiveImprov(index) {
      const improv = this.currentMatch.improvs[index];

      if (improv.status === 'completed') return;

      // Marquer les précédentes comme terminées
      for (let i = 0; i < index; i++) {
        this.currentMatch.improvs[i].status = 'completed';
      }

      // Marquer les suivantes comme en attente
      for (let i = index + 1; i < this.currentMatch.improvs.length; i++) {
        this.currentMatch.improvs[i].status = 'pending';
      }

      // Activer l'improv courante
      improv.status = 'in-progress';
      this.activeImprovIndex = index;

      // Configurer le timer
      this.targetTime = improv.duration;
      this.currentTime = 0;
      this.resetTimer();
    },

    // Timer methods
    startTimer() {
      if (this.isTimerRunning) return;

      this.isTimerRunning = true;
      this.timerInterval = setInterval(() => {
        this.currentTime++;

        if (this.currentTime >= this.targetTime) {
          this.pauseTimer();
          // Optionnel: passer automatiquement à l'improv suivante
        }
      }, 1000);
    },

    pauseTimer() {
      this.isTimerRunning = false;
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },

    resetTimer() {
      this.pauseTimer();
      this.currentTime = 0;
    },

    clearTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },

    // Music methods
    getMusicTitle(musicId) {
      const music = this.musicLibrary.find(m => m.id === musicId);
      return music ? music.title : 'Musique inconnue';
    },

    getMusicSuggestions(theme) {
      if (!theme) return [];

      const keywords = theme.toLowerCase().split(' ');

      return this.musicLibrary.filter(music => {
        return keywords.some(keyword =>
          music.impro_context.scenarios.some(scenario =>
            scenario.toLowerCase().includes(keyword)
          ) ||
          music.impro_context.emotions.some(emotion =>
            emotion.toLowerCase().includes(keyword)
          ) ||
          music.tags.mood.some(mood =>
            mood.toLowerCase().includes(keyword)
          )
        );
      }).slice(0, 3);
    },

    assignMusic(improvIndex, musicId) {
      this.currentMatch.improvs[improvIndex].music = musicId;

      // Notifier l'interface son
      if (this.socket) {
        this.socket.emit('music-assigned', {
          matchId: this.currentMatch.id,
          improvId: this.currentMatch.improvs[improvIndex].id,
          musicId: musicId
        });
      }
    },

    previewMusic(musicId) {
      if (!this.$refs.audioPlayer) return;

      const audio = this.$refs.audioPlayer;

      // Si déjà en lecture, arrêter
      if (!audio.paused && audio.src.includes(musicId)) {
        audio.pause();
        audio.currentTime = 0;
        return;
      }

      // Charger et jouer la nouvelle musique
      audio.src = `/api/music/${musicId}/file`;
      audio.volume = 0.5; // Volume à 50% pour preview
      audio.play().catch(err => {
        console.error('Erreur lecture audio:', err);
        alert('Impossible de lire la musique. Vérifiez que le fichier existe.');
      });
    },

    openMusicSelector(improvIndex) {
      // TODO: Ouvrir un modal de sélection musicale
      console.log('Open music selector for improv:', improvIndex);
    },

    goToLiveMode() {
      // Vérifier que le match est sauvegardé
      if (!this.currentMatch || !this.currentMatch.id) {
        alert('Veuillez d\'abord sauvegarder le match avant de passer en mode live.');
        return;
      }

      // Naviguer vers la page Mode Live MC
      const matchId = this.currentMatch.match_id || this.currentMatch.id;
      window.location.href = `/mc/${matchId}/live`;
    },

    // Utility methods
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    formatDuration(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    getImprovIcon(status) {
      const icons = {
        'pending': 'fas fa-circle',
        'in-progress': 'fas fa-play',
        'completed': 'fas fa-check'
      };
      return icons[status] || 'fas fa-circle';
    },

    getImprovButtonText(status) {
      const texts = {
        'pending': 'Démarrer',
        'in-progress': 'En cours',
        'completed': 'Terminé'
      };
      return texts[status] || 'Démarrer';
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 15px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
}

.score-board .team {
  text-align: center;
}

.suggestions-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.timer.running {
  border-color: #48bb78;
  color: #276749;
}

.timer.warning {
  border-color: #ed8936;
  color: #c05621;
  animation: pulse 1s infinite;
}

.timer.danger {
  border-color: #f56565;
  color: #c53030;
  animation: pulse 0.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>