// FAQController.js
const FAQModel = require('../Models/FAQModel');
const userModel = require("../Models/userModel");
const sessionModel = require("../Models/sessionModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

const FAQController = {
    createFAQ: async (req, res) => {
      try {
        const { title, content, category, subCategory } = req.body;
        const newFAQ = new FAQModel({
          title,
          content,
          category,
          subCategory,
        });
        await newFAQ.save();
        res.status(200).json({ msg: "FAQ created successfully" });
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
    },

    searchFAQ: async (req, res) => {
      const searchText = req.query.searchText.trim(); // Trim the search text
      if (!searchText) {
          return res.status(400).json({ msg: 'Search text is required' });
      }
      try {
          const FAQs = await FAQModel.find({
              $or: [
                  // { title: { $regex: new RegExp(searchText, 'i') } },
                  // { content: { $regex: new RegExp(searchText, 'i') } },
                  { category: { $regex: new RegExp(searchText, 'i') } }, // Search in category
                  { subCategory: { $regex: new RegExp(searchText, 'i') } }, // Search in subcategory
              ],
          });
          res.status(200).json({ msg: 'FAQs found successfully', FAQs });
      } catch (error) {
          res.status(500).json({ msg: error.message });
      }
  },
    searchFAQBySubcategory: async (req, res) => {
      const { subCategory } = req.query; // Assuming the subcategory is passed as a URL parameter
      try {
  
          const FAQs = await FAQModel.find({ subCategory: subCategory });
          res.status(200).json({ FAQs, subCategory });
      } catch (error) {
          res.status(500).json({ msg: error.message });
      }
  },
  
};


module.exports = FAQController;