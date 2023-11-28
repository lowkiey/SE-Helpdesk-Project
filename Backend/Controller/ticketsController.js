const sessionModel = require("../Models/sessionModel");
const userModel = require("../Models/userModel");
const ticketsModel = require("../Models/ticketsModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
// Create a new ticket
const ticketsController = {
    createTicket: async (req, res) => {
        try {
            const { id, user_id, category, subCategory, description, priority, status, agent_id, workflow } = req.body;
            // Check if the ticket already exists
            const existingticket = await ticketsModel.findOne({ id });
            if (existingticket) {
                return res.status(409).json({ message: "ticket already exists" });
            }
            // Create a new ticket
            const newTicket = new ticketsModel({
                id,
                user_id,
                category,
                subCategory,
                description,
                priority,
                status,
                agent_id,
                workflow
            });

            // Save the ticket to the database
            await newTicket.save();
            res.status(201).json({ message: "ticket created successfully" });
        }
        catch (error) {
            console.error("Error creating ticket:", error);
            res.status(500).json({ message: "Server error" });
        }

    }
};