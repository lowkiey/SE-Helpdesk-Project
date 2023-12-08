const mongoose = require('mongoose');

const schemaOptions = {
  strict: false,
  timestamps: true,
};

const reportsschema = new mongoose.Schema(
  {
    agent_id: { type:mongoose.Schema.Types.ObjectId, required: true, unique: true },
    ticketStatusReport: { type: String, required: true },
    resoultionTimeReport: { type: String, required: true },
    agentPreformanceReport: { type: String, required: true },
  },
  schemaOptions
);

const Report = mongoose.model('Report', reportsschema);

module.exports = Report;
