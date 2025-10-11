import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import MCInterface from './components/MCInterface.vue'
import SoundInterface from './components/SoundInterface.vue'
import MusicLibrary from './components/MusicLibrary.vue'
import Home from './components/Home.vue'

import './style.css'

// Configuration du routeur
const routes = [
  { path: '/', component: Home },
  { path: '/mc', component: MCInterface },
  { path: '/mc/:matchId', component: MCInterface, props: true },
  { path: '/sound', component: SoundInterface },
  { path: '/sound/:matchId', component: SoundInterface, props: true },
  { path: '/music', component: MusicLibrary }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')