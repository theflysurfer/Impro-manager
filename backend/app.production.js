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

// Socket.IO configuration for production
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins in production (behind Nginx)
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

const PORT = process.env.PORT || 3001;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ======================
// MIDDLEWARE
// ======================

app.use(cors());
app.use(express.json());

// Trust proxy (behind Nginx)
app.set('trust proxy', 1);

// Fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Musiques - Servir depuis le volume Docker (rclone mount)
app.use('/audio/songs', express.static('/app/public/music'));

// Servir le frontend buildé (production)
if (IS_PRODUCTION) {
  app.use(express.static(path.join(__dirname, 'public/client')));
}

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
    const musicData = await fs.readFile(path.join(__dirname, '../data/music/music_library.json'), 'utf8');
    const musicLibraryData = JSON.parse(musicData);
    musicLibrary = musicLibraryData.tracks || [];
    console.log(`📚 Bibliothèque musicale chargée: ${musicLibrary.length} pistes`);
  } catch (error) {
    console.warn('⚠️  Aucune bibliothèque musicale trouvée');
    musicLibrary = [];
  }

  // Vérifier que les dossiers de données existent
  await fs.mkdir(path.join(__dirname, '../data/matches'), { recursive: true });
  await fs.mkdir(path.join(__dirname, '../data/personnel'), { recursive: true });
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

    // Filtres query params
    if (req.query.scenarios) {
      const scenarios = req.query.scenarios.split(',');
      filtered = filtered.filter(track =>
        track.scenarios && track.scenarios.some(s => scenarios.includes(s))
      );
    }

    if (req.query.tempo_min) {
      const minTempo = parseInt(req.query.tempo_min);
      filtered = filtered.filter(track => track.tempo >= minTempo);
    }

    if (req.query.tempo_max) {
      const maxTempo = parseInt(req.query.tempo_max);
      filtered = filtered.filter(track => track.tempo <= maxTempo);
    }

    if (req.query.search) {
      const searchLower = req.query.search.toLowerCase();
      filtered = filtered.filter(track =>
        (track.title && track.title.toLowerCase().includes(searchLower)) ||
        (track.artist && track.artist.toLowerCase().includes(searchLower))
      );
    }

    if (req.query.vocal !== undefined) {
      const isVocal = req.query.vocal === 'true';
      filtered = filtered.filter(track => track.vocal === isVocal);
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
    environment: process.env.NODE_ENV || 'development',
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
  });

  // Ligne terminée
  socket.on('line_completed', (data) => {
    socket.to(`match_${data.matchId}`).emit('line_completed', data);
    console.log(`⏹️  Ligne ${data.lineId} terminée (match ${data.matchId})`);
  });

  // Musique assignée
  socket.on('music_assigned', (data) => {
    socket.to(`match_${data.matchId}`).emit('music_assigned', data);
  });

  // Musique jouée
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

  if (IS_PRODUCTION) {
    res.sendFile(path.join(__dirname, 'public/client/index.html'));
  } else {
    res.status(404).send('Frontend non disponible en mode développement');
  }
});

// ======================
// DÉMARRAGE SERVEUR
// ======================

initializeData().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log('\n========================================');
    console.log('🎭 IMPRO MANAGER v2.0');
    console.log('========================================');
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API: http://0.0.0.0:${PORT}/api`);
    console.log(`📊 Health check: http://0.0.0.0:${PORT}/api/health`);
    console.log('========================================\n');
  });
}).catch(error => {
  console.error('❌ Erreur lors de l\'initialisation:', error);
  process.exit(1);
});

// Gestion graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, arrêt gracieux...');
  server.close(() => {
    console.log('Serveur arrêté');
    process.exit(0);
  });
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});
