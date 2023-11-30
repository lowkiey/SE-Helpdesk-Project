const express = require('express');
const settingsController = require('../Controller/CustomizationSettingsController');
const userController = require("../Controller/userController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');
const router = express.Router();

// Create new customization settings
router.post('/', settingsController.createCustomizationSettings);

// Get customization settings by ID
router.get('/customization-settings/:id', settingsController.getCustomizationSettingsById);

// Update customization settings by ID
router.put('/customization-settings/:id', settingsController.updateCustomizationSettings);

// Delete customization settings by ID
router.delete('/customization-settings/:id', settingsController.deleteCustomizationSettings);



module.exports = router;
