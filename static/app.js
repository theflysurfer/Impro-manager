const { createApp, ref, computed, onMounted, onBeforeUnmount } = Vue;
const { createRouter, createWebHistory } = VueRouter;

// Home Component
const Home = {
  template: `
    <div class="home">
      <div class="hero card">
        <h2 class="card-title">
          <i class="fas fa-star"></i>
          Bienvenue dans Impro Manager
        </h2>
        <p style="margin-bottom: 20px; line-height: 1.6;">
          L'application complète pour gérer vos matchs d'improvisation théâtrale.
          Créez vos feuilles de match, gérez votre bibliothèque musicale et
          synchronisez le tout en temps réel !
        </p>

        <div class="features" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div class="feature">
            <h4><i class="fas fa-clipboard-list text-success"></i> Mode MC</h4>
            <p>Créez et gérez vos feuilles de match, suivez le timing des improvisations et coordonnez avec l'équipe son.</p>
          </div>
          <div class="feature">
            <h4><i class="fas fa-music text-warning"></i> Mode Son</h4>
            <p>Gérez votre bibliothèque musicale, assignez les musiques aux improvisations et contrôlez la lecture.</p>
          </div>
          <div class="feature">
            <h4><i class="fas fa-sync text-danger"></i> Synchronisation</h4>
            <p>Les interfaces MC et Son se synchronisent en temps réel pour une coordination parfaite pendant les matchs.</p>
          </div>
        </div>

        <div class="quick-actions" style="display: flex; gap: 15px; flex-wrap: wrap; justify-content: center;">
          <router-link to="/mc" class="btn btn-success">
            <i class="fas fa-play"></i>
            Commencer un nouveau match
          </router-link>
          <router-link to="/sound" class="btn btn-secondary">
            <i class="fas fa-music"></i>
            Gérer la bibliothèque musicale
          </router-link>
        </div>
      </div>

      <div class="recent-matches card">
        <h3 class="card-title">
          <i class="fas fa-history"></i>
          Matchs récents
        </h3>

        <div v-if="matches.length === 0" class="empty-state" style="text-align: center; padding: 40px; color: #718096;">
          <i class="fas fa-theater-masks" style="font-size: 3em; margin-bottom: 15px; opacity: 0.3;"></i>
          <p>Aucun match créé pour le moment.</p>
          <p style="font-size: 0.9em;">Créez votre premier match pour commencer !</p>
        </div>

        <div v-else class="matches-list">
          <div v-for="match in matches" :key="match.id" class="match-item" style="background: rgba(255,255,255,0.7); padding: 15px; border-radius: 10px; margin-bottom: 10px;">
            <div class="match-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h4 style="color: #2d3748;">{{ match.title }}</h4>
              <span :class="getStatusClass(match.status)" style="padding: 4px 8px; border-radius: 12px; font-size: 0.8em;">
                {{ getStatusText(match.status) }}
              </span>
            </div>

            <div class="match-info" style="display: flex; justify-content: space-between; align-items: center; color: #718096; font-size: 0.9em;">
              <span>{{ match.teamA.name }} vs {{ match.teamB.name }}</span>
              <span>{{ formatDate(match.date) }}</span>
            </div>

            <div style="margin-top: 15px; display: flex; gap: 10px;">
              <router-link :to="'/mc/' + match.id" class="btn btn-small">
                <i class="fas fa-edit"></i> Gérer (MC)
              </router-link>
              <router-link :to="'/sound/' + match.id" class="btn btn-small btn-secondary">
                <i class="fas fa-volume-up"></i> Son
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const matches = ref([]);

    const loadMatches = async () => {
      try {
        const response = await fetch('/api/matches');
        matches.value = await response.json();
      } catch (error) {
        console.error('Erreur lors du chargement des matchs:', error);
      }
    };

    const getStatusClass = (status) => {
      const classes = {
        'active': 'bg-success text-white',
        'completed': 'bg-secondary text-white',
        'draft': 'bg-warning text-white'
      };
      return classes[status] || 'bg-secondary text-white';
    };

    const getStatusText = (status) => {
      const texts = {
        'active': 'En cours',
        'completed': 'Terminé',
        'draft': 'Brouillon'
      };
      return texts[status] || 'Inconnu';
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    onMounted(() => {
      loadMatches();
    });

    return {
      matches,
      getStatusClass,
      getStatusText,
      formatDate
    };
  }
};

// MC Component (Interface complète)
const MCInterface = {
  template: `
    <div class="mc-interface">
      <!-- En-tête avec création/sélection de match -->
      <div class="match-selector card">
        <h2 class="card-title">
          <i class="fas fa-clipboard-list"></i>
          Mode MC - Maître de Cérémonie
        </h2>

        <div class="match-controls" style="display: flex; gap: 15px; flex-wrap: wrap; align-items: center;">
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
              <div class="team" style="text-align: center;">
                <label class="form-label">Équipe A</label>
                <input v-model="currentMatch.teamA.name" class="form-input" style="margin-bottom: 5px; width: 150px;">
                <input v-model.number="currentMatch.teamA.score" type="number" min="0" class="form-input" style="width: 80px;">
              </div>
              <div class="vs" style="font-size: 1.5em; font-weight: bold; color: #718096;">VS</div>
              <div class="team" style="text-align: center;">
                <label class="form-label">Équipe B</label>
                <input v-model="currentMatch.teamB.name" class="form-input" style="margin-bottom: 5px; width: 150px;">
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
          <div class="card-title" style="display: flex; justify-content: space-between; align-items: center;">
            <span><i class="fas fa-list"></i> Improvisations</span>
            <button @click="addImprov" class="btn btn-small">
              <i class="fas fa-plus"></i> Ajouter
            </button>
          </div>

          <div class="improv-list" style="display: flex; flex-direction: column; gap: 15px;">
            <div
              v-for="(improv, index) in currentMatch.improvs"
              :key="improv.id"
              class="improv-item"
              :class="improv.status"
              style="background: rgba(255, 255, 255, 0.7); border-radius: 10px; padding: 15px; border-left: 4px solid #e2e8f0; transition: all 0.3s ease;"
            >
              <div class="improv-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div class="improv-info">
                  <span class="improv-title" style="font-weight: 600; color: #2d3748;">
                    {{ index + 1 }}. {{ improv.title }}
                  </span>
                  <span class="improv-duration" style="background: #edf2f7; color: #4a5568; padding: 4px 8px; border-radius: 15px; font-size: 0.9em; margin-left: 10px;">
                    {{ formatDuration(improv.duration) }}
                  </span>
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
                <div class="improv-music" style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
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

      <!-- Message si pas de match -->
      <div v-else class="no-match card" style="text-align: center; padding: 40px;">
        <i class="fas fa-theater-masks" style="font-size: 3em; margin-bottom: 15px; opacity: 0.3; color: #667eea;"></i>
        <h3 style="color: #4a5568; margin-bottom: 10px;">Aucun match sélectionné</h3>
        <p style="color: #718096; margin-bottom: 20px;">Créez un nouveau match pour commencer</p>
        <button @click="showNewMatchModal = true" class="btn">
          <i class="fas fa-plus"></i> Créer un match
        </button>
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
    </div>
  `,
  setup(props) {
    // État réactif
    const socket = ref(null);
    const currentMatch = ref(null);
    const templates = ref([]);
    const musicLibrary = ref([]);
    const selectedTemplate = ref('');
    const showNewMatchModal = ref(false);
    const newMatch = ref({
      title: '',
      teamB: '',
      template: ''
    });

    // Timer
    const currentTime = ref(0);
    const targetTime = ref(0);
    const isTimerRunning = ref(false);
    const timerInterval = ref(null);
    const activeImprovIndex = ref(-1);

    // Computed
    const timerClass = computed(() => {
      if (!isTimerRunning.value) return '';

      const remaining = targetTime.value - currentTime.value;
      if (remaining <= 10) return 'danger';
      if (remaining <= 30) return 'warning';
      return 'running';
    });

    // Methods
    const initializeSocket = async () => {
      socket.value = io('http://localhost:3000');

      socket.value.on('connect', () => {
        console.log('Connecté au serveur en tant que MC');
        if (currentMatch.value) {
          socket.value.emit('join-match', currentMatch.value.id);
        }
      });

      socket.value.on('music-assigned', (data) => {
        if (currentMatch.value && data.matchId === currentMatch.value.id) {
          const improv = currentMatch.value.improvs.find(i => i.id === data.improvId);
          if (improv) {
            improv.music = data.musicId;
          }
        }
      });
    };

    const loadTemplates = async () => {
      try {
        const response = await fetch('/api/templates');
        templates.value = await response.json();
      } catch (error) {
        console.error('Erreur lors du chargement des templates:', error);
      }
    };

    const loadMusicLibrary = async () => {
      try {
        const response = await fetch('/api/music');
        musicLibrary.value = await response.json();
      } catch (error) {
        console.error('Erreur lors du chargement de la bibliothèque musicale:', error);
      }
    };

    const loadMatch = async (matchId) => {
      try {
        const response = await fetch(`/api/matches/${matchId}`);
        currentMatch.value = await response.json();

        if (socket.value) {
          socket.value.emit('join-match', currentMatch.value.id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du match:', error);
      }
    };

    const createMatch = async () => {
      if (!newMatch.value.title || !newMatch.value.teamB) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }

      const template = templates.value.find(t => t.id === newMatch.value.template);

      const matchData = {
        title: newMatch.value.title,
        teamA: { name: 'Notre Troupe', score: 0 },
        teamB: { name: newMatch.value.teamB, score: 0 },
        improvs: template ? template.improvs.map((improv, index) => ({
          id: 'improv-' + Date.now() + '-' + index,
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

        currentMatch.value = await response.json();
        showNewMatchModal.value = false;
        newMatch.value = { title: '', teamB: '', template: '' };

        if (socket.value) {
          socket.value.emit('join-match', currentMatch.value.id);
        }
      } catch (error) {
        console.error('Erreur lors de la création du match:', error);
        alert('Erreur lors de la création du match');
      }
    };

    const saveMatch = async () => {
      if (!currentMatch.value) return;

      try {
        await fetch(`/api/matches/${currentMatch.value.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentMatch.value)
        });

        console.log('Match sauvegardé');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      }
    };

    const addImprov = () => {
      if (!currentMatch.value) return;

      const newImprov = {
        id: 'improv-' + Date.now(),
        title: 'Improv ' + (currentMatch.value.improvs.length + 1),
        duration: 120,
        status: 'pending',
        music: null,
        theme: ''
      };

      currentMatch.value.improvs.push(newImprov);
    };

    const setActiveImprov = (index) => {
      const improv = currentMatch.value.improvs[index];

      if (improv.status === 'completed') return;

      // Marquer les précédentes comme terminées
      for (let i = 0; i < index; i++) {
        currentMatch.value.improvs[i].status = 'completed';
      }

      // Marquer les suivantes comme en attente
      for (let i = index + 1; i < currentMatch.value.improvs.length; i++) {
        currentMatch.value.improvs[i].status = 'pending';
      }

      // Activer l'improv courante
      improv.status = 'in-progress';
      activeImprovIndex.value = index;

      // Configurer le timer
      targetTime.value = improv.duration;
      currentTime.value = 0;
      resetTimer();
    };

    // Timer methods
    const startTimer = () => {
      if (isTimerRunning.value) return;

      isTimerRunning.value = true;
      timerInterval.value = setInterval(() => {
        currentTime.value++;

        if (currentTime.value >= targetTime.value) {
          pauseTimer();
        }
      }, 1000);
    };

    const pauseTimer = () => {
      isTimerRunning.value = false;
      if (timerInterval.value) {
        clearInterval(timerInterval.value);
        timerInterval.value = null;
      }
    };

    const resetTimer = () => {
      pauseTimer();
      currentTime.value = 0;
    };

    // Music methods
    const getMusicTitle = (musicId) => {
      const music = musicLibrary.value.find(m => m.id === musicId);
      return music ? music.title : 'Musique inconnue';
    };

    const getMusicSuggestions = (theme) => {
      if (!theme) return [];

      const keywords = theme.toLowerCase().split(' ');

      return musicLibrary.value.filter(music => {
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
    };

    const assignMusic = (improvIndex, musicId) => {
      currentMatch.value.improvs[improvIndex].music = musicId;

      // Notifier l'interface son
      if (socket.value) {
        socket.value.emit('music-assigned', {
          matchId: currentMatch.value.id,
          improvId: currentMatch.value.improvs[improvIndex].id,
          musicId: musicId
        });
      }
    };

    const previewMusic = (musicId) => {
      console.log('Preview music:', musicId);
    };

    const openMusicSelector = (improvIndex) => {
      console.log('Open music selector for improv:', improvIndex);
    };

    // Utility methods
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return mins + ':' + secs.toString().padStart(2, '0');
    };

    const formatDuration = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return mins + ':' + secs.toString().padStart(2, '0');
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const getImprovIcon = (status) => {
      const icons = {
        'pending': 'fas fa-circle',
        'in-progress': 'fas fa-play',
        'completed': 'fas fa-check'
      };
      return icons[status] || 'fas fa-circle';
    };

    const getImprovButtonText = (status) => {
      const texts = {
        'pending': 'Démarrer',
        'in-progress': 'En cours',
        'completed': 'Terminé'
      };
      return texts[status] || 'Démarrer';
    };

    // Lifecycle
    onMounted(async () => {
      await initializeSocket();
      await loadTemplates();
      await loadMusicLibrary();

      // Si un matchId est passé dans l'URL, charger ce match
      if (props.matchId) {
        await loadMatch(props.matchId);
      }
    });

    onBeforeUnmount(() => {
      if (socket.value) {
        socket.value.disconnect();
      }
      if (timerInterval.value) {
        clearInterval(timerInterval.value);
      }
    });

    return {
      // État
      currentMatch,
      templates,
      musicLibrary,
      selectedTemplate,
      showNewMatchModal,
      newMatch,
      currentTime,
      targetTime,
      isTimerRunning,
      activeImprovIndex,
      timerClass,

      // Méthodes
      createMatch,
      saveMatch,
      addImprov,
      setActiveImprov,
      startTimer,
      pauseTimer,
      resetTimer,
      getMusicTitle,
      getMusicSuggestions,
      assignMusic,
      previewMusic,
      openMusicSelector,
      formatTime,
      formatDuration,
      formatDate,
      getImprovIcon,
      getImprovButtonText
    };
  }
};

