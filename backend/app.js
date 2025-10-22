const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const http = require('http');
const socketIo = require('socket.io');

// Import routes
const matchRoutes = require('./routes/matchRoutes');
const personnelRoutes = require('./routes/personnelRoutes');
const templateRoutes = require('./routes/templateRoutes');

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

// Musiques - Chemins différents selon environnement
const MUSIC_PATH = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, '../music')
  : 'C:\\Users\\JulienFernandez\\OneDrive\\Zic impro';

app.use('/audio/songs', express.static(MUSIC_PATH));

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

// Routes templates
app.use('/api/templates', templateRoutes);

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
      const searchLower = req.query.search.toLowerCase();
      filtered = filtered.filter(track =>
        (track.title && track.title.toLowerCase().includes(searchLower)) ||
        (track.artist && track.artist.toLowerCase().includes(searchLower))
      );
    }

    if (req.query.type) {
      // Filtre par type: 'music' ou 'sound_effect'
      // Si pas de field type, on détermine par durée: <30s = bruitage
      filtered = filtered.filter(track => {
        const trackType = track.type || (track.duration < 30 ? 'sound_effect' : 'music');
        return trackType === req.query.type;
      });
    }

    res.json(filtered);
  } catch (error) {
    console.error('Error fetching music:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la bibliothèque musicale' });
  }
});

