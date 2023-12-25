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

<<<<<<< HEAD
module.exports = notificationModel;
=======
module.exports = notificationModel;
>>>>>>> bcb00bb2b41a2b6d2a7721c6938b64cb2b3b8d1f
