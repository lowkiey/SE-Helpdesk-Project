const CustomizationSettings = require('../Models/CustomizationSettings');

// CREATE operation Done
async function createCustomizationSettings(req, res) {
  try {
    const { admin_id, appearance } = req.body;

    if (!admin_id || !appearance) {
      return res.status(400).send("admin_id and appearance are required");
    }

    const customizationSettings = new CustomizationSettings({
      admin_id: admin_id,
      appearance: appearance,
    });

    const result = await customizationSettings.save();
    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

// READ operation - Get by ID DONE
async function getCustomizationSettingsById(req, res) {
  const customizationSettingsId = req.params.id;

  try {
    const customizationSettings = await CustomizationSettings.findById(customizationSettingsId);

    if (!customizationSettings) {
      return res.status(404).send("Customization settings not found");
    }

    return res.status(200).send(customizationSettings);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

// READ operation - Get all DONE
async function getAllCustomizationSettings(req, res) {
  try {
    const allSettings = await CustomizationSettings.find();
    return res.status(200).send(allSettings);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

// UPDATE operation DONE
async function updateCustomizationSettings(req, res) {
  const customizationSettingsId = req.params.id;
  const { appearance } = req.body;

  try {
    const result = await CustomizationSettings.findByIdAndUpdate(
      customizationSettingsId,
      { $set: { appearance: appearance } }
    );

    if (!result) {
      return res.status(404).send("Customization settings not found");
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

// DELETE operation DONE
async function deleteCustomizationSettings(req, res) {
  const customizationSettingsId = req.params.id;

  try {
    const result = await CustomizationSettings.findByIdAndDelete(customizationSettingsId);

    if (!result) {
      return res.status(404).send("Customization settings not found");
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

module.exports = {
  createCustomizationSettings,
  getCustomizationSettingsById,
  getAllCustomizationSettings,
  updateCustomizationSettings,
  deleteCustomizationSettings,
};
