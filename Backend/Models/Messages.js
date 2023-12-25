const mongoose = require('mongoose');
const userModel = require("./userModel");

const Messagesschema = new mongoose.Schema(
  {
    ticket_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    messages: { type: [String], required: true, minLength: 6 },
    timestamp: { type: Date, default: Date.now },
  },
  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model('MessagesModel', Messagesschema);