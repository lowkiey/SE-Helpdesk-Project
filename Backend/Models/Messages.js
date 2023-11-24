const mongoose = require('mongoose');
const schemaOptions = {
  strict: false,
  timestamps: true,
};
const Messagesschema = new mongoose.Schema(
  {
    _id:{type:Int16Array,required:true,unique:true},
    ticket_id:{type:Int16Array,required:true,unique:true},
    user_id:{type:Int16Array,required:true,unique:true} ,
    message:{type:string,required:true,minLength:6},
    timestamp:{type:Date,default:Date.now},
    },
  {
    strict: false,
    timestamps: true,
  }
);


module.exports = mongoose.model('MessagesModel', Messagesschema);