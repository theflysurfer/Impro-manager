<template>
  <div class="music-filters">
    <h2 class="filters-title">
      <i class="fas fa-filter"></i>
      Filtres
    </h2>

    <!-- Recherche Texte -->
    <div class="filter-section">
      <label class="filter-label">
        <i class="fas fa-search"></i>
        Recherche
      </label>
      <input
        type="text"
        v-model="localFilters.search"
        @input="debouncedUpdate"
        class="filter-input"
        placeholder="Titre, artiste..."
      />
    </div>

    <!-- Genres -->
    <div class="filter-section">
      <label class="filter-label">
        <i class="fas fa-music"></i>
        Genres
      </label>
      <div class="filter-options">
        <label class="checkbox-label" v-for="genre in availableGenres" :key="genre">
          <input
            type="checkbox"
            :value="genre"
            v-model="localFilters.genres"
            @change="emitFilters"
          />
          <span>{{ genre }}</span>
        </label>
      </div>
    </div>

    <!-- Scenarios -->
    <div class="filter-section">
      <label class="filter-label">
        <i class="fas fa-theater-masks"></i>
        Scénarios
      </label>
      <div class="filter-options">
        <label class="checkbox-label" v-for="scenario in availableScenarios.slice(0, 10)" :key="scenario">
          <input
            type="checkbox"
            :value="scenario"
            v-model="localFilters.scenarios"
            @change="emitFilters"
          />
          <span>{{ scenario }}</span>
        </label>
      </div>
    </div>

    <!-- Énergie -->
    <div class="filter-section">
      <label class="filter-label">
        <i class="fas fa-bolt"></i>
        Énergie ({{ localFilters.energyMin }} - {{ localFilters.energyMax }})
      </label>
      <div class="range-inputs">
        <input
          type="range"
          min="1"
          max="10"
          v-model.number="localFilters.energyMin"
          @input="emitFilters"
          class="filter-range"
        />
        <input
          type="range"
          min="1"
          max="10"
          v-model.number="localFilters.energyMax"
          @input="emitFilters"
          class="filter-range"
        />
      </div>
    </div>

    <!-- Tempo -->
    <div class="filter-section">
      <label class="filter-label">
        <i class="fas fa-tachometer-alt"></i>
        Tempo
      </label>
      <div class="filter-options">
        <label class="checkbox-label" v-for="tempo in availableTempos" :key="tempo">
          <input
            type="checkbox"
            :value="tempo"
            v-model="localFilters.tempos"
            @change="emitFilters"
          />
          <span>{{ tempo }}</span>
        </label>
      </div>
    </div>

    <!-- Reset -->
    <button class="btn-reset" @click="resetFilters">
      <i class="fas fa-undo"></i>
      Réinitialiser
    </button>
  </div>
</template>

<script>
export default {
  name: 'MusicFilters',
  props: {
    filters: {
      type: Object,
      default: () => ({
        search: '',
        genres: [],
        scenarios: [],
        tempos: [],
        energyMin: 1,
        energyMax: 10
      })
    },
    availableGenres: {
      type: Array,
      default: () => []
    },
    availableScenarios: {
      type: Array,
      default: () => []
    },
    availableTempos: {
      type: Array,
      default: () => ['slow', 'medium', 'fast']
    }
  },
  emits: ['update:filters'],
  data() {
    return {
      localFilters: { ...this.filters },
      debounceTimeout: null
    }
  },
  methods: {
    emitFilters() {
      this.$emit('update:filters', this.localFilters);
    },
    debouncedUpdate() {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.emitFilters();
      }, 300);
    },
    resetFilters() {
      this.localFilters = {
        search: '',
        genres: [],
        scenarios: [],
        tempos: [],
        energyMin: 1,
        energyMax: 10
      };
      this.emitFilters();
    }
  },
  watch: {
    filters: {
      handler(newFilters) {
        this.localFilters = { ...newFilters };
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.music-filters {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.filters-title {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-section {
  margin-bottom: 24px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
}

.filter-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.filter-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #4a5568;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.checkbox-label:hover {
  background: #f7fafc;
}

.checkbox-label input[type="checkbox"] {
  cursor: pointer;
}

.range-inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-range {
  width: 100%;
  cursor: pointer;
}

.btn-reset {
  width: 100%;
  padding: 10px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #4a5568;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;
}

.btn-reset:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

/* Scrollbar styling */
.filter-options::-webkit-scrollbar {
  width: 6px;
}

.filter-options::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 3px;
}

.filter-options::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.filter-options::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
