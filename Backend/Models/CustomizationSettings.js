const mongoose = require("mongoose");
const userModel = require("./userModels");

const schemaOptions = {
    strict: true,
    timestamps: true,
};

const CustomizationSettingsSchema = new mongoose.Schema(
    {
        admin_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "userModel",
        },
        appearance: {
            type: String,
            required: true,
        },
    },
    schemaOptions
);

module.exports = mongoose.model("CustomizationSettings", CustomizationSettingsSchema);