// Sound Component (Interface complète)
const SoundInterface = {
  template: `
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
        <h3 class="card-title" style="color: white;">
          <i class="fas fa-play"></i>
          Lecteur Principal
        </h3>

        <div v-if="currentTrack" class="current-track">
          <div class="track-info">
            <h4 style="color: white;">{{ currentTrack.title }}</h4>
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

          <!-- Élément audio HTML5 caché -->
          <audio
            ref="audioPlayer"
            @timeupdate="updateProgress"
            @ended="onTrackEnded"
            @loadedmetadata="onTrackLoaded"
          ></audio>
        </div>

        <div v-else class="no-track" style="text-align: center; padding: 40px; color: rgba(255,255,255,0.6);">
          <i class="fas fa-music" style="font-size: 3em; margin-bottom: 15px; opacity: 0.3;"></i>
          <p>Aucune musique sélectionnée</p>
          <p style="font-size: 0.9em;">Choisissez une musique dans la bibliothèque ci-dessous</p>
        </div>
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
        <div class="music-list" style="max-height: 400px; overflow-y: auto; border: 2px dashed #e2e8f0; border-radius: 10px; padding: 15px;">
          <div
            v-for="music in filteredMusic"
            :key="music.id"
            class="music-item"
            :class="{ active: currentTrack && currentTrack.id === music.id }"
            @click="selectMusic(music)"
            @dragstart="onDragStart($event, music)"
            draggable="true"
            style="background: rgba(255,255,255,0.8); border-radius: 8px; padding: 12px; margin-bottom: 10px; cursor: pointer; transition: all 0.3s ease; border: 1px solid rgba(255,255,255,0.5);"
          >
            <div class="music-info" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
              <div class="music-title" style="font-weight: 600; color: #2d3748;">{{ music.title }}</div>
              <div class="music-duration" style="color: #718096; font-size: 0.9em;">{{ formatTime(music.duration) }}</div>
            </div>

            <div class="music-artist" style="color: #718096; font-size: 0.9em; margin-bottom: 8px;">{{ music.artist || 'Artiste inconnu' }}</div>

            <div class="music-tags" style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 8px;">
              <span v-for="tag in music.tags.mood.slice(0, 2)" :key="tag" class="tag mood">{{ tag }}</span>
              <span class="tag energy">{{ music.tags.energy }}/10</span>
              <span v-if="music.tags.tempo" class="tag">{{ music.tags.tempo }}</span>
            </div>

            <div class="music-actions" style="display: flex; gap: 8px;">
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
            <div class="music-cues" style="margin-top: 8px; display: flex; gap: 8px; font-size: 0.8em;">
              <span class="cue" @click.stop="previewCue(music, 'hook')" style="cursor: pointer; padding: 2px 6px; background: rgba(255, 255, 255, 0.1); border-radius: 4px;">
                🎯 Hook {{ formatTime(music.cues.hook) }}
              </span>
              <span class="cue" @click.stop="previewCue(music, 'climax')" style="cursor: pointer; padding: 2px 6px; background: rgba(255, 255, 255, 0.1); border-radius: 4px;">
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
  `,
  setup(props) {
    // État réactif
    const socket = ref(null);
    const currentMatch = ref(null);
    const availableMatches = ref([]);
    const selectedMatchId = ref('');
    const musicLibrary = ref([]);
    const currentTrack = ref(null);
    const isPlaying = ref(false);
    const currentTime = ref(0);
    const volume = ref(80);
    const playbackMode = ref('hook');

    // Filtres
    const searchQuery = ref('');
    const filterMood = ref('');
    const filterEnergy = ref('');

    // Drag & Drop
    const draggedMusic = ref(null);

    // Quick launch
    const quickLaunchButtons = ref([
      { id: 'applause', label: 'Applause', icon: 'fas fa-hands-clapping', color: '#48bb78' },
      { id: 'gong', label: 'Gong', icon: 'fas fa-bell', color: '#ed8936' },
      { id: 'transition', label: 'Transition', icon: 'fas fa-forward', color: '#667eea' },
      { id: 'suspense', label: 'Suspense', icon: 'fas fa-question', color: '#9f7aea' },
      { id: 'comedy', label: 'Comique', icon: 'fas fa-laugh', color: '#f56565' },
      { id: 'energy', label: 'Énergique', icon: 'fas fa-bolt', color: '#38b2ac' }
    ]);

    // Computed
    const progressPercent = computed(() => {
      if (!currentTrack.value || currentTrack.value.duration === 0) return 0;
      return (currentTime.value / currentTrack.value.duration) * 100;
    });

    const filteredMusic = computed(() => {
      let filtered = musicLibrary.value;

      // Recherche textuelle
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(music =>
          music.title.toLowerCase().includes(query) ||
          (music.artist && music.artist.toLowerCase().includes(query)) ||
          music.tags.mood.some(mood => mood.toLowerCase().includes(query)) ||
          music.impro_context.scenarios.some(scenario => scenario.toLowerCase().includes(query))
        );
      }

      // Filtre par ambiance
      if (filterMood.value) {
        filtered = filtered.filter(music =>
          music.tags.mood.includes(filterMood.value)
        );
      }

      // Filtre par énergie
      if (filterEnergy.value) {
        const [min, max] = filterEnergy.value.split('-').map(Number);
        filtered = filtered.filter(music =>
          music.tags.energy >= min && music.tags.energy <= max
        );
      }

      return filtered;
    });

    const availableMoods = computed(() => {
      const moods = new Set();
      musicLibrary.value.forEach(music => {
        music.tags.mood.forEach(mood => moods.add(mood));
      });
      return Array.from(moods).sort();
    });

    // Methods
    const initializeSocket = async () => {
      socket.value = io('http://localhost:3000');

      socket.value.on('connect', () => {
        console.log('Connecté au serveur en tant que responsable son');
        if (currentMatch.value) {
          socket.value.emit('join-match', currentMatch.value.id);
        }
      });

      socket.value.on('match-updated', (matchData) => {
        if (currentMatch.value && matchData.id === currentMatch.value.id) {
          currentMatch.value = matchData;
        }
      });
    };

    const loadMusicLibrary = async () => {
      try {
        const response = await fetch('/api/music');
        musicLibrary.value = await response.json();
      } catch (error) {
        console.error('Erreur lors du chargement de la bibliothèque musicale:', error);
      }
    };

    const loadAvailableMatches = async () => {
      try {
        const response = await fetch('/api/matches');
        availableMatches.value = await response.json();
      } catch (error) {
        console.error('Erreur lors du chargement des matchs:', error);
      }
    };

    const loadMatch = async () => {
      if (!selectedMatchId.value) {
        currentMatch.value = null;
        return;
      }

      try {
        const response = await fetch(`/api/matches/${selectedMatchId.value}`);
        currentMatch.value = await response.json();

        if (socket.value) {
          socket.value.emit('join-match', currentMatch.value.id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du match:', error);
      }
    };

    const syncWithMC = async () => {
      if (!currentMatch.value) return;
      await loadMatch();
      console.log('Synchronisation avec MC effectuée');
    };

    // Audio player methods
    const selectMusic = (music) => {
      currentTrack.value = music;
      loadAudioTrack();
    };

    const playMusic = (music) => {
      selectMusic(music);
      playbackMode.value = 'full';
      play();
    };

    const playMusicHook = (music) => {
      selectMusic(music);
      playbackMode.value = 'hook';
      play();
    };

    const loadAudioTrack = () => {
      if (!currentTrack.value) return;

      // Simuler le chargement - en réalité, il faudrait l'URL du fichier
      console.log('Chargement de:', currentTrack.value.filename);
      // audioPlayer.value.src = `/uploads/${currentTrack.value.filename}`;
      // audioPlayer.value.volume = volume.value / 100;
    };

    const play = () => {
      if (!currentTrack.value) return;

      // Simuler la lecture pour la démo
      isPlaying.value = true;

      // Positionner selon le mode de lecture
      switch (playbackMode.value) {
        case 'hook':
          currentTime.value = currentTrack.value.cues.hook;
          break;
        case 'climax':
          currentTime.value = currentTrack.value.cues.climax;
          break;
        case 'full':
        default:
          currentTime.value = currentTrack.value.cues.start;
          break;
      }

      // Notifier les autres interfaces
      if (socket.value && currentMatch.value) {
        socket.value.emit('music-play', {
          matchId: currentMatch.value.id,
          musicId: currentTrack.value.id,
          mode: playbackMode.value
        });
      }
    };

    const togglePlay = () => {
      if (isPlaying.value) {
        isPlaying.value = false;
      } else {
        play();
      }
    };

    const stop = () => {
      isPlaying.value = false;
      currentTime.value = 0;
    };

    const skipToCue = (cueType) => {
      if (!currentTrack.value) return;

      const cueTime = currentTrack.value.cues[cueType];
      if (cueTime !== undefined) {
        currentTime.value = cueTime;
      }
    };

    const updateVolume = () => {
      console.log('Volume:', volume.value);
    };

    const updatePlaybackMode = () => {
      if (isPlaying.value) {
        skipToCue(playbackMode.value === 'hook' ? 'hook' : 'start');
      }
    };

    const updateProgress = () => {
      // Cette méthode serait appelée par l'événement timeupdate de l'audio
    };

    const onTrackEnded = () => {
      isPlaying.value = false;
      currentTime.value = 0;
    };

    const onTrackLoaded = () => {
      console.log('Track loaded:', currentTrack.value.title);
    };

    // Quick actions
    const quickPlay = (quickAction) => {
      let targetMusic = null;

      switch (quickAction.id) {
        case 'applause':
          targetMusic = musicLibrary.value.find(m =>
            m.tags.mood.includes('applaudissements') ||
            m.title.toLowerCase().includes('applause')
          );
          break;
        case 'gong':
          targetMusic = musicLibrary.value.find(m =>
            m.title.toLowerCase().includes('gong') ||
            m.tags.mood.includes('transition')
          );
          break;
        case 'energy':
          targetMusic = musicLibrary.value.find(m => m.tags.energy >= 8);
          break;
        case 'comedy':
          targetMusic = musicLibrary.value.find(m =>
            m.tags.mood.includes('comique') ||
            m.tags.mood.includes('joyeux')
          );
          break;
        default:
          targetMusic = musicLibrary.value.find(m =>
            m.tags.mood.includes(quickAction.id)
          );
      }

      if (targetMusic) {
        playMusicHook(targetMusic);
      } else {
        console.log(`Aucune musique trouvée pour ${quickAction.label}`);
      }
    };

    const randomMusic = () => {
      if (filteredMusic.value.length === 0) return;

      const randomIndex = Math.floor(Math.random() * filteredMusic.value.length);
      const randomMusic = filteredMusic.value[randomIndex];
      playMusicHook(randomMusic);
    };

    // Drag & Drop
    const onDragStart = (event, music) => {
      draggedMusic.value = music;
      event.dataTransfer.effectAllowed = 'move';
    };

    const onDrop = (event, improvIndex) => {
      event.preventDefault();

      if (!draggedMusic.value || !currentMatch.value) return;

      // Assigner la musique à l'improv
      currentMatch.value.improvs[improvIndex].music = draggedMusic.value.id;

      // Sauvegarder le match
      saveMatch();

      // Notifier l'interface MC
      if (socket.value) {
        socket.value.emit('music-assigned', {
          matchId: currentMatch.value.id,
          improvId: currentMatch.value.improvs[improvIndex].id,
          musicId: draggedMusic.value.id
        });
      }

      draggedMusic.value = null;
    };

    const removeMusic = (improvIndex) => {
      if (!currentMatch.value) return;

      currentMatch.value.improvs[improvIndex].music = null;
      saveMatch();
    };

    const saveMatch = async () => {
      if (!currentMatch.value) return;

      try {
        await fetch(`/api/matches/${currentMatch.value.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentMatch.value)
        });
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      }
    };

    // Utility methods
    const getMusicTitle = (musicId) => {
      const music = musicLibrary.value.find(m => m.id === musicId);
      return music ? music.title : 'Musique inconnue';
    };

    const playImprovMusic = (improv) => {
      if (!improv.music) return;

      const music = musicLibrary.value.find(m => m.id === improv.music);
      if (music) {
        playMusicHook(music);
      }
    };

    const previewCue = (music, cueType) => {
      selectMusic(music);
      skipToCue(cueType);
      play();

      // Auto-stop après 5 secondes pour preview
      setTimeout(() => {
        if (isPlaying.value) {
          stop();
        }
      }, 5000);
    };

    const addToFavorites = (music) => {
      music.favorite = !music.favorite;
    };

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Lifecycle
    onMounted(async () => {
      await initializeSocket();
      await loadMusicLibrary();
      await loadAvailableMatches();

      if (props.matchId) {
        selectedMatchId.value = props.matchId;
        await loadMatch();
      }
    });

    onBeforeUnmount(() => {
      if (socket.value) {
        socket.value.disconnect();
      }
    });

    return {
      // État
      currentMatch,
      availableMatches,
      selectedMatchId,
      musicLibrary,
      currentTrack,
      isPlaying,
      currentTime,
      volume,
      playbackMode,
      searchQuery,
      filterMood,
      filterEnergy,
      draggedMusic,
      quickLaunchButtons,
      progressPercent,
      filteredMusic,
      availableMoods,

      // Méthodes
      loadMatch,
      syncWithMC,
      selectMusic,
      playMusic,
      playMusicHook,
      play,
      togglePlay,
      stop,
      skipToCue,
      updateVolume,
      updatePlaybackMode,
      updateProgress,
      onTrackEnded,
      onTrackLoaded,
      quickPlay,
      randomMusic,
      onDragStart,
      onDrop,
      removeMusic,
      getMusicTitle,
      playImprovMusic,
      previewCue,
      addToFavorites,
      formatTime
    };
  }
};

// Router configuration
const routes = [
  { path: '/', component: Home },
  { path: '/mc', component: MCInterface },
  { path: '/mc/:matchId', component: MCInterface },
  { path: '/sound', component: SoundInterface },
  { path: '/sound/:matchId', component: SoundInterface }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Main App
const App = {
  template: `
    <div id="app">
      <nav class="header">
        <div class="container">
          <h1>
            <i class="fas fa-theater-masks"></i>
            Impro Manager
            <span class="badge">{{ currentMode }}</span>
          </h1>

          <div class="nav-links" style="margin-top: 10px;">
            <router-link to="/" class="btn btn-small">
              <i class="fas fa-home"></i> Accueil
            </router-link>
            <router-link to="/mc" class="btn btn-small">
              <i class="fas fa-clipboard-list"></i> Mode MC
            </router-link>
            <router-link to="/sound" class="btn btn-small">
              <i class="fas fa-volume-up"></i> Mode Son
            </router-link>
          </div>
        </div>
      </nav>

      <div class="container">
        <router-view></router-view>
      </div>
    </div>
  `,
  setup() {
    const currentMode = computed(() => {
      const route = router.currentRoute.value;
      if (route.path.startsWith('/mc')) return 'MC';
      if (route.path.startsWith('/sound')) return 'Son';
      return 'Accueil';
    });

    return {
      currentMode
    };
  }
};

// Initialize app
const app = createApp(App);
app.use(router);
app.mount('#app');