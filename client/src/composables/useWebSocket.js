import { ref, reactive } from 'vue'
import { io } from 'socket.io-client'

// État partagé entre toutes les instances
const socket = ref(null)
const socketState = reactive({
  connected: false,
  currentLine: null,
  chronoElapsed: 0,
  chronoStatus: 'stopped',
  scores: { home: 0, away: 0 }
})

let matchId = null
let role = null

export function useWebSocket() {
  /**
   * Connect to Socket.IO server
   * @param {string} _matchId - Match ID to join
   * @param {string} _role - User role ('MC' or 'SOUND')
   */
  function connect(_matchId, _role) {
    matchId = _matchId
    role = _role

    // Use window.location.origin to detect environment (dev vs prod)
    const serverUrl = window.location.origin.includes('localhost:5173')
      ? 'http://localhost:3001'  // Dev: frontend on 5173, backend on 3001
      : window.location.origin   // Prod: same origin

    console.log('[WebSocket] Connecting to:', serverUrl)

    socket.value = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })

    // Connection events
    socket.value.on('connect', () => {
      console.log('[WebSocket] Connected with ID:', socket.value.id)
      socketState.connected = true

      // Join match room
      socket.value.emit('join_match', { matchId, role })
      console.log(`[WebSocket] Joined match ${matchId} as ${role}`)
    })

    socket.value.on('disconnect', (reason) => {
      console.log('[WebSocket] Disconnected:', reason)
      socketState.connected = false
    })

    socket.value.on('connect_error', (error) => {
      console.error('[WebSocket] Connection error:', error)
      socketState.connected = false
    })

    // Live Mode events
    socket.value.on('live_mode_activated', (data) => {
      console.log('[WebSocket] Live mode activated:', data)
    })

    socket.value.on('line_started', (data) => {
      console.log('[WebSocket] Line started:', data)
      socketState.currentLine = data.lineId
    })

    socket.value.on('chrono_update', (data) => {
      // Update chrono state without logging (too frequent)
      socketState.chronoElapsed = data.elapsed
      socketState.chronoStatus = data.status
    })

    socket.value.on('line_completed', (data) => {
      console.log('[WebSocket] Line completed:', data)
    })

    socket.value.on('score_update', (data) => {
      console.log('[WebSocket] Score updated:', data)
      socketState.scores = data.scores
    })

    socket.value.on('music_play', (data) => {
      console.log('[WebSocket] Music play requested:', data)
    })
  }

  /**
   * Disconnect from Socket.IO server
   */
  function disconnect() {
    if (socket.value) {
      console.log('[WebSocket] Disconnecting...')
      socket.value.disconnect()
      socket.value = null
    }
  }

  /**
   * Emit line_started event (MC only)
   * @param {string} lineId - Line ID that started
   */
  function emitLineStarted(lineId) {
    if (!socket.value || !socket.value.connected) {
      console.warn('[WebSocket] Cannot emit line_started: not connected')
      return
    }

    console.log('[WebSocket] Emitting line_started:', lineId)
    socket.value.emit('line_started', {
      matchId,
      lineId
    })
  }

  /**
   * Emit chrono_update event (MC only)
   * @param {number} elapsed - Elapsed time in seconds
   * @param {string} status - Chrono status ('running', 'paused', 'stopped')
   */
  function emitChronoUpdate(elapsed, status) {
    if (!socket.value || !socket.value.connected) {
      console.warn('[WebSocket] Cannot emit chrono_update: not connected')
      return
    }

    // Don't log every second (too verbose)
    socket.value.emit('chrono_update', {
      matchId,
      elapsed,
      status
    })
  }

  /**
   * Emit score_update event (MC only)
   * @param {object} scores - { home: number, away: number }
   */
  function emitScoreUpdate(scores) {
    if (!socket.value || !socket.value.connected) {
      console.warn('[WebSocket] Cannot emit score_update: not connected')
      return
    }

    console.log('[WebSocket] Emitting score_update:', scores)
    socket.value.emit('score_update', {
      matchId,
      scores
    })
  }

  /**
   * Emit music_play event (Sound only)
   * @param {string} musicId - Music ID to play
   * @param {string} point - Music point ('intro', 'outro', 'transition')
   */
  function emitMusicPlay(musicId, point = 'intro') {
    if (!socket.value || !socket.value.connected) {
      console.warn('[WebSocket] Cannot emit music_play: not connected')
      return
    }

    console.log('[WebSocket] Emitting music_play:', { musicId, point })
    socket.value.emit('music_play', {
      matchId,
      musicId,
      point
    })
  }

  return {
    socket,
    socketState,
    connect,
    disconnect,
    emitLineStarted,
    emitChronoUpdate,
    emitScoreUpdate,
    emitMusicPlay
  }
}
