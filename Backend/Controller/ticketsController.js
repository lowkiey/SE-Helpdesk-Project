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
            const { user_id,
                category,
                subCategory,
                description,
                priority,
                status,
                agent_id,
                workflow } = req.body;
        
            const newTicket = new ticketsModel({
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
    },
    //update user

        updateTicket: async (req, res) => {
        try {
            const tickets = await ticketsModel.findByIdAndUpdate(
                req.params.id,
                { status: req.body.status },
                {
                    new: true,
                }
            );
            return res.status(200).json({ tickets, msg: "tucket updated successfully" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    
    deleteticket: async (req, res) => {
        try {
            const ticket = await ticketsModel.findByIdAndDelete(req.params.id);
            return res.status(200).json({ ticket, msg: "ticket deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
};
module.exports = ticketsController;