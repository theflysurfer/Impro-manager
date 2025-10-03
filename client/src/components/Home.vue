<template>
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
            <router-link :to="`/mc/${match.id}`" class="btn btn-small">
              <i class="fas fa-edit"></i> Gérer (MC)
            </router-link>
            <router-link :to="`/sound/${match.id}`" class="btn btn-small btn-secondary">
              <i class="fas fa-volume-up"></i> Son
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      matches: []
    }
  },
  async mounted() {
    await this.loadMatches();
  },
  methods: {
    async loadMatches() {
      try {
        const response = await fetch('/api/matches');
        this.matches = await response.json();
      } catch (error) {
        console.error('Erreur lors du chargement des matchs:', error);
      }
    },
    getStatusClass(status) {
      const classes = {
        'active': 'bg-success text-white',
        'completed': 'bg-secondary text-white',
        'draft': 'bg-warning text-white'
      };
      return classes[status] || 'bg-secondary text-white';
    },
    getStatusText(status) {
      const texts = {
        'active': 'En cours',
        'completed': 'Terminé',
        'draft': 'Brouillon'
      };
      return texts[status] || 'Inconnu';
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
    }
  }
}
</script>

<style scoped>
.hero {
  text-align: center;
  margin-bottom: 30px;
}

.feature h4 {
  margin-bottom: 10px;
  color: #4a5568;
}

.feature p {
  color: #718096;
  line-height: 1.5;
}

.bg-success {
  background: #48bb78;
}

.bg-secondary {
  background: #718096;
}

.bg-warning {
  background: #ed8936;
}

.text-white {
  color: white;
}
</style>