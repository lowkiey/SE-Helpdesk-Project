const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userModel = require("./userModel");

const schemaOptions = {
  strict: false,
  timestamps: true,
};
const agentschema = new mongoose.Schema(
  {
    user_id:{type:mongoose.Schema.Types.ObjectId,required:true,unique:true},
    rating: { type: mongoose.Decimal128  },
    resolution_time: { type: String  },
    ticket_id:{type:mongoose.Schema.Types.ObjectId,required:true,unique:true},



  },
  // schemaOptions
  {
    strict: false,
    timestamps: true,
  }
);


module.exports = mongoose.model('agentModel', agentschema);