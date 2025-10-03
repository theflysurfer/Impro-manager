<template>
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
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    currentMode() {
      const path = this.$route.path;
      if (path.startsWith('/mc')) return 'MC';
      if (path.startsWith('/sound')) return 'Son';
      return 'Accueil';
    }
  }
}
</script>

<style>
.nav-links {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.nav-links .btn {
  text-decoration: none;
}

.router-link-active {
  background: #48bb78 !important;
}

.router-link-active:hover {
  background: #38a169 !important;
}
</style>