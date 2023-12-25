const mongoose = require('mongoose');

const userModel = require("./userModel");
const ticketsModel = require("./ticketsModel");
const { ObjectId } = require('mongodb');

const schemaOptions = {
  strict: false,
  timestamps: true,
};
const agentschema = new mongoose.Schema(
  {
    id: { type: ObjectId },
    name: { type: String, unique: true, required: true },
    user_id: { type: ObjectId },
    rating: { type: Number },
    resolution_time: { type: String },
    ticket_id: { type: ObjectId }, 
    numberOfTickets:{type: Number, default:5, required: false} //dh el hy-minus mno el tickets gowa update tickets


  },
  // schemaOptions
  {
    strict: false,
    timestamps: true,
  }
);


module.exports = mongoose.model('Agent', agentschema);