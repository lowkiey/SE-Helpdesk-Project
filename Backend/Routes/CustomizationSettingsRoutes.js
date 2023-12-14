const express = require('express');
const settingsController = require('../Controller/CustomizationSettingsController');
const userController = require("../Controller/userController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');
const router = express.Router();

// Create new customization settings
router.post('/', settingsController.createCustomizationSettings);

// Get all customization settings
router.get('/', settingsController.getAllCustomizationSettings);

// Get customization settings by ID
router.get('/:id', settingsController.getCustomizationSettingsById);

// Update customization settings by ID
router.put('/:id', settingsController.updateCustomizationSettings);

// Delete customization settings by ID
router.delete('/:id', settingsController.deleteCustomizationSettings);



module.exports = router;
