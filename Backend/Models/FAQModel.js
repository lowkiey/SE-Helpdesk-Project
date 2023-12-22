const mongoose = require('mongoose');
const userModel = require("./userModel");

const schemaOptions = {
  strict: false,
  timestamps: true,
};

const FAQschema = new mongoose.Schema(
  {
    title: { type: String, required: true},
    content: { type: String, required: true},
    category: { type: String, required: true  },
    subCategory: { type: String, required: true }
  },schemaOptions);

module.exports = mongoose.model('FAQModel', FAQschema);