const mongoose = require('mongoose');

const schemaOptions = {
  strict: false,
  timestamps: true,
};

const notificationschema = new mongoose.Schema(
  {
    from: { type:String },
    to: { type: String },
    text: { type: String},
  },
  schemaOptions
);

const notificationModel = mongoose.model('notificationModel', notificationschema);

module.exports = notificationModel;