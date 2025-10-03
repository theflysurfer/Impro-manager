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

// MC Component (Version simplifiée)
const MCInterface = {
  template: `
    <div class="mc-interface">
      <div class="card">
        <h2 class="card-title">
          <i class="fas fa-clipboard-list"></i>
          Mode MC - Maître de Cérémonie
        </h2>

        <div class="demo-info" style="text-align: center; padding: 40px; background: rgba(102, 126, 234, 0.1); border-radius: 10px;">
          <i class="fas fa-tools" style="font-size: 3em; margin-bottom: 15px; color: #667eea;"></i>
          <h3 style="color: #4a5568; margin-bottom: 10px;">Interface MC en développement</h3>
          <p style="color: #718096; line-height: 1.6;">
            Cette interface permettra de :<br>
            • Créer et gérer des feuilles de match<br>
            • Utiliser des templates prédéfinis<br>
            • Gérer le timer et les scores<br>
            • Synchroniser avec l'interface Son
          </p>

          <div style="margin-top: 20px;">
            <button class="btn" @click="showDemo">
              <i class="fas fa-play"></i> Voir la démo
            </button>
          </div>
        </div>

        <div v-if="demoMode" class="demo-match" style="margin-top: 20px;">
          <div class="card">
            <h3>Match de Démonstration</h3>
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 20px 0;">
              <div style="text-align: center;">
                <h4>Notre Troupe</h4>
                <div class="timer" style="display: inline-block; margin: 10px;">{{ teamAScore }}</div>
              </div>
              <div style="font-size: 2em; color: #718096;">VS</div>
              <div style="text-align: center;">
                <h4>Les Fous du Rire</h4>
                <div class="timer" style="display: inline-block; margin: 10px;">{{ teamBScore }}</div>
              </div>
            </div>

            <div class="timer" :class="timerClass">{{ formatTime(currentTime) }}</div>

            <div style="text-align: center; margin: 20px 0;">
              <button @click="startTimer" :disabled="isRunning" class="btn">
                <i class="fas fa-play"></i> Start
              </button>
              <button @click="pauseTimer" :disabled="!isRunning" class="btn btn-secondary" style="margin-left: 10px;">
                <i class="fas fa-pause"></i> Pause
              </button>
              <button @click="resetTimer" class="btn btn-danger" style="margin-left: 10px;">
                <i class="fas fa-stop"></i> Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const demoMode = ref(false);
    const teamAScore = ref(0);
    const teamBScore = ref(0);
    const currentTime = ref(0);
    const isRunning = ref(false);
    const timerInterval = ref(null);

    const timerClass = computed(() => {
      if (!isRunning.value) return '';
      if (currentTime.value >= 110) return 'danger';
      if (currentTime.value >= 90) return 'warning';
      return 'running';
    });

    const showDemo = () => {
      demoMode.value = true;
    };

    const startTimer = () => {
      if (isRunning.value) return;
      isRunning.value = true;
      timerInterval.value = setInterval(() => {
        currentTime.value++;
        if (currentTime.value >= 120) {
          pauseTimer();
        }
      }, 1000);
    };

    const pauseTimer = () => {
      isRunning.value = false;
      if (timerInterval.value) {
        clearInterval(timerInterval.value);
        timerInterval.value = null;
      }
    };

    const resetTimer = () => {
      pauseTimer();
      currentTime.value = 0;
    };

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return mins + ':' + secs.toString().padStart(2, '0');
    };

    onBeforeUnmount(() => {
      if (timerInterval.value) {
        clearInterval(timerInterval.value);
      }
    });

    return {
      demoMode,
      teamAScore,
      teamBScore,
      currentTime,
      isRunning,
      timerClass,
      showDemo,
      startTimer,
      pauseTimer,
      resetTimer,
      formatTime
    };
  }
};

// Sound Component (Version simplifiée)
const SoundInterface = {
  template: `
    <div class="sound-interface">
      <div class="card">
        <h2 class="card-title">
          <i class="fas fa-volume-up"></i>
          Mode Son - Responsable Sonorisation
        </h2>

        <div class="demo-info" style="text-align: center; padding: 40px; background: rgba(72, 187, 120, 0.1); border-radius: 10px;">
          <i class="fas fa-music" style="font-size: 3em; margin-bottom: 15px; color: #48bb78;"></i>
          <h3 style="color: #4a5568; margin-bottom: 10px;">Interface Son en développement</h3>
          <p style="color: #718096; line-height: 1.6;">
            Cette interface permettra de :<br>
            • Gérer une bibliothèque musicale complète<br>
            • Lecteur audio avec points de lecture (Hook, Climax)<br>
            • Glisser-déposer pour assigner les musiques<br>
            • Raccourcis clavier et lancement rapide
          </p>

          <div style="margin-top: 20px;">
            <button class="btn btn-success" @click="showDemo">
              <i class="fas fa-play"></i> Voir la démo
            </button>
          </div>
        </div>

        <div v-if="demoMode" class="demo-player" style="margin-top: 20px;">
          <div class="audio-player">
            <h3 style="color: white; margin-bottom: 10px;">
              <i class="fas fa-music"></i> Demo - Jazz Cool Café
            </h3>
            <p style="color: rgba(255,255,255,0.8); margin-bottom: 15px;">
              Lecture simulée - Points de lecture : Hook (0:32), Climax (1:38)
            </p>

            <div class="audio-progress">
              <div class="audio-progress-bar" :style="{ width: progressPercent + '%' }"></div>
            </div>

            <div class="audio-controls">
              <button @click="play" class="btn">
                <i class="fas fa-play"></i> Play
              </button>
              <button @click="playHook" class="btn btn-secondary">
                <i class="fas fa-fire"></i> Hook
              </button>
              <button @click="stop" class="btn btn-danger">
                <i class="fas fa-stop"></i> Stop
              </button>
            </div>

            <div style="color: rgba(255,255,255,0.8); margin-top: 10px; text-align: center;">
              {{ formatTime(currentTime) }} / 4:05
            </div>
          </div>

          <div class="card" style="margin-top: 20px;">
            <h3 class="card-title">Bibliothèque de Démonstration</h3>
            <div class="music-items">
              <div v-for="music in demoMusic" :key="music.id"
                   class="music-item"
                   style="background: rgba(255,255,255,0.8); padding: 12px; margin-bottom: 10px; border-radius: 8px; cursor: pointer;"
                   @click="selectMusic(music)">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-weight: 600; color: #2d3748;">{{ music.title }}</div>
                    <div style="color: #718096; font-size: 0.9em;">{{ music.artist }}</div>
                  </div>
                  <div style="display: flex; gap: 5px;">
                    <span v-for="tag in music.tags" :key="tag" class="tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const demoMode = ref(false);
    const currentTime = ref(0);
    const isPlaying = ref(false);
    const timerInterval = ref(null);

    const demoMusic = ref([
      {
        id: 1,
        title: 'Jazz Cool Café',
        artist: 'Django\'s Cats',
        tags: ['jazz', 'énergique', '7/10']
      },
      {
        id: 2,
        title: 'Mystère Oriental',
        artist: 'World Sounds',
        tags: ['mystérieux', 'lent', '4/10']
      },
      {
        id: 3,
        title: 'Rock Énergie',
        artist: 'Electric Boost',
        tags: ['rock', 'dynamo', '9/10']
      }
    ]);

    const progressPercent = computed(() => {
      return (currentTime.value / 245) * 100; // 245 secondes = 4:05
    });

    const showDemo = () => {
      demoMode.value = true;
    };

    const play = () => {
      if (isPlaying.value) return;
      isPlaying.value = true;
      timerInterval.value = setInterval(() => {
        currentTime.value++;
        if (currentTime.value >= 245) {
          stop();
        }
      }, 100); // Plus rapide pour la démo
    };

    const playHook = () => {
      currentTime.value = 32; // Hook à 0:32
      play();
    };

    const stop = () => {
      isPlaying.value = false;
      currentTime.value = 0;
      if (timerInterval.value) {
        clearInterval(timerInterval.value);
        timerInterval.value = null;
      }
    };

    const selectMusic = (music) => {
      console.log('Musique sélectionnée:', music.title);
      stop();
    };

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return mins + ':' + secs.toString().padStart(2, '0');
    };

    onBeforeUnmount(() => {
      if (timerInterval.value) {
        clearInterval(timerInterval.value);
      }
    });

    return {
      demoMode,
      currentTime,
      isPlaying,
      demoMusic,
      progressPercent,
      showDemo,
      play,
      playHook,
      stop,
      selectMusic,
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