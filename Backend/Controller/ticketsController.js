const sessionModel = require("../Models/sessionModel");
const userModel = require("../Models/userModel");
const ticketsModel = require("../Models/ticketsModel");
const Agent = require("../Models/Agent");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const axios = require("axios"); // Import axios for making HTTP requests
const speakeasy = require("speakeasy");
const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false, // Set to true if you're using port 465 (SSL), false for port 587 (TLS)
  auth: {
    user: 'sehelpdeskproject@outlook.com',
    pass: 'amirwessam2023',
  },
});
async function sendEmailNotification(user, subject, emailContent) {
  console.log('Sending email...');
  const mailOptions = {
    from: '"HELPDESK" <sehelpdeskproject@outlook.com>', // Replace with your email address
    to: user.email,
    subject: subject,
    text: ` ${emailContent}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(' email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
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
      await newTicket.save();
      res.status(201).json({ message: "ticket created successfully" });
    }
    catch (error) {
      console.error("Error creating ticket:", error);
      res.status(500).json({ message: "Server error" });


    }
  },
  //get all tickets
  getAllTickets: async (req, res) => {
    try {
      const tickets = await ticketsModel.find().lean();
      return res.status(200).json({ tickets });
    } catch (error) {
      console.error("Error fetching tickets:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  //update ticket
  updateTicket: async (req, res) => {
    console.log("hi");
    try {
      const tickets = await ticketsModel.findById(req.params.id);
      console.log(tickets);

      const assignedAgentId = await Agent.findById(tickets.agent_id);
      console.log(assignedAgentId);
      const { solution } = req.body;
      assignedAgentId.numberOfTickets -= 1;
      await assignedAgentId.save();

      //notification:to be done in frontend
      const updatedTicket = await updateTicketAndNotifyUser(tickets._id, solution, tickets.user_id);
      updatedTicket.status = 'closed';


      return res.status(200).json({ message: 'Ticket updated and closed successfully', updatedTicket });
    }
    catch (error) {

      return res.status(500).json({ message: error.message });
    }
  },

  //categorize tickets
  categoryTicket: async (req, res) => {
    try {
      const { category } = req.body;

      if (category === 'Software' || category === 'Hardware' || category === 'Network') {
        return res.status(200).json({ category, message: 'Choose your sub-category' });
      } else {
        return res.status(200).json({ message: 'Please chat with us' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error', error: error.message });
    }
  },

  //sub category
  subCategory: async (req, res) => {
    try {
      const { category } = req.body;
      if (category === 'Hardware') {
        return res.status(200).json({ message: ['Desktops', 'Laptops', 'Printers', 'Servers', 'Networking equipment'] });
      }
      else if (category === 'Software') {
        return res.status(200).json({ message: ['Operating system', 'Application software', 'Custom software', 'Integration issues'] });
      }
      else if (category === 'Network') {
        return res.status(200).json({ message: ['Email issues', 'Internet connection problems', 'Website errors'] });
      }
    }
    catch (error) {
      return res.status(500).json({ message: 'Error' });
    }
  },
  //priority
  priorityy: async (req, res) => {
    try {
      const tickets = await ticketsModel.findByIdAndUpdate(
        req.params.id,
      )
      const { subCategory } = req.body;
      if (subCategory == 'Desktops' || subCategory == 'Laptops') {
        return res.status(200).json({ subCategory, message: 'priority = High' })
      } else if (subCategory == 'Printers' || subCategory == 'Servers') {
        return res.status(200).json({ subCategory, message: 'priority = Medium' })
      } else if (subCategory == 'Networking equipment') {
        return res.status(200).json({ subCategory, message: 'priority = Low' })
      }

      if (subCategory == 'Operating system') {
        return res.status(200).json({ subCategory, message: 'priority = High' })
      } else if (subCategory == 'Application software' || subCategory == 'Custom software') {
        return res.status(200).json({ subCategory, message: 'priority = Medium' })
      } else if (subCategory == 'Integration issues') {
        return res.status(200).json({ subCategory, message: 'priority = Low' })
      }

      if (subCategory == 'Email issues') {
        return res.status(200).json({ subCategory, message: 'priority = High' })
      } else if (subCategory == 'Internet connection problems') {
        return res.status(200).json({ subCategory, message: 'priority = Medium' })
      } else if (subCategory == 'Website errors') {
        return res.status(200).json({ subCategory, message: 'priority = Low' })
      }
      return res.status(200).json({ priority });
    }
    catch (error) {
      return res.status(500).json({ message: 'Error', error: error.message });
    }
  },
};
const updateTicketAndNotifyUser = async (ticketId, solution, userId) => {
  try {
    // Update ticket with solution and change status to 'closed'
    const updatedTicket = await ticketsModel.findByIdAndUpdate(ticketId); // { new: true } returns the updated ticket

    // Send email notification to the user
    const user = await userModel.findById(userId); // Assuming user ID is available in the request
    const emailContent = `Your ticket (ID: ${ticketId}) has been updated. Status: Closed. Solution: ${solution}`;
    sendEmailNotification(user, 'Ticket Updated and Closed', emailContent);

    return updatedTicket;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = ticketsController;