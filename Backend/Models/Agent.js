const mongoose = require('mongoose');
const userModel = require("./userModels");

const schemaOptions = {
  strict: false,
  timestamps: true,
};
const agentschema = new mongoose.Schema(
  {
    id: { type: objectId },
    user_id: { type: objectId },
    rating: { type: Int16Array },
    resolution_time: { type: Int16Array },
    ticket_id: { type: objectId },
    agentAvailability :{ type: Boolean, required: true },
    capacity: { type: Number, required: true }
    


  },  
  // schemaOptions
  {
    strict: false,
    timestamps: true,
  }
);


module.exports = mongoose.model('agentModel', agentschema);