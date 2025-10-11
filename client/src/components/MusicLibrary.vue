<template>
  <div class="music-library">
    <div class="library-header">
      <h1 class="library-title">
        <i class="fas fa-compact-disc"></i>
        Bibliothèque Musicale
      </h1>
      <div class="library-stats">
        <span class="stat">
          <i class="fas fa-music"></i>
          {{ filteredTracks.length }} / {{ allTracks.length }} pistes
        </span>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Chargement de la bibliothèque musicale...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-triangle"></i>
      <p>{{ error }}</p>
      <button class="btn-retry" @click="loadMusicLibrary">
        <i class="fas fa-redo"></i>
        Réessayer
      </button>
    </div>

    <div v-else class="library-content">
      <!-- Filters Sidebar -->
      <aside class="library-sidebar">
        <MusicFilters
          :filters="filters"
          @update:filters="updateFilters"
          :available-genres="availableGenres"
          :available-scenarios="availableScenarios"
        />
      </aside>

      <!-- Music Grid -->
      <main class="library-main">
        <div v-if="filteredTracks.length === 0" class="no-results">
          <i class="fas fa-search"></i>
          <p>Aucune piste ne correspond à vos critères</p>
          <button class="btn" @click="resetFilters">
            Réinitialiser les filtres
          </button>
        </div>

        <div v-else class="music-grid">
          <MusicCard
            v-for="track in paginatedTracks"
            :key="track.id"
            :track="track"
            @play="playTrack"
            @select="selectTrack"
          />
        </div>

        <!-- Pagination -->
        <div class="pagination" v-if="totalPages > 1">
          <button
            class="btn-page"
            @click="previousPage"
            :disabled="currentPage === 1"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="page-info">
            Page {{ currentPage }} / {{ totalPages }}
          </span>
          <button
            class="btn-page"
            @click="nextPage"
            :disabled="currentPage === totalPages"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </main>
    </div>

    <!-- Audio Player (Fixed Bottom) -->
    <AudioPlayer
      ref="audioPlayer"
      :track="selectedTrack"
      @ended="onTrackEnded"
    />
  </div>
</template>

<script>
import MusicCard from './music/MusicCard.vue';
import MusicFilters from './music/MusicFilters.vue';
import AudioPlayer from './music/AudioPlayer.vue';

export default {
  name: 'MusicLibrary',
  components: {
    MusicCard,
    MusicFilters,
    AudioPlayer
  },
  data() {
    return {
      allTracks: [],
      filteredTracks: [],
      selectedTrack: null,
      loading: true,
      error: null,
      filters: {
        search: '',
        genres: [],
        scenarios: [],
        tempos: [],
        energyMin: 1,
        energyMax: 10
      },
      currentPage: 1,
      tracksPerPage: 24
    }
  },
  computed: {
    availableGenres() {
      const genres = new Set();
      this.allTracks.forEach(track => {
        if (track.tags?.genre) {
          track.tags.genre.forEach(g => genres.add(g));
        }
      });
      return Array.from(genres).sort();
    },
    availableScenarios() {
      const scenarios = new Set();
      this.allTracks.forEach(track => {
        if (track.impro_context?.scenarios) {
          track.impro_context.scenarios.forEach(s => scenarios.add(s));
        }
      });
      return Array.from(scenarios).sort();
    },
    paginatedTracks() {
      const start = (this.currentPage - 1) * this.tracksPerPage;
      const end = start + this.tracksPerPage;
      return this.filteredTracks.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredTracks.length / this.tracksPerPage);
    }
  },
  methods: {
    async loadMusicLibrary() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch('http://localhost:3001/api/music');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement de la bibliothèque');
        }
        this.allTracks = await response.json();
        this.filteredTracks = [...this.allTracks];
      } catch (err) {
        this.error = err.message;
        console.error('Error loading music library:', err);
      } finally {
        this.loading = false;
      }
    },
    updateFilters(newFilters) {
      this.filters = newFilters;
      this.applyFilters();
      this.currentPage = 1; // Reset to first page
    },
    applyFilters() {
      this.filteredTracks = this.allTracks.filter(track => {
        // Search filter
        if (this.filters.search) {
          const search = this.filters.search.toLowerCase();
          const matchTitle = track.title?.toLowerCase().includes(search);
          const matchArtist = track.artist?.toLowerCase().includes(search);
          const matchFilename = track.filename?.toLowerCase().includes(search);
          if (!matchTitle && !matchArtist && !matchFilename) {
            return false;
          }
        }

        // Genres filter
        if (this.filters.genres.length > 0) {
          const hasGenre = track.tags?.genre?.some(g =>
            this.filters.genres.includes(g)
          );
          if (!hasGenre) return false;
        }

        // Scenarios filter
        if (this.filters.scenarios.length > 0) {
          const hasScenario = track.impro_context?.scenarios?.some(s =>
            this.filters.scenarios.includes(s)
          );
          if (!hasScenario) return false;
        }

        // Tempos filter
        if (this.filters.tempos.length > 0) {
          if (!this.filters.tempos.includes(track.tags?.tempo)) {
            return false;
          }
        }

        // Energy filter
        const energy = track.tags?.energy || 5;
        if (energy < this.filters.energyMin || energy > this.filters.energyMax) {
          return false;
        }

        return true;
      });
    },
    resetFilters() {
      this.filters = {
        search: '',
        genres: [],
        scenarios: [],
        tempos: [],
        energyMin: 1,
        energyMax: 10
      };
      this.applyFilters();
    },
    playTrack(track) {
      this.selectedTrack = track;
    },
    selectTrack(track) {
      this.selectedTrack = track;
    },
    onTrackEnded() {
      // Optional: Auto-play next track
      console.log('Track ended');
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  },
  mounted() {
    this.loadMusicLibrary();
  }
}
</script>

<style scoped>
.music-library {
  padding-bottom: 200px; /* Space for fixed player */
}

.library-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.library-title {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.library-stats {
  display: flex;
  gap: 16px;
}

.stat {
  font-size: 14px;
  color: #718096;
  display: flex;
  align-items: center;
  gap: 6px;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 60px 20px;
}

.loading-state i {
  font-size: 48px;
  color: #4299e1;
  margin-bottom: 16px;
}

.error-state i {
  font-size: 48px;
  color: #f56565;
  margin-bottom: 16px;
}

.loading-state p,
.error-state p {
  font-size: 16px;
  color: #718096;
  margin-bottom: 16px;
}

.btn-retry {
  padding: 10px 20px;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-retry:hover {
  background: #3182ce;
}

.library-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
}

.library-sidebar {
  /* Sticky positioning handled in MusicFilters component */
}

.library-main {
  min-width: 0;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
}

.no-results i {
  font-size: 48px;
  color: #cbd5e0;
  margin-bottom: 16px;
}

.no-results p {
  font-size: 16px;
  color: #718096;
  margin-bottom: 16px;
}

.music-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
}

.btn-page {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  background: white;
  color: #4a5568;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-page:hover:not(:disabled) {
  background: #4299e1;
  border-color: #4299e1;
  color: white;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #718096;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 1024px) {
  .library-content {
    grid-template-columns: 1fr;
  }

  .library-sidebar {
    position: static !important;
  }
}

@media (max-width: 768px) {
  .music-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }

  .library-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
