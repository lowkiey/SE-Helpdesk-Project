const notificationModel = require("../Models/notificationModel");
const userModel = require("../Models/userModel");
const logError = require('../utils/logger');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

const notificationController = {
    getNotifications: async (req, res) => {
        try {
            const userEmail = req.query.email; // Get user email from query parameter

            if (!userEmail) {
                return res.status(400).json({ message: 'User email is required' });
              }     
            const notifications = await notificationModel.find({ to: userEmail }).lean();
            const notificationsCombined = notifications.map(notification => ({
                from: notification.from,
                text: notification.text
            }));

            return res.status(200).json({ notificationsCombined });
        } catch (error) {
            console.error("Error fetching notifications:", error);
            return res.status(500).json({ message: "Server error" });
        }
    }
};
module.exports = notificationController;
