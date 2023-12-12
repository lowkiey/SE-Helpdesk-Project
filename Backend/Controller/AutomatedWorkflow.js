
const mongoose = require('mongoose');
const { Schema } = mongoose;
const agentModel = require("./Agent");


const automatedWorkflowSchema = new Schema(
  {
    issueType: {type: String, required: true, minlength:6}, //hardware, software, network
    workflowType: { type: String, required: true }, //subcategory laptop, os
    workflowDetails: { type: Object, required: true },//details mn chatgpt
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AutomatedWorkflow', automatedWorkflowSchema); 