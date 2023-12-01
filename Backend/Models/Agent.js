const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const userModel = require('./userModel');

const schemaOptions = {
  strict: false,
  timestamps: true,
};

const agentSchema = new mongoose.Schema(
  {
    user_id: { type: ObjectId, ref: 'userModel' },
    rating: { type: Number },
    resolution_time: { type: Number },
    ticket_id: { type: ObjectId, ref: 'ticketsModel' },
  },
  schemaOptions
);

const AgentModel = mongoose.model('Agent', agentSchema);

module.exports = AgentModel;
