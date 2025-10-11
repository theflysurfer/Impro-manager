const fs = require('fs').promises;
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true, useDefaults: true });
addFormats(ajv);

// Charger le schéma de validation
const personnelSchema = require('../models/personnel.schema.json');
const validatePersonnel = ajv.compile(personnelSchema);

const PERSONNEL_FILE = path.join(__dirname, '../../data/personnel.json');

// Utilitaires pour lecture/écriture JSON
async function readPersonnel() {
  try {
    const data = await fs.readFile(PERSONNEL_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Si le fichier n'existe pas, retourner un tableau vide
    return [];
  }
}

async function writePersonnel(personnel) {
  await fs.mkdir(path.dirname(PERSONNEL_FILE), { recursive: true });
  await fs.writeFile(PERSONNEL_FILE, JSON.stringify(personnel, null, 2));
}

// Générer un ID unique
function generatePersonnelId(personnel) {
  if (personnel.length === 0) return 'person_001';
  const lastId = personnel[personnel.length - 1].personnel_id;
  const num = parseInt(lastId.split('_')[1]) + 1;
  return `person_${String(num).padStart(3, '0')}`;
}

// Controllers

/**
 * GET /api/personnel
 * Récupérer tout le personnel
 */
exports.getAllPersonnel = async (req, res) => {
  try {
    const personnel = await readPersonnel();

    // Filtres optionnels
    let filtered = personnel;

    // Filtre par rôle
    if (req.query.role) {
      filtered = filtered.filter(p => p.roles.includes(req.query.role));
    }

    // Filtre par statut
    if (req.query.status) {
      filtered = filtered.filter(p => p.status === req.query.status);
    }

    res.json(filtered);
  } catch (error) {
    console.error('Error reading personnel:', error);
    res.status(500).json({ error: 'Erreur lors de la lecture du personnel' });
  }
};

/**
 * GET /api/personnel/:id
 * Récupérer un membre spécifique
 */
exports.getPersonnelById = async (req, res) => {
  try {
    const personnel = await readPersonnel();
    const member = personnel.find(p => p.personnel_id === req.params.id);

    if (!member) {
      return res.status(404).json({ error: 'Membre non trouvé' });
    }

    res.json(member);
  } catch (error) {
    console.error('Error reading personnel:', error);
    res.status(500).json({ error: 'Erreur lors de la lecture du membre' });
  }
};

/**
 * POST /api/personnel
 * Créer un nouveau membre (Admin uniquement - V2)
 */
exports.createPersonnel = async (req, res) => {
  try {
    const personnel = await readPersonnel();

    // Créer le membre avec timestamps
    const newMember = {
      personnel_id: generatePersonnelId(personnel),
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Valider avec le schéma JSON
    const valid = validatePersonnel(newMember);
    if (!valid) {
      return res.status(400).json({
        error: 'Données invalides',
        details: validatePersonnel.errors
      });
    }

    personnel.push(newMember);
    await writePersonnel(personnel);

    res.status(201).json(newMember);
  } catch (error) {
    console.error('Error creating personnel:', error);
    res.status(500).json({ error: 'Erreur lors de la création du membre' });
  }
};

/**
 * PUT /api/personnel/:id
 * Mettre à jour un membre existant (Admin uniquement - V2)
 */
exports.updatePersonnel = async (req, res) => {
  try {
    const personnel = await readPersonnel();
    const index = personnel.findIndex(p => p.personnel_id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Membre non trouvé' });
    }

    // Mettre à jour le membre en préservant personnel_id et created_at
    const updatedMember = {
      ...personnel[index],
      ...req.body,
      personnel_id: personnel[index].personnel_id,
      created_at: personnel[index].created_at,
      updated_at: new Date().toISOString()
    };

    // Valider avec le schéma JSON
    const valid = validatePersonnel(updatedMember);
    if (!valid) {
      return res.status(400).json({
        error: 'Données invalides',
        details: validatePersonnel.errors
      });
    }

    personnel[index] = updatedMember;
    await writePersonnel(personnel);

    res.json(updatedMember);
  } catch (error) {
    console.error('Error updating personnel:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du membre' });
  }
};

/**
 * DELETE /api/personnel/:id
 * Supprimer un membre (Admin uniquement - V2)
 */
exports.deletePersonnel = async (req, res) => {
  try {
    const personnel = await readPersonnel();
    const index = personnel.findIndex(p => p.personnel_id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Membre non trouvé' });
    }

    const deletedMember = personnel.splice(index, 1)[0];
    await writePersonnel(personnel);

    res.json({
      message: 'Membre supprimé avec succès',
      member: deletedMember
    });
  } catch (error) {
    console.error('Error deleting personnel:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du membre' });
  }
};
