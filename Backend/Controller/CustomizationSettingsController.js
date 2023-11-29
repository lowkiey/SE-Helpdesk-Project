const CustomizationSettings = require('../Models/CustomizationSettings');

// CREATE operation
async function createCustomizationSettings(adminId, appearance) {
  try {
    const customizationSettings = new CustomizationSettings({
      admin_id: adminId,
      appearance: appearance,
    });
    const result = await customizationSettings.save();
    return result;
  } catch (error) {
    throw error;
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
