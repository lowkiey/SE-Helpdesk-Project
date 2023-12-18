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
    rating: { type: Number,default: 0},
    resolution_time: { type: String, default: 0},
    ticket_id: { type: ObjectId, ref: 'ticketsModel', default: null },
    agentAvailability: { type: Boolean, required: true, default: true },
    role: { type: String },

  },
  schemaOptions
);

const AgentModel = mongoose.model('Agent', agentSchema);

module.exports = AgentModel;
