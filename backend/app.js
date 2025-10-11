const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const http = require('http');
const socketIo = require('socket.io');

// Import routes
const matchRoutes = require('./routes/matchRoutes');
const personnelRoutes = require('./routes/personnelRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

const PORT = process.env.PORT || 3001;

// ======================
// MIDDLEWARE
// ======================

app.use(cors());
app.use(express.json());

// Fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/static', express.static(path.join(__dirname, '../static')));

// Musiques - Servir depuis OneDrive
app.use('/audio/songs', express.static('C:\\Users\\JulienFernandez\\OneDrive\\Zic impro'));

// ======================
// DONNÉES EN MÉMOIRE
// ======================

let musicLibrary = [];

// ======================
// INITIALISATION DONNÉES
// ======================

async function initializeData() {
  console.log('🔄 Initialisation des données...');

  // Charger la bibliothèque musicale
  try {
    const musicData = await fs.readFile(path.join(__dirname, '../music_library.json'), 'utf8');
    const musicLibraryData = JSON.parse(musicData);
    musicLibrary = musicLibraryData.tracks || [];
    console.log(`📚 Bibliothèque musicale chargée: ${musicLibrary.length} pistes`);
  } catch (error) {
    console.warn('⚠️  Aucune bibliothèque musicale trouvée');
    musicLibrary = [];
  }

  // Vérifier que les dossiers de données existent
  await fs.mkdir(path.join(__dirname, '../data'), { recursive: true });
  await fs.mkdir(path.join(__dirname, '../uploads'), { recursive: true });

  console.log('✅ Initialisation terminée\n');
}

// ======================
// ROUTES API
// ======================

// Routes matchs
app.use('/api/matches', matchRoutes);

// Routes personnel
app.use('/api/personnel', personnelRoutes);

// Route bibliothèque musicale
app.get('/api/music', (req, res) => {
  try {
    let filtered = musicLibrary;

    // Filtres query params (à implémenter en Sprint 4)
    if (req.query.scenarios) {
      // TODO: Filtrer par scenarios
    }
    if (req.query.tempo_min || req.query.tempo_max) {
      // TODO: Filtrer par tempo
    }
    if (req.query.search) {
      // TODO: Recherche texte
    }

    res.json(filtered);
  } catch (error) {
    console.error('Error fetching music:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la bibliothèque musicale' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    musicLibraryLoaded: musicLibrary.length > 0,
    musicCount: musicLibrary.length
  });
});

// ======================
// WEBSOCKET (MODE LIVE)
// ======================

io.on('connection', (socket) => {
  console.log('✅ Client connecté:', socket.id);

  // Rejoindre un match
  socket.on('join_match', (data) => {
    const { matchId, role } = data;
    socket.join(`match_${matchId}`);
    console.log(`📍 Client ${socket.id} (${role}) a rejoint le match ${matchId}`);
  });

  // Mode Live activé
  socket.on('live_mode_activated', (data) => {
    socket.to(`match_${data.matchId}`).emit('live_mode_activated', data);
    console.log(`🔴 Mode Live activé pour match ${data.matchId}`);
  });

  // Ligne démarrée
  socket.on('line_started', (data) => {
    socket.to(`match_${data.matchId}`).emit('line_started', data);
    console.log(`▶️  Ligne ${data.lineId} démarrée (match ${data.matchId})`);
  });

  // Mise à jour chrono
  socket.on('chrono_update', (data) => {
    socket.to(`match_${data.matchId}`).emit('chrono_update', data);
    // Ne pas logger chaque seconde (trop verbeux)
  });

  // Ligne terminée
  socket.on('line_completed', (data) => {
    socket.to(`match_${data.matchId}`).emit('line_completed', data);
    console.log(`⏹️  Ligne ${data.lineId} terminée (match ${data.matchId})`);
  });

  // Musique assignée (synchronisation)
  socket.on('music_assigned', (data) => {
    socket.to(`match_${data.matchId}`).emit('music_assigned', data);
  });

  // Musique jouée (synchronisation)
  socket.on('music_play', (data) => {
    socket.to(`match_${data.matchId}`).emit('music_play', data);
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log('❌ Client déconnecté:', socket.id);
  });
});

// Exposer io pour l'utiliser dans les controllers si besoin
app.set('io', io);

// ======================
// ROUTE CATCH-ALL (SPA)
// ======================

// Cette route doit être la dernière
app.get('*', (req, res) => {
  // Ne pas servir le SPA pour les routes API
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Route API non trouvée' });
  }
  res.sendFile(path.join(__dirname, '../static/index.html'));
});

// ======================
// DÉMARRAGE SERVEUR
// ======================

initializeData().then(() => {
  server.listen(PORT, () => {
    console.log('\n========================================');
    console.log('🎭 IMPRO MANAGER v2.0');
    console.log('========================================');
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`🌐 API: http://localhost:${PORT}/api`);
    console.log(`🎵 Interface MC: http://localhost:${PORT}/mc`);
    console.log(`🔊 Interface Son: http://localhost:${PORT}/sound`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log('========================================\n');
  });
}).catch(error => {
  console.error('❌ Erreur lors de l\'initialisation:', error);
  process.exit(1);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});
