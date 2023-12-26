
const mongoose = require('mongoose');
const { Schema } = mongoose;

const automatedWorkflowSchema = new Schema(
  {
    agentAvailability: { type: Boolean, required: true },
    workflowType: { type: String, required: true },
    workflowDetails: { type: Object, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AutomatedWorkflow', automatedWorkflowSchema);
