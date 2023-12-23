const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({

  userId: String,
  agentId: String, 
  messages: [{
    text: String,
    date: {
      type: Date,
      default: new Date()
    },
    senderId:String
  }], 
  createdAt: {type: Date, default: new Date()},
  closedAt: Date

});


module.exports = mongoose.model("ChatModel", chatSchema);;