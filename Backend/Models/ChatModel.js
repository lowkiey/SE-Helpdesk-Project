const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({

  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
  messages: [{ type: String }], 
});


module.exports = mongoose.model("ChatModel", chatSchema);;