// Route pour servir un fichier musical spécifique
app.get('/api/music/:id/file', async (req, res) => {
  try {
    const musicId = req.params.id;
    const music = musicLibrary.find(m => m.id === musicId);

    if (!music) {
      return res.status(404).json({ error: 'Musique introuvable' });
    }

    const filePath = path.join(MUSIC_PATH, music.filename);

    // Vérifier que le fichier existe
    try {
      await fs.access(filePath);
    } catch (error) {
      console.error(`Fichier musical introuvable: ${filePath}`);
      return res.status(404).json({ error: 'Fichier musical introuvable' });
    }

    // Définir les headers appropriés pour l'audio
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');

    // Envoyer le fichier
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving music file:', error);
    res.status(500).json({ error: 'Erreur lors de la lecture du fichier musical' });
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

// Store active connections per match
const activeConnections = new Map(); // matchId -> Set of socket.id

// Helper: Validate event data
function validateEventData(eventName, data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Data must be an object' };
  }

  // Common validation: matchId required
  if (!data.matchId) {
    return { valid: false, error: 'matchId is required' };
  }

  // Event-specific validation
  switch (eventName) {
    case 'join_match':
      if (!data.role || !['mc', 'sound'].includes(data.role)) {
        return { valid: false, error: 'role must be "mc" or "sound"' };
      }
      break;

    case 'line_started':
    case 'line_completed':
      if (!data.lineId) {
        return { valid: false, error: 'lineId is required' };
      }
      break;

    case 'chrono_update':
      if (typeof data.elapsed !== 'number') {
        return { valid: false, error: 'elapsed must be a number' };
      }
      if (data.status && !['running', 'paused', 'stopped'].includes(data.status)) {
        return { valid: false, error: 'status must be running, paused, or stopped' };
      }
      break;

    case 'music_assigned':
      if (!data.lines && !data.lineId) {
        return { valid: false, error: 'lines or lineId is required' };
      }
      break;

    case 'music_play':
      if (!data.musicId) {
        return { valid: false, error: 'musicId is required' };
      }
      break;
  }

  return { valid: true };
}

// Helper: Persist live state to match file
async function persistLiveState(matchId, liveState) {
  try {
    const matchesPath = path.join(__dirname, '../data/matches.json');
    const matchesData = await fs.readFile(matchesPath, 'utf8');
    const matches = JSON.parse(matchesData);

    const matchIndex = matches.findIndex(m => m.match_id === matchId);
    if (matchIndex === -1) {
      console.warn(`Match ${matchId} not found for state persistence`);
      return;
    }

    // Update live_state
    if (!matches[matchIndex].live_state) {
      matches[matchIndex].live_state = {};
    }

    matches[matchIndex].live_state = {
      ...matches[matchIndex].live_state,
      ...liveState,
      last_updated: new Date().toISOString()
    };

    await fs.writeFile(matchesPath, JSON.stringify(matches, null, 2));
  } catch (error) {
    console.error('Error persisting live state:', error);
  }
}

// Helper: Get current live state for a match
async function getLiveState(matchId) {
  try {
    const matchesPath = path.join(__dirname, '../data/matches.json');
    const matchesData = await fs.readFile(matchesPath, 'utf8');
    const matches = JSON.parse(matchesData);

    const match = matches.find(m => m.match_id === matchId);
    return match?.live_state || {
      current_line_id: null,
      chrono_elapsed: 0,
      chrono_status: 'stopped'
    };
  } catch (error) {
    console.error('Error getting live state:', error);
    return null;
  }
}

io.on('connection', (socket) => {
  console.log('✅ Client connecté:', socket.id);

  // Rejoindre un match
  socket.on('join_match', async (data) => {
    const validation = validateEventData('join_match', data);
    if (!validation.valid) {
      socket.emit('error', { event: 'join_match', error: validation.error });
      console.error(`❌ Validation error (join_match):`, validation.error);
      return;
    }

    const { matchId, role } = data;
    const roomName = `match_${matchId}`;

    socket.join(roomName);

    // Track connection
    if (!activeConnections.has(matchId)) {
      activeConnections.set(matchId, new Set());
    }
    activeConnections.get(matchId).add(socket.id);
    socket.matchId = matchId;
    socket.role = role;

    console.log(`📍 Client ${socket.id} (${role}) a rejoint le match ${matchId}`);
    console.log(`   Total clients dans match ${matchId}: ${activeConnections.get(matchId).size}`);

    // Send current state to new client
    const currentState = await getLiveState(matchId);
    if (currentState) {
      socket.emit('state_sync', {
        matchId,
        liveState: currentState
      });
      console.log(`🔄 État synchronisé envoyé au client ${socket.id}`);
    }

    // Notify others in room
    socket.to(roomName).emit('client_joined', {
      matchId,
      role,
      totalClients: activeConnections.get(matchId).size
    });
  });

  // Mode Live activé
  socket.on('live_mode_activated', (data) => {
    const validation = validateEventData('live_mode_activated', data);
    if (!validation.valid) {
      socket.emit('error', { event: 'live_mode_activated', error: validation.error });
      return;
    }

    socket.to(`match_${data.matchId}`).emit('live_mode_activated', data);
    console.log(`🔴 Mode Live activé pour match ${data.matchId}`);
  });

  // Ligne démarrée
  socket.on('line_started', async (data) => {
    const validation = validateEventData('line_started', data);
    if (!validation.valid) {
      socket.emit('error', { event: 'line_started', error: validation.error });
      return;
    }

    // Persist state
    await persistLiveState(data.matchId, {
      current_line_id: data.lineId,
      chrono_elapsed: 0,
      chrono_status: 'running'
    });

    socket.to(`match_${data.matchId}`).emit('line_started', data);
    console.log(`▶️  Ligne ${data.lineId} démarrée (match ${data.matchId})`);
  });

  // Mise à jour chrono
  socket.on('chrono_update', async (data) => {
    const validation = validateEventData('chrono_update', data);
    if (!validation.valid) {
      socket.emit('error', { event: 'chrono_update', error: validation.error });
      return;
    }

    // Persist state every 10 seconds to avoid excessive writes
    if (data.elapsed % 10 === 0) {
      await persistLiveState(data.matchId, {
        chrono_elapsed: data.elapsed,
        chrono_status: data.status || 'running'
      });
    }

    socket.to(`match_${data.matchId}`).emit('chrono_update', data);
    // Ne pas logger chaque seconde (trop verbeux)
  });

  // Ligne terminée
  socket.on('line_completed', async (data) => {
    const validation = validateEventData('line_completed', data);
    if (!validation.valid) {
      socket.emit('error', { event: 'line_completed', error: validation.error });
      return;
    }

    // Persist state
    await persistLiveState(data.matchId, {
      current_line_id: null,
      chrono_elapsed: 0,
      chrono_status: 'stopped'
    });

    socket.to(`match_${data.matchId}`).emit('line_completed', data);
    console.log(`⏹️  Ligne ${data.lineId} terminée (match ${data.matchId})`);
  });

  // Musique assignée (synchronisation)
  socket.on('music_assigned', (data) => {
    const validation = validateEventData('music_assigned', data);
    if (!validation.valid) {
      socket.emit('error', { event: 'music_assigned', error: validation.error });
      return;
    }

    socket.to(`match_${data.matchId}`).emit('music_assigned', data);
    console.log(`🎵 Musique assignée (match ${data.matchId})`);
  });

  // Musique jouée (synchronisation)
  socket.on('music_play', (data) => {
    const validation = validateEventData('music_play', data);
    if (!validation.valid) {
      socket.emit('error', { event: 'music_play', error: validation.error });
      return;
    }

    socket.to(`match_${data.matchId}`).emit('music_play', data);
    console.log(`▶️  Musique ${data.musicId} jouée (match ${data.matchId})`);
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log('❌ Client déconnecté:', socket.id);

    // Clean up tracking
    if (socket.matchId && activeConnections.has(socket.matchId)) {
      activeConnections.get(socket.matchId).delete(socket.id);

      const remainingClients = activeConnections.get(socket.matchId).size;
      console.log(`   Clients restants dans match ${socket.matchId}: ${remainingClients}`);

      // Notify others
      socket.to(`match_${socket.matchId}`).emit('client_left', {
        matchId: socket.matchId,
        role: socket.role,
        totalClients: remainingClients
      });

      // Clean up map if no clients left
      if (remainingClients === 0) {
        activeConnections.delete(socket.matchId);
        console.log(`   Match ${socket.matchId} n'a plus de clients connectés`);
      }
    }
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
