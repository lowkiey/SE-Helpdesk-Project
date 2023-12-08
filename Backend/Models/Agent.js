const mongoose = require('mongoose');
const userModel = require("./userModel");
const ticketsModel = require("./ticketsModel");


const agentschema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel' }, // Reference the 'Users' model
    rating: { type: Number },
    resolution_time: { type: String },
    ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ticketsModel' }, // Reference the 'Tickets' model
    ticketCount: { type: Number, default: 0, max: 5 },
    agentType: { type: String, enum: ['agent1', 'agent2', 'agent3'] },
  },
  {
    strict: false,
    timestamps: true,
  }
);

agentschema.pre('save', async function (next) {
  try {
    // Check if the agent has reached the maximum ticket count
    if (this.ticketCount >= 5) {
      console.log('Agent has reached the maximum ticket count.');
      return next(new Error('Agent has reached the maximum ticket count.'));
    }

    // Increment the ticket count
    this.ticketCount += 1;

    // Continue with the save operation
    return next();
  } catch (error) {
    console.error('Error in pre-save hook:', error);
    return next(error);
  }
});

module.exports = mongoose.model('agentModel', agentschema);