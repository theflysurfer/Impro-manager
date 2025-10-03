const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/static', express.static(path.join(__dirname, '../static')));
app.use('/music', express.static('C:\\Users\\JulienFernandez\\OneDrive\\Zic impro'));
app.use(express.static(path.join(__dirname, '../static')));

// Données JSON en mémoire
let matches = [];
let musicLibrary = [];
let templates = [];

// Initialisation des données
async function initializeData() {
  try {
    // Charger les données existantes ou créer des exemples
    const matchesData = await fs.readFile(path.join(__dirname, '../data/matches.json'), 'utf8');
    matches = JSON.parse(matchesData);
  } catch (error) {
    console.log('Création des données d\'exemple...');
    await createSampleData();
  }

  // Charger la vraie bibliothèque musicale
  try {
    const musicData = await fs.readFile(path.join(__dirname, '../music_library.json'), 'utf8');
    const musicLibraryData = JSON.parse(musicData);
    musicLibrary = musicLibraryData.tracks || [];
    console.log(`📚 Bibliothèque musicale chargée: ${musicLibrary.length} pistes`);
  } catch (error) {
    console.log('📚 Aucune bibliothèque musicale trouvée, utilisation des données d\'exemple');
  }

  // Charger les templates
  try {
    const templatesData = await fs.readFile(path.join(__dirname, '../data/templates.json'), 'utf8');
    templates = JSON.parse(templatesData);
  } catch (error) {
    console.log('Aucun template trouvé, utilisation des templates par défaut');
  }
}

async function createSampleData() {
  // Créer le dossier data s'il n'existe pas
  await fs.mkdir(path.join(__dirname, '../data'), { recursive: true });
  await fs.mkdir(path.join(__dirname, '../uploads'), { recursive: true });

  // Données d'exemple
  matches = [{
    id: 'match-001',
    title: 'Match vs Les Fous du Rire',
    date: new Date().toISOString(),
    teamA: { name: 'Notre Troupe', score: 0 },
    teamB: { name: 'Les Fous du Rire', score: 0 },
    improvs: [
      {
        id: 'improv-001',
        title: 'Libre',
        duration: 120,
        status: 'pending',
        music: null,
        theme: ''
      }
    ],
    status: 'active'
  }];

  musicLibrary = [{
    id: 'music-001',
    filename: 'jazz-cool-cafe.mp3',
    title: 'Jazz Cool Café',
    artist: 'Django\'s Cats',
    duration: 245,
    cues: {
      start: 0,
      hook: 32,
      climax: 98,
      outro: 210,
      fade_duration: 8
    },
    tags: {
      mood: ['énergique', 'joyeux', 'décontracté'],
      genre: ['jazz', 'swing'],
      energy: 7,
      tempo: 'medium',
      instruments: ['piano', 'contrebasse', 'batterie']
    },
    impro_context: {
      scenarios: ['café', 'années-20', 'détective'],
      emotions: ['nostalgie', 'légèreté', 'sophistication'],
      contraintes: ['objets', 'lieux', 'époque'],
      avoid_with: ['médiéval', 'futuriste']
    },
    technical: {
      volume_boost: 0.8,
      has_lyrics: false,
      loop_friendly: true,
      fade_in: true,
      fade_out: true
    }
  }];

  templates = [{
    id: 'template-match-classique',
    name: 'Match Classique',
    description: 'Structure standard de match d\'impro',
    improvs: [
      { title: 'Libre', duration: 120, type: 'libre' },
      { title: 'Contrainte', duration: 180, type: 'contrainte' },
      { title: 'Émotion', duration: 120, type: 'emotion' },
      { title: 'Finale', duration: 240, type: 'finale' }
    ]
  }];

  // Sauvegarder
  await saveData();
}

async function saveData() {
  await fs.writeFile(path.join(__dirname, '../data/matches.json'), JSON.stringify(matches, null, 2));
  await fs.writeFile(path.join(__dirname, '../data/music.json'), JSON.stringify(musicLibrary, null, 2));
  await fs.writeFile(path.join(__dirname, '../data/templates.json'), JSON.stringify(templates, null, 2));
}

// Routes API
app.get('/api/matches', (req, res) => {
  res.json(matches);
});

app.get('/api/matches/:id', (req, res) => {
  const match = matches.find(m => m.id === req.params.id);
  if (!match) return res.status(404).json({ error: 'Match non trouvé' });
  res.json(match);
});

app.post('/api/matches', async (req, res) => {
  const newMatch = {
    id: 'match-' + Date.now(),
    ...req.body,
    date: new Date().toISOString()
  };
  matches.push(newMatch);
  await saveData();

  // Broadcast aux clients connectés
  io.emit('match-created', newMatch);

  res.json(newMatch);
});

app.put('/api/matches/:id', async (req, res) => {
  const index = matches.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Match non trouvé' });

  matches[index] = { ...matches[index], ...req.body };
  await saveData();

  // Broadcast aux clients connectés
  io.emit('match-updated', matches[index]);

  res.json(matches[index]);
});

app.get('/api/music', (req, res) => {
  res.json(musicLibrary);
});

app.get('/api/templates', (req, res) => {
  res.json(templates);
});

// WebSocket pour synchronisation temps réel
io.on('connection', (socket) => {
  console.log('Client connecté:', socket.id);

  socket.on('join-match', (matchId) => {
    socket.join(`match-${matchId}`);
    console.log(`Client ${socket.id} a rejoint le match ${matchId}`);
  });

  socket.on('music-assigned', (data) => {
    socket.to(`match-${data.matchId}`).emit('music-assigned', data);
  });

  socket.on('music-play', (data) => {
    socket.to(`match-${data.matchId}`).emit('music-play', data);
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });
});

// Route catch-all pour le SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../static/index.html'));
});

// Démarrage
initializeData().then(() => {
  server.listen(PORT, () => {
    console.log(`🎭 Serveur Impro Manager démarré sur le port ${PORT}`);
    console.log(`🎵 Interface MC: http://localhost:${PORT}/mc`);
    console.log(`🔊 Interface Son: http://localhost:${PORT}/sound`);
  });
});