import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import MCInterface from './components/MCInterface.vue'
import SoundInterface from './components/SoundInterface.vue'
import MusicLibrary from './components/MusicLibrary.vue'
import Home from './components/Home.vue'
import MCLive from './components/MCLive.vue'
import SoundLive from './components/SoundLive.vue'

import './style.css'

// Configuration du routeur
const routes = [
  { path: '/', component: Home },
  { path: '/mc', component: MCInterface },
  { path: '/mc/:matchId', component: MCInterface, props: true },
  { path: '/sound', component: SoundInterface },
  { path: '/sound/:matchId', component: SoundInterface, props: true },
  { path: '/music', component: MusicLibrary },
  // Live Mode routes
  { path: '/matches/:matchId/live/mc', component: MCLive, props: true },
  { path: '/matches/:matchId/live/sound', component: SoundLive, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')