const mongoose = require('mongoose');
const userModel = require("./userModel");
const ticketsModel = require("./ticketsModel");

const schemaOptions = {
  strict: false,
  timestamps: true,
};
const agentschema = new mongoose.Schema(
  {
    name: { type: String },//agent1, agent2, agent3
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel' }, // Reference the 'Users' model
    rating: { type: Number },
    resolution_time: { type: String },
    ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ticketsModel' }, // Reference the 'Tickets' model
    ticketCount: { type: Number, default: 0, max: 5 },
  },
  {
    strict: false,
    timestamps: true,
  }
);


agentschema.pre('save', async function (next) {
  try {
    console.log("mememem", this.id);
    let ticketCount = await ticketsModel.countDocuments({ agent_id: this.id });

    if (ticketCount > 5) {
      console.log('Agent has reached the maximum ticket count.');
      return next(new Error('Agent has reached the maximum ticket count.'));
    }else{ 
      console.log('Agent has not reached the maximum ticket count.');
    }
    // ticketCount = ticketCount + 1;

    next();
  } catch (error) {
    console.error('Error in pre-save hook:', error);
    return next(error);
  }
});


module.exports = mongoose.model('Agent', agentschema);