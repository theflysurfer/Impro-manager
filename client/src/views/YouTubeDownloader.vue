<template>
  <div class="youtube-downloader">
    <div class="page-header">
      <h1>
        <i class="fab fa-youtube"></i>
        YouTube Music Downloader
      </h1>
      <p>Télécharger de la musique depuis YouTube avec détection automatique des moments forts (Hook, Climax, Outro)</p>
    </div>

    <!-- Dependency Status Card (always visible) -->
    <div class="card dependency-check">
      <h3>🔧 Statut des Dépendances</h3>
      <div v-if="dependenciesChecked">
        <p v-if="dependenciesInstalled" class="success-message">
          ✅ Toutes les dépendances sont installées (yt-dlp, librosa)
        </p>
        <div v-else class="alert-warning">
          <p>⚠️ Dépendances manquantes</p>
          <ul>
            <li v-for="error in dependencyErrors" :key="error">{{ error }}</li>
          </ul>
          <div class="install-guide">
            <h4>Installation :</h4>
            <pre><code>pip install -r requirements.txt</code></pre>
            <p>Pour FFmpeg : <a href="https://ffmpeg.org/download.html" target="_blank">ffmpeg.org/download.html</a></p>
          </div>
        </div>
      </div>
      <div v-else>
        <p>⏳ Vérification en cours...</p>
      </div>
    </div>

    <!-- YouTube Video Preview Player -->
    <div v-if="youtubeVideoId" class="card youtube-player">
      <h3>
        <i class="fab fa-youtube"></i>
        Aperçu vidéo
      </h3>
      <div class="video-container">
        <iframe
          :src="`https://www.youtube.com/embed/${youtubeVideoId}`"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="video-iframe"
        ></iframe>
      </div>
    </div>

    <!-- Download Form -->
    <div class="card">
      <h2 class="card-title">
        <i class="fas fa-download"></i>
        YouTube - Nouveau téléchargement
      </h2>

      <div class="download-form">
        <div class="form-group">
          <label>Type de téléchargement</label>
          <div class="btn-group">
            <button
              :class="['btn', downloadType === 'url' && 'btn-primary']"
              @click="downloadType = 'url'"
              aria-label="URL"
            >
              <i class="fas fa-link"></i> URL
            </button>
            <button
              :class="['btn', downloadType === 'search' && 'btn-primary']"
              @click="downloadType = 'search'"
              aria-label="Recherche"
            >
              <i class="fas fa-search"></i> Recherche
            </button>
            <button
              :class="['btn', downloadType === 'playlist' && 'btn-primary']"
              @click="downloadType = 'playlist'"
              aria-label="Playlist"
            >
              <i class="fas fa-list"></i> Playlist
            </button>
          </div>
        </div>

        <div class="form-group">
          <label v-if="downloadType === 'url'">URL YouTube</label>
          <label v-else-if="downloadType === 'search'">Recherche</label>
          <label v-else>URL Playlist</label>
          <input
            v-model="downloadUrl"
            type="text"
            :placeholder="getPlaceholder()"
            class="form-input"
          />
        </div>

        <!-- Metadata - Temporairement masqué (cause confusion) -->
        <div v-if="false" class="metadata-section">
          <h3>📝 Métadonnées (optionnel)</h3>

          <div class="form-row">
            <div class="form-group">
              <label>Scénarios d'impro</label>
              <input
                v-model="metadata.scenarios"
                type="text"
                placeholder="Western, Action, Médiéval"
                class="form-input"
              />
              <small>Séparer par des virgules</small>
            </div>

            <div class="form-group">
              <label>Ambiances</label>
              <input
                v-model="metadata.moods"
                type="text"
                placeholder="Epic, Tendu, Calme"
                class="form-input"
              />
              <small>Séparer par des virgules</small>
            </div>
          </div>

          <div class="form-group">
            <label>Niveau d'énergie (1-10)</label>
            <input
              v-model.number="metadata.energy"
              type="range"
              min="1"
              max="10"
              class="slider"
            />
            <span class="energy-value">{{ metadata.energy || 5 }}</span>
          </div>
        </div>

        <button @click="startDownload" :disabled="!downloadUrl || downloading" class="btn btn-large btn-success">
          <i class="fas fa-download"></i>
          {{ downloading ? 'Téléchargement en cours...' : 'Télécharger' }}
        </button>
      </div>
    </div>

    <!-- Active Downloads -->
    <div v-if="activeDownloads.length > 0" class="card active-downloads">
      <h3 class="card-title">
        <i class="fas fa-spinner fa-spin"></i>
        Téléchargements actifs
      </h3>

      <div class="downloads-list">
        <div
          v-for="download in activeDownloads"
          :key="download.id"
          class="download-item"
          :class="`status-${download.status}`"
        >
          <div class="download-header">
            <div class="download-info">
              <i :class="getStatusIcon(download.status)"></i>
              <span class="download-url">{{ download.url }}</span>
            </div>
            <div class="download-status">
              <span v-if="download.status === 'completed'" class="badge badge-success">
                <i class="fas fa-check"></i> Terminé
              </span>
              <span v-else-if="download.status === 'failed'" class="badge badge-danger">
                <i class="fas fa-times"></i> Échec
              </span>
              <span v-else class="badge badge-info">
                {{ download.progress }}%
              </span>
            </div>
          </div>

          <div v-if="download.status === 'downloading' || download.status === 'pending'" class="progress-bar-container">
            <div class="progress-bar" :style="{ width: download.progress + '%' }"></div>
          </div>

          <div v-if="download.error" class="download-error">
            <i class="fas fa-exclamation-triangle"></i>
            {{ download.error }}
          </div>

          <div v-if="download.result && download.result.success" class="download-success">
            <i class="fas fa-check-circle"></i>
            {{ download.result.message }}
            <small>({{ (download.result.duration / 1000).toFixed(1) }}s)</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Downloads (completed) -->
    <div class="card recent-downloads">
      <h3 class="card-title">
        <i class="fas fa-history"></i>
        Téléchargements récents
      </h3>
      <div v-if="completedDownloads.length === 0" class="no-downloads">
        Aucun téléchargement récent
      </div>
      <div v-else class="completed-list">
        <div v-for="download in completedDownloads.slice(0, 5)" :key="download.id" class="completed-item">
          <i class="fas fa-check-circle text-success"></i>
          <span>{{ download.url }}</span>
          <small>{{ formatDate(download.endTime) }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'YouTubeDownloader',
  data() {
    return {
      dependenciesChecked: false,
      dependenciesInstalled: false,
      dependencyErrors: [],

      downloadType: 'url',
      downloadUrl: '',
      metadata: {
        scenarios: '',
        moods: '',
        energy: 5
      },

      downloading: false,
      activeDownloads: [],
      completedDownloads: [],

      pollInterval: null
    };
  },
  computed: {
    youtubeVideoId() {
      if (this.downloadType !== 'url' || !this.downloadUrl) return null;

      // Extract YouTube video ID from various URL formats
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?]+)/,
        /youtube\.com\/embed\/([^&\?]+)/,
        /youtube\.com\/v\/([^&\?]+)/
      ];

      for (const pattern of patterns) {
        const match = this.downloadUrl.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }

      return null;
    }
  },
  mounted() {
    this.checkDependencies();
    this.loadDownloads();
  },
  beforeUnmount() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  },
  methods: {
    getPlaceholder() {
      if (this.downloadType === 'search') {
        return 'Rechercher une musique... (ex: western showdown epic music)';
      } else if (this.downloadType === 'playlist') {
        return 'URL de la playlist YouTube';
      } else {
        return 'https://www.youtube.com/watch?v=...';
      }
    },

    async checkDependencies() {
      try {
        const response = await fetch('/api/youtube/check-dependencies', {
          method: 'POST'
        });
        const data = await response.json();

        this.dependenciesChecked = true;
        this.dependenciesInstalled = data.installed;
        this.dependencyErrors = data.checks.errors || [];

        if (data.installed) {
          console.log('✅ Toutes les dépendances Python sont installées');
        } else {
          console.warn('⚠️ Dépendances manquantes:', this.dependencyErrors);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des dépendances:', error);
        this.dependenciesChecked = true;
        this.dependenciesInstalled = false;
        this.dependencyErrors = ['Impossible de vérifier les dépendances. Le serveur est-il démarré ?'];
      }
    },

    async startDownload() {
      if (!this.downloadUrl) return;

      this.downloading = true;

      try {
        // Prepare metadata
        const metadataToSend = {};
        if (this.metadata.scenarios) {
          metadataToSend.scenarios = this.metadata.scenarios.split(',').map(s => s.trim());
        }
        if (this.metadata.moods) {
          metadataToSend.moods = this.metadata.moods.split(',').map(m => m.trim());
        }
        if (this.metadata.energy) {
          metadataToSend.energy = this.metadata.energy;
        }

        const response = await fetch('/api/youtube/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: this.downloadUrl,
            type: this.downloadType,
            metadata: metadataToSend
          })
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Téléchargement démarré:', data.downloadId);

          // Add to active downloads
          this.activeDownloads.push({
            id: data.downloadId,
            url: this.downloadUrl,
            type: this.downloadType,
            status: 'pending',
            progress: 0,
            startTime: Date.now()
          });

          // Start polling for this download
          this.startPolling(data.downloadId);

          // Reset form
          this.downloadUrl = '';
          this.metadata = { scenarios: '', moods: '', energy: 5 };
        } else {
          alert(`Erreur: ${data.error}`);
        }
      } catch (error) {
        console.error('Erreur lors du démarrage du téléchargement:', error);
        alert('Erreur lors du démarrage du téléchargement');
      } finally {
        this.downloading = false;
      }
    },

    startPolling(downloadId) {
      // Poll every 2 seconds
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/youtube/status/${downloadId}`);
          const data = await response.json();

          // Update download in list
          const index = this.activeDownloads.findIndex(d => d.id === downloadId);
          if (index !== -1) {
            this.activeDownloads[index] = { ...this.activeDownloads[index], ...data };

            // If completed or failed, stop polling
            if (data.status === 'completed' || data.status === 'failed') {
              clearInterval(interval);

              // Move to completed if successful
              if (data.status === 'completed') {
                setTimeout(() => {
                  const completedDownload = {
                    ...this.activeDownloads[index],
                    endTime: Date.now()
                  };
                  this.completedDownloads.unshift(completedDownload);
                  this.activeDownloads.splice(index, 1);

                  // Reload music library
                  window.location.reload(); // Ou émettre un event pour recharger la bibliothèque
                }, 2000);
              }
            }
          }
        } catch (error) {
          console.error(`Erreur lors du polling de ${downloadId}:`, error);
        }
      }, 2000);
    },

    async loadDownloads() {
      try {
        const response = await fetch('/api/youtube/active');
        const data = await response.json();

        this.activeDownloads = data.downloads || [];

        // Start polling for each active download
        this.activeDownloads.forEach(dl => {
          if (dl.status !== 'completed' && dl.status !== 'failed') {
            this.startPolling(dl.id);
          }
        });
      } catch (error) {
        console.error('Erreur lors du chargement des téléchargements actifs:', error);
      }
    },

    getStatusIcon(status) {
      const icons = {
        pending: 'fas fa-clock',
        downloading: 'fas fa-spinner fa-spin',
        completed: 'fas fa-check-circle',
        failed: 'fas fa-times-circle'
      };
      return icons[status] || 'fas fa-question-circle';
    },

    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return date.toLocaleTimeString('fr-FR');
    }
  }
};
</script>

<style scoped>
.youtube-downloader {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: #ff0000;
  font-size: 2.5em;
  margin: 0 0 10px 0;
}

.page-header h1 i {
  margin-right: 15px;
}

.page-header p {
  color: #718096;
  font-size: 1.1em;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  margin: 0 0 20px 0;
  color: #2d3748;
  font-size: 1.5em;
}

.card-title i {
  margin-right: 10px;
  color: #667eea;
}

.alert-warning {
  border-left: 4px solid #ed8936;
  background: #fffaf0;
}

.install-guide {
  margin-top: 20px;
}

.install-guide pre {
  background: #2d3748;
  color: #48bb78;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
}

/* YouTube Player */
.youtube-player h3 {
  margin: 0 0 15px 0;
  color: #2d3748;
  font-size: 1.3em;
}

.youtube-player h3 i {
  color: #ff0000;
  margin-right: 10px;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  border-radius: 8px;
  background: #000;
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.download-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #4a5568;
}

.form-group small {
  color: #a0aec0;
  font-size: 0.9em;
}

.form-input {
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1em;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-group {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
}

.btn:hover {
  border-color: #667eea;
  background: #f7fafc;
}

.btn-primary {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.btn-large {
  padding: 15px 30px;
  font-size: 1.1em;
}

.btn-success {
  background: #48bb78;
  border-color: #48bb78;
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.metadata-section {
  background: #f7fafc;
  padding: 20px;
  border-radius: 8px;
}

.metadata-section h3 {
  margin: 0 0 15px 0;
  color: #4a5568;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.slider {
  width: 100%;
}

.energy-value {
  font-weight: bold;
  color: #667eea;
  font-size: 1.2em;
}

/* Active Downloads */
.active-downloads .card-title {
  color: #3182ce;
}

.downloads-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.download-item {
  padding: 15px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s;
}

.download-item.status-downloading {
  border-color: #3182ce;
  background: rgba(49, 130, 206, 0.05);
}

.download-item.status-completed {
  border-color: #48bb78;
  background: rgba(72, 187, 120, 0.05);
}

.download-item.status-failed {
  border-color: #f56565;
  background: rgba(245, 101, 101, 0.05);
}

.download-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.download-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.download-url {
  font-weight: 600;
  color: #2d3748;
  word-break: break-all;
}

.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9em;
  font-weight: 600;
}

.badge-success {
  background: #48bb78;
  color: white;
}

.badge-danger {
  background: #f56565;
  color: white;
}

.badge-info {
  background: #3182ce;
  color: white;
}

.progress-bar-container {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #48bb78);
  transition: width 0.3s;
}

.download-error {
  color: #f56565;
  margin-top: 10px;
  font-size: 0.9em;
}

.download-success {
  color: #48bb78;
  margin-top: 10px;
  font-size: 0.9em;
}

/* Recent Downloads */
.recent-downloads .card-title {
  color: #718096;
}

.no-downloads {
  color: #a0aec0;
  text-align: center;
  padding: 20px;
  font-style: italic;
}

.completed-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.completed-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #f7fafc;
  border-radius: 6px;
}

.text-success {
  color: #48bb78;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .btn-group {
    flex-direction: column;
  }

  .page-header h1 {
    font-size: 2em;
  }
}
</style>
