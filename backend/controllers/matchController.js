const fs = require('fs').promises;
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true, useDefaults: true });
addFormats(ajv);

// Charger le schéma de validation
const matchSchema = require('../models/match.schema.json');
const validateMatch = ajv.compile(matchSchema);

const MATCHES_FILE = path.join(__dirname, '../../data/matches.json');

// Utilitaires pour lecture/écriture JSON
async function readMatches() {
  try {
    const data = await fs.readFile(MATCHES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Si le fichier n'existe pas, retourner un tableau vide
    return [];
  }
}

async function writeMatches(matches) {
  await fs.mkdir(path.dirname(MATCHES_FILE), { recursive: true });
  await fs.writeFile(MATCHES_FILE, JSON.stringify(matches, null, 2));
}

// Générer un ID unique
function generateMatchId(matches) {
  if (matches.length === 0) return 'match_001';

  // Trouver le plus grand numéro de match_id existant
  let maxNum = 0;
  matches.forEach(match => {
    // Support ancien format (id) et nouveau format (match_id)
    const matchId = match.match_id || match.id;
    if (matchId && typeof matchId === 'string') {
      const parts = matchId.split(/[-_]/);
      const num = parseInt(parts[parts.length - 1]);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  });

  return `match_${String(maxNum + 1).padStart(3, '0')}`;
}

// Controllers

/**
 * GET /api/matches
 * Récupérer tous les matchs
 */
exports.getAllMatches = async (req, res) => {
  try {
    const matches = await readMatches();
    res.json(matches);
  } catch (error) {
    console.error('Error reading matches:', error);
    res.status(500).json({ error: 'Erreur lors de la lecture des matchs' });
  }
};

/**
 * GET /api/matches/:id
 * Récupérer un match spécifique
 */
exports.getMatchById = async (req, res) => {
  try {
    const matches = await readMatches();
    const match = matches.find(m => m.match_id === req.params.id);

    if (!match) {
      return res.status(404).json({ error: 'Match non trouvé' });
    }

    res.json(match);
  } catch (error) {
    console.error('Error reading match:', error);
    res.status(500).json({ error: 'Erreur lors de la lecture du match' });
  }
};

/**
 * POST /api/matches
 * Créer un nouveau match
 */
exports.createMatch = async (req, res) => {
  try {
    const matches = await readMatches();

    // Créer le match avec timestamps
    const newMatch = {
      match_id: generateMatchId(matches),
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Valider avec le schéma JSON
    const valid = validateMatch(newMatch);
    if (!valid) {
      return res.status(400).json({
        error: 'Données invalides',
        details: validateMatch.errors
      });
    }

    matches.push(newMatch);
    await writeMatches(matches);

    res.status(201).json(newMatch);
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).json({ error: 'Erreur lors de la création du match' });
  }
};

/**
 * PUT /api/matches/:id
 * Mettre à jour un match existant
 */
exports.updateMatch = async (req, res) => {
  try {
    const matches = await readMatches();
    const index = matches.findIndex(m => m.match_id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Match non trouvé' });
    }

    // Mettre à jour le match en préservant match_id et created_at
    const updatedMatch = {
      ...matches[index],
      ...req.body,
      match_id: matches[index].match_id,
      created_at: matches[index].created_at,
      updated_at: new Date().toISOString()
    };

    // Valider avec le schéma JSON
    const valid = validateMatch(updatedMatch);
    if (!valid) {
      return res.status(400).json({
        error: 'Données invalides',
        details: validateMatch.errors
      });
    }

    matches[index] = updatedMatch;
    await writeMatches(matches);

    res.json(updatedMatch);
  } catch (error) {
    console.error('Error updating match:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du match' });
  }
};

/**
 * DELETE /api/matches/:id
 * Supprimer un match
 */
exports.deleteMatch = async (req, res) => {
  try {
    const matches = await readMatches();
    const index = matches.findIndex(m => m.match_id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Match non trouvé' });
    }

    const deletedMatch = matches.splice(index, 1)[0];
    await writeMatches(matches);

    res.json({
      message: 'Match supprimé avec succès',
      match: deletedMatch
    });
  } catch (error) {
    console.error('Error deleting match:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du match' });
  }
};
