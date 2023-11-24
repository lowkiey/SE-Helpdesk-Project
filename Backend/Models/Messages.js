const mongoose = require('mongoose');
const userModel = require("./userModels");
const schemaOptions = {
  strict: false,
  timestamps: true,
};
const Messagesschema = new mongoose.Schema(
  {
    _id:{type:mongoose.Schema.Types.ObjectId,required:true,unique:true},
    ticket_id:{type:mongoose.Schema.Types.ObjectId,required:true,unique:true},
    user_id:{type:mongoose.Schema.Types.ObjectId,required:true,unique:true} ,
    message:{type:string,required:true,minLength:6},
    timestamp:{type:Date,default:Date.now},
    },
  {
    strict: false,
    timestamps: true,
  }
);


module.exports = mongoose.model('MessagesModel', Messagesschema);