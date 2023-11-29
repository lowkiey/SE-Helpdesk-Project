const mongoose = require('mongoose');

const schemaOptions = {
  strict: false,
  timestamps: true,
};

const FAQschema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength:6 },
    content: { type: String, required: true,minlength:6 },
    category: { type: String, required: true,minlength:6  },
    subCategory: { type: String, required: true,minlength:6  }
  },schemaOptions);

module.exports = mongoose.model('FAQModel', FAQschema);
