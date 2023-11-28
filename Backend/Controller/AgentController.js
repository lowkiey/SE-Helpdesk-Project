const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const userModel = require('./userModel');

const schemaOptions = {
  strict: false,
  timestamps: true,
};

const agentSchema = new mongoose.Schema(
  {
    user_id: { type: ObjectId, ref: 'User' },
    rating: { type: Number },
    resolution_time: { type: Number },
    ticket_id: { type: ObjectId },
  },
  schemaOptions
);

const AgentModel = mongoose.model('Agent', agentSchema);

module.exports = AgentModel;
