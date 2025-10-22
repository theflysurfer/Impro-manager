const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const TEMPLATES_FILE = path.join(__dirname, '../data/templates.json');

/**
 * GET /api/templates
 * Returns all available match templates
 */
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(TEMPLATES_FILE, 'utf8');
    const templates = JSON.parse(data);

    res.json({
      success: true,
      count: templates.length,
      templates
    });
  } catch (error) {
    console.error('Error reading templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load templates',
      message: error.message
    });
  }
});

/**
 * GET /api/templates/:templateId
 * Returns a specific template by ID
 */
router.get('/:templateId', async (req, res) => {
  try {
    const { templateId } = req.params;
    const data = await fs.readFile(TEMPLATES_FILE, 'utf8');
    const templates = JSON.parse(data);

    const template = templates.find(t => t.template_id === templateId);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found',
        templateId
      });
    }

    res.json({
      success: true,
      template
    });
  } catch (error) {
    console.error('Error reading template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load template',
      message: error.message
    });
  }
});

module.exports = router;
