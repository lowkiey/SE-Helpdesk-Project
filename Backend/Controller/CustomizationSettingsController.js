const CustomizationSettings = require('../Models/CustomizationSettings');

// CREATE operation
async function createCustomizationSettings(res, req) {
  try {
    const customizationSettings = new CustomizationSettings({
      admin_id: adminId,
      appearance: appearance,
    });
    const result = await customizationSettings.save();
    res.status(200).send(customizationSettings);
  } catch (error) {
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
