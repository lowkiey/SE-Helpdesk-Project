const AgentModel = require("../Models/Agent");
const sessionModel = require("../Models/sessionModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const AgentController = {
    
};
module.exports = AgentController;
