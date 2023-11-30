const sessionModel = require("../Models/sessionModel");
const userModel = require("../Models/userModel");
const CustomizationSettings = require('../Models/CustomizationSettings');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

// CREATE operation
async function createCustomizationSettings(req, res) {  
  try {
    const { admin_id, appearance } = req.body;
    const customizationSettings = new CustomizationSettings({
      admin_id: admin_id,
      appearance: appearance,
    });
    const result = await customizationSettings.save();
    return res.status(200).send(customizationSettings);
  } 
  catch (error) {
    res.status(500).send(error.message);
  }
}
// READ operation
async function getCustomizationSettingsById(customizationSettingsId) {
  try {
    const customizationSettings = await CustomizationSettings.findById(customizationSettingsId);
    return customizationSettings;
  } catch (error) {
    throw error;
  }
}

// UPDATE operation
async function updateCustomizationSettings(customizationSettingsId, appearance) {
  try {
    const result = await CustomizationSettings.findByIdAndUpdate(
      customizationSettingsId,
      { $set: { appearance: appearance } },
      { new: true }
    );
    return result;
  } catch (error) {
    throw error;
  }
}

// DELETE operation
async function deleteCustomizationSettings(customizationSettingsId) {
  try {
    const result = await CustomizationSettings.findByIdAndDelete(customizationSettingsId);
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createCustomizationSettings,
  getCustomizationSettingsById,
  updateCustomizationSettings,
  deleteCustomizationSettings,
};
