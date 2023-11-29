const express = require('express');
const settingsController = require('../Controller/CustomizationSettingsController');

const router = express.Router();

// Create new customization settings
router.post('/customization-settings', settingsController.createCustomizationSettings);

// Get customization settings by ID
router.get('/customization-settings/:id', settingsController.getCustomizationSettingsById);

// Update customization settings by ID
router.put('/customization-settings/:id', settingsController.updateCustomizationSettings);

// Delete customization settings by ID
router.delete('/customization-settings/:id', settingsController.deleteCustomizationSettings);

module.exports = router;
