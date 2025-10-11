const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

/**
 * Routes API pour les matchs
 * Base URL: /api/matches
 */

// GET /api/matches - Liste tous les matchs
router.get('/', matchController.getAllMatches);

// GET /api/matches/:id - Récupère un match spécifique
router.get('/:id', matchController.getMatchById);

// POST /api/matches - Crée un nouveau match
router.post('/', matchController.createMatch);

// PUT /api/matches/:id - Met à jour un match existant
router.put('/:id', matchController.updateMatch);

// DELETE /api/matches/:id - Supprime un match
router.delete('/:id', matchController.deleteMatch);

module.exports = router;
