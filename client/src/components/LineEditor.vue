<template>
  <div class="line-editor">
    <!-- Type Selection -->
    <div class="form-group">
      <label>Type de ligne</label>
      <select v-model="localLine.type" @change="onTypeChange" class="form-input">
        <option value="ARRIVÉE">📍 Arrivée</option>
        <option value="ÉCHAUFFEMENT">🤸 Échauffement Public</option>
        <option value="PRÉSENTATION">👋 Présentation Équipes</option>
        <option value="SEQUENCE">🎭 Séquence d'Impro</option>
        <option value="ANNONCE_INTERMEDIAIRE">📢 Annonce Intermédiaire</option>
        <option value="PAUSE">☕ Pause / Entracte</option>
        <option value="ANNONCE_FIN">🏁 Annonce Fin</option>
        <option value="FIN">✨ Fin de Match</option>
      </select>
    </div>

    <!-- Common Fields -->
    <div class="form-group">
      <label>Titre</label>
      <input v-model="localLine.title" type="text" class="form-input" placeholder="Ex: Arrivée Arbitre" />
    </div>

    <div class="form-group">
      <label>Durée prévue (secondes)</label>
      <input v-model.number="localLine.duration_planned" type="number" class="form-input" min="0" step="30" />
      <small>{{ formatDuration(localLine.duration_planned) }}</small>
    </div>

    <!-- Type-specific Fields -->
    <div v-if="localLine.type === 'ARRIVÉE'" class="type-specific">
      <div class="form-group">
        <label>Qui arrive ?</label>
        <select v-model="localLine.who" class="form-input">
          <option value="arbitre">Arbitre</option>
          <option value="team_home">Équipe A</option>
          <option value="team_away">Équipe B</option>
          <option value="mc">MC</option>
          <option value="sound">Régisseur Son</option>
          <option value="public">Public</option>
        </select>
      </div>
      <div class="form-group">
        <label>Heure prévue</label>
        <input v-model="localLine.scheduled_time" type="time" class="form-input" />
      </div>
    </div>

    <div v-if="localLine.type === 'ÉCHAUFFEMENT'" class="type-specific">
      <div class="form-group">
        <label>Type d'échauffement</label>
        <select v-model="localLine.warmup_type" class="form-input">
          <option value="public">Avec le public</option>
          <option value="teams">Entre équipes</option>
          <option value="all">Tous ensemble</option>
        </select>
      </div>
    </div>

    <div v-if="localLine.type === 'PRÉSENTATION'" class="type-specific">
      <div class="form-group">
        <label>Ordre de présentation</label>
        <select v-model="localLine.presentation_order" class="form-input">
          <option value="home_first">Équipe A puis Équipe B</option>
          <option value="away_first">Équipe B puis Équipe A</option>
          <option value="together">Les deux ensemble</option>
        </select>
      </div>
    </div>

    <div v-if="localLine.type === 'SEQUENCE'" class="type-specific">
      <div class="form-group">
        <label>Thème / Catégorie</label>
        <input v-model="localLine.theme" type="text" class="form-input" placeholder="Ex: Western, Romance, Action..." />
      </div>
      <div class="form-group">
        <label>Contrainte (optionnel)</label>
        <input v-model="localLine.constraint" type="text" class="form-input" placeholder="Ex: Sans paroles, 1 réplique..." />
      </div>
      <div class="form-group">
        <label>Format</label>
        <select v-model="localLine.format" class="form-input">
          <option value="compared">Comparée (2 équipes séparées)</option>
          <option value="mixed">Mixte (équipes mélangées)</option>
          <option value="caucus">Caucus (tout le monde)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Nombre de joueurs par équipe</label>
        <input v-model.number="localLine.players_count" type="number" class="form-input" min="1" max="10" />
      </div>
    </div>

    <div v-if="localLine.type === 'ANNONCE_INTERMEDIAIRE'" class="type-specific">
      <div class="form-group">
        <label>Type d'annonce</label>
        <select v-model="localLine.announcement_type" class="form-input">
          <option value="score">Score partiel</option>
          <option value="info">Information</option>
          <option value="other">Autre</option>
        </select>
      </div>
      <div class="form-group">
        <label>Contenu (notes)</label>
        <textarea v-model="localLine.content" class="form-input" rows="3" placeholder="Notes pour l'annonce..."></textarea>
      </div>
    </div>

    <div v-if="localLine.type === 'PAUSE'" class="type-specific">
      <div class="form-group">
        <label>Type de pause</label>
        <select v-model="localLine.pause_type" class="form-input">
          <option value="break">Pause courte (5-10 min)</option>
          <option value="intermission">Entracte (15-20 min)</option>
        </select>
      </div>
    </div>

    <div v-if="localLine.type === 'ANNONCE_FIN'" class="type-specific">
      <div class="form-group">
        <label>Type d'annonce finale</label>
        <select v-model="localLine.final_announcement_type" class="form-input">
          <option value="score">Annonce score final</option>
          <option value="thanks">Remerciements</option>
          <option value="next_event">Prochain événement</option>
        </select>
      </div>
      <div class="form-group">
        <label>Contenu (notes)</label>
        <textarea v-model="localLine.content" class="form-input" rows="3" placeholder="Notes pour l'annonce..."></textarea>
      </div>
    </div>

    <div v-if="localLine.type === 'FIN'" class="type-specific">
      <div class="form-group">
        <label>Heure de fin prévue</label>
        <input v-model="localLine.end_time" type="time" class="form-input" />
      </div>
    </div>

    <!-- Remarks (all types) -->
    <div class="form-group">
      <label>Remarques (optionnel)</label>
      <textarea v-model="localLine.remarks" class="form-input" rows="2" placeholder="Notes additionnelles..."></textarea>
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <button @click="save" class="btn btn-primary">
        <i class="fas fa-save"></i> Sauvegarder
      </button>
      <button @click="cancel" class="btn btn-secondary">
        Annuler
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LineEditor',
  props: {
    line: {
      type: Object,
      default: null
    }
  },
  emits: ['save', 'cancel'],
  data() {
    return {
      localLine: this.getDefaultLine()
    }
  },
  watch: {
    line: {
      handler(newVal) {
        if (newVal) {
          this.localLine = { ...this.getDefaultLine(), ...newVal }
        } else {
          this.localLine = this.getDefaultLine()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getDefaultLine() {
      return {
        line_id: `line_${Date.now()}`,
        type: 'SEQUENCE',
        title: '',
        duration_planned: 180,
        theme: null,
        constraint: null,
        format: 'compared',
        players_count: 2,
        music: {
          intro: null,
          outro: null,
          transition: null
        },
        status: 'pending',
        remarks: '',
        // Type-specific defaults
        who: 'arbitre',
        scheduled_time: '',
        warmup_type: 'public',
        presentation_order: 'home_first',
        announcement_type: 'score',
        content: '',
        pause_type: 'break',
        final_announcement_type: 'score',
        end_time: ''
      }
    },
    onTypeChange() {
      // Set default titles based on type
      const defaultTitles = {
        'ARRIVÉE': 'Arrivée',
        'ÉCHAUFFEMENT': 'Échauffement Public',
        'PRÉSENTATION': 'Présentation Équipes',
        'SEQUENCE': 'Séquence',
        'ANNONCE_INTERMEDIAIRE': 'Annonce Intermédiaire',
        'PAUSE': 'Pause',
        'ANNONCE_FIN': 'Annonce Finale',
        'FIN': 'Fin de Match'
      }

      if (!this.localLine.title || this.localLine.title === '') {
        this.localLine.title = defaultTitles[this.localLine.type] || ''
      }

      // Set default durations
      const defaultDurations = {
        'ARRIVÉE': 300,
        'ÉCHAUFFEMENT': 600,
        'PRÉSENTATION': 300,
        'SEQUENCE': 180,
        'ANNONCE_INTERMEDIAIRE': 60,
        'PAUSE': 900,
        'ANNONCE_FIN': 120,
        'FIN': 60
      }

      this.localLine.duration_planned = defaultDurations[this.localLine.type] || 180
    },
    formatDuration(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${String(secs).padStart(2, '0')}`
    },
    save() {
      this.$emit('save', { ...this.localLine })
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
.line-editor {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #4a5568;
  font-weight: 600;
  font-size: 0.9em;
}

.form-group small {
  display: block;
  margin-top: 4px;
  color: #a0aec0;
  font-size: 0.85em;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 1em;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

select.form-input {
  cursor: pointer;
}

textarea.form-input {
  resize: vertical;
  font-family: inherit;
}

.type-specific {
  padding: 15px;
  background: #f7fafc;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #cbd5e0;
}
</style>
