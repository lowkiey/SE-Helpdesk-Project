const mongoose = require('mongoose');
const userModel = require("./userModels");
const schemaOptions = {
  strict: false,
  timestamps: true,
};
const Ticketschema = new mongoose.Schema(
    {
        id:{type:mongoose.Schema.Types.ObjectId,required:true,unique:true},
      user_id:{type:mongoose.Schema.Types.ObjectId,required:true,unique:true},
      category:{type:String,required:true,minlength:6},
      subCategory:{type:String,required:true,minlength:6} ,
      description:{type:String,required:true,minlength:6},
      priority: {type: String,required: true,minlength:6},
      status:{type: String,required: true,minlength:6},
      agent_id:{type:mongoose.Schema.Types.ObjectId,required:true,unique:true},
      workflow:{type: String,required: true,minlength:6},
      },
    // schemaOptions
    {
      strict: false,
      timestamps: true,
    }
  );
  module.exports = mongoose.model('ticketsModel', Ticketschema);