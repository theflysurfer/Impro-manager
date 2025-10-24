const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

// Active downloads tracking
const activeDownloads = new Map();

/**
 * Check if Python dependencies are available
 */
router.post('/check-dependencies', async (req, res) => {
  const checks = {
    yt_dlp: false,
    librosa: false
  };

  const errors = [];

  try {
    // Check Python and yt-dlp
    const pythonCheck = spawn('python', ['-c', 'import yt_dlp; print("OK")']);

    const ytdlpPromise = new Promise((resolve) => {
      let output = '';
      pythonCheck.stdout.on('data', (data) => {
        output += data.toString();
      });
      pythonCheck.on('close', (code) => {
        if (code === 0 && output.includes('OK')) {
          checks.yt_dlp = true;
          resolve();
        } else {
          errors.push('yt-dlp non installé (pip install yt-dlp)');
          resolve();
        }
      });
      pythonCheck.on('error', () => {
        errors.push('Python non trouvé ou yt-dlp non installé');
        resolve();
      });
    });

    // Check librosa
    const librosaCheck = spawn('python', ['-c', 'import librosa; print("OK")']);

    const librosaPromise = new Promise((resolve) => {
      let output = '';
      librosaCheck.stdout.on('data', (data) => {
        output += data.toString();
      });
      librosaCheck.on('close', (code) => {
        if (code === 0 && output.includes('OK')) {
          checks.librosa = true;
          resolve();
        } else {
          errors.push('librosa non installé (pip install librosa numpy)');
          resolve();
        }
      });
      librosaCheck.on('error', () => {
        errors.push('Python non trouvé ou librosa non installé');
        resolve();
      });
    });

    await Promise.all([ytdlpPromise, librosaPromise]);

  } catch (error) {
    console.error('Error checking dependencies:', error);
    errors.push('Erreur lors de la vérification des dépendances');
  }

  const installed = checks.yt_dlp && checks.librosa;

  res.json({
    installed,
    yt_dlp: checks.yt_dlp,
    librosa: checks.librosa,
    errors,
    checks: {
      yt_dlp: checks.yt_dlp,
      librosa: checks.librosa,
      errors
    }
  });
});

/**
 * Download YouTube audio using Python script
 */
router.post('/download', async (req, res) => {
  const { url, type = 'url', metadata = {} } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL requise' });
  }

  const downloadId = `dl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Create download object
  const download = {
    id: downloadId,
    url,
    type,
    metadata,
    status: 'pending',
    progress: 0,
    startTime: Date.now(),
    error: null
  };

  activeDownloads.set(downloadId, download);

  // Start download asynchronously
  downloadYouTubeAudio(downloadId, url, type, metadata)
    .catch(error => {
      console.error('Download error:', error);
      const dl = activeDownloads.get(downloadId);
      if (dl) {
        dl.status = 'error';
        dl.error = error.message;
      }
    });

  res.json({
    success: true,
    downloadId,
    message: 'Téléchargement démarré'
  });
});

/**
 * Get download status
 */
router.get('/status/:downloadId', (req, res) => {
  const { downloadId } = req.params;
  const download = activeDownloads.get(downloadId);

  if (!download) {
    return res.status(404).json({ error: 'Téléchargement introuvable' });
  }

  res.json(download);
});

/**
 * Get all active downloads
 */
router.get('/active', (req, res) => {
  const downloads = Array.from(activeDownloads.values())
    .filter(d => d.status === 'downloading' || d.status === 'pending');

  res.json(downloads);
});

/**
 * Download YouTube audio using Python script
 */
async function downloadYouTubeAudio(downloadId, url, type, metadata) {
  const download = activeDownloads.get(downloadId);
  if (!download) return;

  try {
    download.status = 'downloading';

    // Build Python command arguments
    const scriptPath = path.join(__dirname, '../../youtube_downloader.py');
    const args = [];

    // Add URL or search query
    if (type === 'search') {
      args.push('--search', url);
    } else if (type === 'playlist') {
      args.push('--playlist', url);
    } else {
      args.push(url);
    }

    // Add metadata
    if (metadata.scenarios && metadata.scenarios.length > 0) {
      args.push('--scenarios', metadata.scenarios.join(','));
    }
    if (metadata.moods && metadata.moods.length > 0) {
      args.push('--moods', metadata.moods.join(','));
    }
    if (metadata.energy) {
      args.push('--energy', metadata.energy.toString());
    }

    console.log(`🐍 Calling Python script: python ${scriptPath} ${args.join(' ')}`);

    // Spawn Python process
    const pythonProcess = spawn('python', [scriptPath, ...args]);

    let output = '';
    let errorOutput = '';

    // Capture stdout
    pythonProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log(`[Python] ${text.trim()}`);

      // Parse progress if available (yt-dlp outputs download percentage)
      const progressMatch = text.match(/(\d+(?:\.\d+)?)%/);
      if (progressMatch) {
        download.progress = parseFloat(progressMatch[1]);
      }
    });

    // Capture stderr
    pythonProcess.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      console.error(`[Python Error] ${text.trim()}`);
    });

    // Wait for process to complete
    await new Promise((resolve, reject) => {
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Python script exited with code ${code}: ${errorOutput}`));
        }
      });
      pythonProcess.on('error', (err) => {
        reject(new Error(`Failed to start Python script: ${err.message}`));
      });
    });

    console.log(`✅ Download completed via Python script`);

    // The Python script already adds the track to music_library.json
    // So we just need to mark download as complete
    download.status = 'completed';
    download.progress = 100;
    download.output = output;

    // Try to extract track info from output
    const titleMatch = output.match(/Fichier: (.+)/);
    if (titleMatch) {
      download.trackInfo = {
        filename: titleMatch[1]
      };
    }

  } catch (error) {
    console.error(`❌ Error downloading ${downloadId}:`, error);
    download.status = 'error';
    download.error = error.message;
    throw error;
  }
}

module.exports = router;
