const MessagesModel = require('../Models/Messages');
const nodemailer = require('nodemailer');
const axios = require('axios');
const speakeasy = require('speakeasy');
const User = require('../Models/userModel');
const Agent = require('../Models/Agent');
const ChatModel= require("../Models/ChatModel");



const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: 'sehelpdeskproject@outlook.com',
    pass: 'amirwessam2023',
  },
});

async function sendTicketEmail(user, result) {
  console.log('Sending ticket info ...');
  const mailOptions = {
    from: '"HELPDESK" <sehelpdeskproject@outlook.com>',
    to: user.email,
    subject: 'Your ticket info for Login',
    text: `tickets information is: ${result},`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

async function sendEmailNotification(message) {
  console.log('Sending email notification...');
  const mailOptions = {
    from: '"HELPDESK" <sehelpdeskproject@outlook.com>',
    to: 'georgeyoussef2002@gmail.com',
    subject: 'Ticket Update',
    text: `Your ticket with ID ${message.ticket_id} has been updated: ${message.message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw error;
  }
}

const messageController = {
  createMessage: async (req, res) => {
    try {
      const { ticket_id, user_id, message } = req.body;

      if (!ticket_id || !user_id || !message) {
        return res.status(400).json({ error: 'ticket_id, user_id, and message are required' });
      }

      const newMessage = new MessagesModel({
        ticket_id,
        user_id,
        message,
      });

      const result = await newMessage.save();

      // Notify the user via email
      await sendEmailNotification(result);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ error: error.message });
    }
  },

  updateMessage: async (req, res) => {
    const messageId = req.params.id;
    const { message } = req.body;

    try {
      const result = await MessagesModel.findByIdAndUpdate(
        messageId,
        { $set: { message } },
        { new: true }
      );

      if (!result) {
        return res.status(404).send('Message not found');
      }

      // Notify the user via email about the message update
      await sendEmailNotification(result);

      return res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  },

  createPrivateChat: async (req, res) => {
    try {
      const { userId, agentId } = req.body;

      // Validate input
      if (!userId || !agentId) {
        return res.status(400).json({ error: 'userId and agentId are required' });
      }
      const user = await User.findById(userId);
      const agent = await Agent.findById(agentId);

      if (!user|| !agent) {
        return res.status(400).json({ error: ' el ids msh fl db ' });
      }

     
      // Create a new chat document in the database
      const newChat = new ChatModel({
        users: [userId, agentId],
        messages: ['welcome'], // You can initialize the messages array if needed
      });

      await newChat.save();

      //io.emit('newPrivateChat', { chatId, userId, agentId });

      res.status(200).json({ message: "Chat saved successfully" });
    } catch (error) {
      console.error('Error creating private chat:', error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = messageController;
