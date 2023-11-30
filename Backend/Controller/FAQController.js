const FAQModel = require('../Models/FAQModel');
const sessionModel = require("../Models/sessionModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

const FAQController = {

createFAQ: async (req, res) => {
try {
const { title, content ,category ,subCategory} = req.body;
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
}
}

module.exports = FAQController;
