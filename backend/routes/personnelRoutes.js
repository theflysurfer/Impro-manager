const express = require('express');
const router = express.Router();
const personnelController = require('../controllers/personnelController');

/**
 * Routes API pour le personnel
 * Base URL: /api/personnel
 */

// GET /api/personnel - Liste tout le personnel
// Query params: ?role=mc&status=active
router.get('/', personnelController.getAllPersonnel);

// GET /api/personnel/:id - Récupère un membre spécifique
router.get('/:id', personnelController.getPersonnelById);

// POST /api/personnel - Crée un nouveau membre (Admin uniquement - V2)
router.post('/', personnelController.createPersonnel);

// PUT /api/personnel/:id - Met à jour un membre existant (Admin uniquement - V2)
router.put('/:id', personnelController.updatePersonnel);

// DELETE /api/personnel/:id - Supprime un membre (Admin uniquement - V2)
router.delete('/:id', personnelController.deletePersonnel);

module.exports = router;
