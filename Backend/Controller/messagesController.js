const MessagesModel = require('../Models/Messages');
const nodemailer = require('nodemailer');
const axios = require('axios');
const speakeasy = require('speakeasy');
const User = require('../Models/userModel');
const Agent = require('../Models/Agent');
const logError = require('../utils/logger');
const ChatModel = require("../Models/ChatModel");
const { ReturnDocument } = require('mongodb');
const userModel = require('../Models/userModel');

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
    text: `tickets information is: ${result}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    logError(error);
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
    logError(error);
    console.error('Error sending email notification:', error);
    throw error;
  }
}

const messagesController = {

  updateMessage: async (req, res) => {
    try {
      const messages = await MessagesModel.findByIdAndUpdate(req.params.id, { message: req.body.message });


      // Update the timestamp
      // existingMessage.timestamp = new Date();
      // await existingMessage.save();

      // sendEmailNotification(user_id, 'Ticket Update', 'Your ticket has been updated.');

      // console.log("Message updated successfully");
      res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
      logError(error);
      res.status(409).json({ message: error.message });
    }
  },
  getMessageById: async (req, res) => {
    try {
      const messageId = req.params.id;
      if (!ObjectId.isValid(messageId)) {
        return res.status(400).json({ message: "Invalid message ID" });
      }
      const message = await MessagesModel.findById(messageId);

      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      res.status(200).json({ message });
    } catch (error) {
      logError(error);
      res.status(500).json({ message: error.message });
    }
  },
  getAllMessages: async (req, res) => {
    try {
      const messages = await MessagesModel.find();

      res.status(200).json({ messages });
    } catch (error) {
      logError(error);
      res.status(500).json({ message: error.message });
    }
  },
  deleteMessageById: async (req, res) => {
    try {
      const messageId = req.params.id;
      if (!ObjectId.isValid(messageId)) {
        return res.status(400).json({ message: "Invalid message ID" });
      }
      const deletedMessage = await MessagesModel.findByIdAndDelete(messageId);

      if (!deletedMessage) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
      logError(error);
      res.status(500).json({ message: error.message });
    }
  },
  saveMessage: async (req, res) => {
    try {
      const { message } = req.body;
      const newMessage = new MessagesModel({ message });
      await newMessage.save();
      res.status(200).json({ message: "Message saved successfully" });
    } catch (error) {
      logError(error);
      res.status(500).json({ message: error.message });
    }
  },

  sendMessage: async (req, res) => {
    try {
      const { user_id, agent_id, message } = req.body;
      if (!ObjectId.isValid(agent_id)) {
        return res.status(400).json({ message: "Invalid agent_id" });
      }

      const receiverSocketId = userSockets[agent_id];
      if (receiverSocketId) {
        // Send the message to the receiver using Socket.IO
        io.to(receiverSocketId).emit('new_message', { user_id, message });

        // Save the message to your database
        const newMessage = new MessagesModel({
          user_id: user_id,
          message,
        });

        await chat.save();

        res.status(200).json({ message: "Message sent successfully" });
      } else {
        return res.status(404).json({ message: "Receiver is not connected" });
      }
    } catch (error) {
      logError(error);
      res.status(500).json({ message: error.message });
    }

  },

  checkChat: async (userId, agentId, messages) => {
    return new Promise(async (myResolve, myReject) => {
      try {
        let chat = await ChatModel.findOne({ userId, agentId });

        if (!chat) {
          chat = await ChatModel.create({ userId, agentId, messages: [] });
        }

        // Assuming messages is an array of message objects
        if (messages && messages.length > 0) {
          chat.messages.push(...messages);
          await chat.save();
        }

        myResolve(chat);
      } catch (err) {
        myReject(err);
      }
    });
  },
  getAgent: async (type) => {

    return new Promise(async (myResolve, myReject) => {
      await userModel.findOne({ type, role: 'agent' })
        .then((agent) => {
          if (!agent) {
            myResolve('not available');
          } else {
            myResolve(agent);
          }
        })
        .catch((err) => {
          myReject(err);
        })

    })
  },

  getChat: async (req, res) => {
    try {
      res.status(200).json({
        agentId: req.cookies["token"]
      });
    } catch (err) {
      console.error('Error getting chat:', err);
      res.status(500).json({ error: err.message });
    }
  },



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
      logError(error);
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
      logError(error);
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

      if (!user || !agent) {
        return res.status(400).json({ error: 'User or Agent not found in the database' });
      }

      // Create a new chat document in the database
      const newChat = new ChatModel({
        userId: "",
        agentId: "",
        messages: [''], // You can initialize the messages array if needed
      });

      await newChat.save();

      io.emit('newPrivateChat', { chatId: chatId, userId, agentId });

      res.status(200).json({ message: "Chat saved successfully" });
    } catch (error) {
      logError(error);
      console.error('Error creating private chat:', error);
      res.status(500).json({ error: error.message });
    }
  },
  chatUser: async (req, res) => {
    try {
      const { userId } = req.body;

      const existingUser = await User.findById(userId);
      console.log(existingUser);
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      console.log("existingUser.user_id", existingUser._id.toString());

      // Check if the user is already available
      if (existingUser.available) {
        return res.status(200).json({ user: existingUser });
      }
      // Update the user's availability
      existingUser.available = true;
      await existingUser.save();


      // Return the user as a success response
      res.status(200).json({ user: existingUser });
    } catch (error) {
      console.error('Error while creating chat user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = messagesController;