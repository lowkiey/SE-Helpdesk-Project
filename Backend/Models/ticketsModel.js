const mongoose = require('mongoose');
const userModel = require("./userModel");
const schemaOptions = {
  strict: false,
  timestamps: true,
};
const Ticketschema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    category: { type: String, required: true, minlength: 6 },
    subCategory: { type: String, required: true, minlength: 6 },
    description: { type: String, required: false, minlength: 4 },
    priority: { type: String, required: false, minlength: 4 },
    status: { type: String, required: false, minlength: 4},
    agent_id: { type: mongoose.Schema.Types.ObjectId, default: null },
    workflow: { type: String, required: false, minlength: 4 },
  },
  // schemaOptions
  {
    strict: false,
    timestamps: true,
  }
);
module.exports = mongoose.model('ticketsModel', Ticketschema);