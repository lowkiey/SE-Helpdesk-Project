const mongoose = require('mongoose');
const { Schema } = mongoose;
const agentModel = require("./AgentModel");


const automatedWorkflowSchema = new Schema(
  {
    agentAvailability: { type: Boolean, required: true, ref: "Agent"},
    //agent id
    //priority mn table tickets admin_id: {
      

    issueType: {type: String, required: true, minlength:6}, //hardware, software, network
    workflowType: { type: String, required: true }, //subcategory laptop, os
    workflowDetails: { type: Object, required: true },//details mn chatgpt
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AutomatedWorkflow', automatedWorkflowSchema);