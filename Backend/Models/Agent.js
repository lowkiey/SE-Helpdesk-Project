const mongoose = require('mongoose');
const userModel = require("./userModels");

const schemaOptions = {
  strict: false,
  timestamps: true,
};
const agentschema = new mongoose.Schemda(
  {
    id: { type: objectId },
    user_id: { type: objectId },
    rating: { type: Int16Array },
    resolution_time: { type: Int16Array },
    ticket_id: { type: objectId }


  },
  // schemaOptions
  {
    strict: false,
    timestamps: true,
  }
);


module.exports = mongoose.model('agentModel', agentschema);