const sessionModel = require("../Models/sessionModel");
const userModel = require("../Models/userModel");
const ticketsModel = require("../Models/ticketsModel");
const Agent = require("../Models/Agent");
const logError = require('../utils/logger');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const notificationModel = require("../Models/notificationModel");
const axios = require("axios"); // Import axios for making HTTP requests
const speakeasy = require("speakeasy");
const AutomatedWorkflowController = require("./AutomatedWorkflowController");
const automatedWorkflowController = require("./AutomatedWorkflowController");
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
    text: `${emailContent}`,
  };
  try {
    const notification = new notificationModel({
      from: '"HELPDESK" <sehelpdeskproject@outlook.com>',
      to: user.email,
      text: `${emailContent}`,
    });
    await notification.save();

    await transporter.sendMail(mailOptions);
    console.log('Updated Ticket sent successfully');

    // Delete the notification after 1 hour
    setTimeout(async () => {
      await notificationModel.deleteOne({ _id: notification._id });
      console.log('Notification deleted after 1 hour');
    }, 60 * 60 * 1000); // 1 hour in milliseconds
  } catch (error) {
    logError(error);
    console.error('Error sending email:', error);
    throw error;
  }

};
const updateTicketAndNotifyUser = async (ticketId, solution, userId) => {
  try {
    const user = await userModel.findById(userId);

    if (!user || !user.email) {
      throw new Error('User not found or missing email');
    }

    // Update ticket with solution and change status to 'closed'
    const updatedTicket = await ticketsModel.findByIdAndUpdate(ticketId,
      { solution, status: 'closed' },
      { new: true }
    );

    const emailContent = `Your ticket (ID: ${ticketId}) has been updated. Status: Closed. Solution: ${solution}`;
    sendEmailNotification(user, 'Ticket Updated and Closed', emailContent);

    return updatedTicket;
  } catch (error) {
    logError(error);
    throw new Error(error.message);
  }
};


const ticketsController = {
  getTickets: async (req, res) => {
    try {
      // Fetch all tickets from MongoDB
      const tickets = await ticketsModel.find();

      res.status(201).json({ message: "tickets successfully", tickets });
    } catch (error) {
      logError(error);
      res.status(500).json({ message: error.message });
    }
  },
  // Create a new ticket
  createTicket: async (req, res) => {
    try {
      const {
        user_id,
        category,
        subCategory,
        description,
        priority,
        status,
        agent_id,
        workflow
      } = req.body;

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
      console.log("a7aaaaaa")
      console.log(newTicket._id.toString());
      const idTicket = newTicket._id.toString();
      console.log(idTicket);
      // Call the endpoint to get the priority level


      const priorityLevel = await ticketsController.priorityy(subCategory);
      newTicket.priority = priorityLevel;
      await newTicket.save();



      // if (newTicket) {
      //   // Call the endpoint to trigger the automated workflow
      //   const workflowResult = await AutomatedWorkflowController.createAutomatedWorkflowWithRouting({
      //     category: newTicket.category,
      //     subCategory: newTicket.subCategory
      //   });
      // }
      if (newTicket) {
        // Call the endpoint to trigger the automated workflow
        const workflowResult = await automatedWorkflowController.createAutomatedWorkflowWithRouting();

        if (workflowResult && workflowResult.status === 200) {
          console.log('Automated workflow triggered successfully');
        } else {
          console.error('Error triggering automated workflow');
        }
      }
      res.status(201).json({ message: "Ticket created successfully", ticket: newTicket });
    } catch (error) {
      console.error("Error creating ticket:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  getAllTickets: async (req, res) => {
    try {
      const tickets = await ticketsModel.find().lean();
      return res.status(200).json({ tickets });
    } catch (error) {
      logError(error);
      console.error("Error fetching tickets:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  //update ticket
  updateTicket: async (req, res) => {
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
      logError(error);

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
      logError(error);
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
      logError(error);
      return res.status(500).json({ message: 'Error' });
    }
  },
  //priority
  priorityy: async (req, res) => {
    try {
      const tickets = await ticketsModel.findByIdAndUpdate(
        req.params.id,
      )
      let priorityLevel;

      const { subCategory } = req.body;
      if (subCategory == 'Desktops' || subCategory == 'Laptops') {
        priorityLevel = 'High';
      } else if (subCategory == 'Printers' || subCategory == 'Servers') {
        priorityLevel = 'Medium';
        // return res.status(200).json({ subCategory, message: 'priority = Medium' })
      } else if (subCategory == 'Networking equipment') {
        priorityLevel = 'Low';
        // return res.status(200).json({ subCategory, message: 'priority = Low' })
      }

      if (subCategory == 'Operating system') {
        priorityLevel = 'High';
        // return res.status(200).json({ subCategory, message: 'priority = High' })
      } else if (subCategory == 'Application software' || subCategory == 'Custom software') {
        priorityLevel = 'Medium';
        // return res.status(200).json({ subCategory, message: 'priority = Medium' })
      } else if (subCategory == 'Integration issues') {
        priorityLevel = 'Low';
        // return res.status(200).json({ subCategory, message: 'priority = Low' })
      }

      if (subCategory == 'Email issues') {
        priorityLevel = 'High';
        // return res.status(200).json({ subCategory, message: 'priority = High' })
      } else if (subCategory == 'Internet connection problems') {
        priorityLevel = 'Medium';
        // return res.status(200).json({ subCategory, message: 'priority = Medium' })
      } else if (subCategory == 'Website errors') {
        priorityLevel = 'Low';
        // return res.status(200).json({ subCategory, message: 'priority = Low' })
      }
      // return res.status(200).json({ subCategory, message: `priority = ${priorityLevel}` });
      return priorityLevel; // Return the computed priority level

    }
    catch (error) {
      logError(error);
      // return res.status(500).json({ message: 'Error', error: error.message });
      throw new Error('Error determining priority');

    }
  },
};
module.exports = ticketsController;