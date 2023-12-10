const MessagesModel = require('../Models/Messages');
const nodemailer = require("nodemailer");
const axios = require("axios"); // Import axios for making HTTP requests
const speakeasy = require("speakeasy");

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
      from: '"HELPDESK" <sehelpdeskproject@outlook.com>', // Replace with your email address
      to: user.email, // User's email address
      subject: 'Your ticket info for Login',
      text: "tickets informstion is: ${result},"
  };
  try {
      await transporter.sendMail(mailOptions);
      console.log('email sent successfully');
  } catch (error) {
      console.error('Error sending email:', error);
      throw error; // Make sure to rethrow the error to propagate it to the calling function
  }
};

const messageController = {
  createMessage: async (req, res) => {
    try {
      const { ticket_id, user_id, message } = req.body;

      if (!ticket_id || !user_id || !message) {
        return res.status(400).json({ error: "ticket_id, user_id, and message are required" });
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
      console.error("Error creating message:", error);
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
        return res.status(404).send("Message not found");
      }

      // Notify the user via email about the message update
      await sendEmailNotification(result);

      return res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  },
};

async function sendEmailNotification(message) {
  console.log('Sending email notification...');
  const mailOptions = {
    from: '"HELPDESK" <sehelpdeskproject@outlook.com>',
    to: 'georgeyoussef2002@gmail.com', // Replace with the user's email address
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

module.exports = messageController;
