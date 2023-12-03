const userModel = require("../Models/userModel");
const sessionModel = require("../Models/sessionModel");
const MessagesModel = require("../Models/MessagesModel");
const ticketsModel = require("../Models/ticketsModel");
const express = require('express');
const jwt = require("jsonwebtoken");
const socketIO = require('socket.io');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const ObjectId = require("mongoose").Types.ObjectId; // Add this line
const app = express();
const http = require('http');
const server = http.createServer(app);  // Create an instance of http.Server using express app as a callback
const io = socketIO(server);

const PORT = process.env.PORT || 0;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const MessagesController = {
    createMessage: async (req, res) => {
        try {
            console.log("hello");
            const { ticket_id, user_id, message } = req.body;
            console.log(req.body);

            // Check if ticket_id is a valid ObjectId
            if (!ObjectId.isValid(ticket_id)) {
                return res.status(400).json({ message: "Invalid ticket_id" });
            }

            const newMessage = new MessagesModel({
                ticket_id: new ObjectId(ticket_id),
                user_id,
                message,
            });

            console.log(newMessage);

            await newMessage.save();
            console.log("gj");
            res.status(201).json({ message: "created successfully" });
        } catch (error) {
            res.status(409).json({ message: error.message });
        }
    },
    updateMessage: async (req, res) => {
        try {
            const messages=await MessagesModel.findByIdAndUpdate(req.params.id,{message:req.body.message});
           

            // Update the timestamp
            // existingMessage.timestamp = new Date();
            // await existingMessage.save();

            // sendEmailNotification(user_id, 'Ticket Update', 'Your ticket has been updated.');

            // console.log("Message updated successfully");
             res.status(200).json({ message: "Updated successfully" });
        } catch (error) {
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
            res.status(500).json({ message: error.message });
        }
    },
    getAllMessages: async (req, res) => {
        try {
            const messages = await MessagesModel.find();

            res.status(200).json({ messages });
        } catch (error) {
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
            res.status(500).json({ message: error.message });
        }
    },
    sendMessage: async(req,res)=>{
        try{
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

                await newMessage.save();

                res.status(200).json({ message: "Message sent successfully" });
            } else {
                return res.status(404).json({ message: "Receiver is not connected" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    },
    //sendEmailNotification: async (req,res,to, subject, text) => {
//         try {
           
//             await transporter.sendMail({
//                 from: 'agent@email',
//                 to,
//                 subject,
//                 text,
//             });// console.log('Email notification sent successfully');
//     const ticket = await ticketsModel.findById(req.params.id)  
//     const user_id = req.user.userId;      
//     const user = await userModel.findById(user_id);
//     const userEmail = user.email;
//     //Fetch support email dynamically
//     const agent = await userModel.findOne({ role:agent });
//     const agentEmail = agent.email;

//     // Send email notification to user
//     const subjectUser = 'Ticket Update';
//     const textUser = 'Your ticket has been updated.';
//     await sendEmailNotification(userEmail, subjectUser, textUser);

//     // Send email notification to support
//     const subjectAgent = 'New User Message';
//     const textAgent = 'A user has sent a new message.';
//     await sendEmailNotification(agentEmail, subjectAgent, textAgent);

//     res.status(201).json({ message: 'created successfully' });

// } catch (error) {
//     console.log("hi");
//     res.status(500).json({ message: error.message });
// }
// },
//     sendEmailNotification: async (req,res) => {
//         try {
//     const user_id = req.user.userId;   
//     const ticket = await ticketsModel.findById(req.params.id)       
//     const user = await userModel.findById(user_id);
//     const userEmail = user.email;


//     // Fetch support email dynamically
//     const agent = await userModel.findOne({ role:agent });
//     const agentEmail = agent.email;

//     // Send email notification to user
//     const subjectUser = 'Ticket Update';
//     const textUser = 'Your ticket has been updated.';
//     await sendEmailNotification(userEmail, subjectUser, textUser);

//     // Send email notification to support
//     const subjectAgent = 'New User Message';
//     const textAgent = 'A user has sent a new message.';
//     await sendEmailNotification(agentEmail, subjectAgent, textAgent);

//     res.status(201).json({ message: 'sent successfully' });

// } catch (error) {
//     console.log("hi");
//     res.status(500).json({ message: error.message });
// }
// },

// //real-time chat
// sendAgentMessage: async (req, res) => {
//     try {
//         const ticket = await ticketsModel.findById(req.params.id) 
//         const { user_id, message } = req.body;

//         // Fetch user email dynamically
//         const user = await userModel.findById(user_id);
//         console.log(user);
//         const userEmail = user.email;

//         // Fetch agent email dynamically
//         const agentEmail = req.user.email; // Assuming agent information is stored in req.user

//         // Combine user and agent emails
//         const toEmails = [userEmail, agentEmail];

//         // Send email notification to both user and agent
//         const subject = 'New Chat Message';
//         await sendEmailNotification(toEmails, subject, message);

//         // Emit the message to the user in real-time
//         io.emit(`user-${user_id}`, { sender: agentEmail, message });

//         // Save the agent-initiated message in the database if needed
//         const newMessage = new MessagesModel({
//             user_id,
//             sender_id: req.user._id, // Assuming sender_id is stored in req.user
//             message,
//         });
//         await newMessage.save();

//         res.status(201).json({ message: 'Chat message sent successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// // },
// io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     // Handle when a user connects
//     socket.on('user_connect', (userId) => {
//         userSockets[userId] = socket.id;
//     });
//     // Handle incoming messages from users
//     socket.on('user_message', async ({ userId, message }) => {
//         const agentSocketId = userSockets[userId];
//         if (agentSocketId) {
//             io.to(agentSocketId).emit('agent_message', { userId, message });

//             // Save the message to your database
//             const newMessage = new MessagesModel({
//                 user_id: userId,
//                 message,
//             });

//             await newMessage.save();
//         } else {
//             // Handle the case where the user is not connected to an agent
//             console.log(`User ${userId} not connected to any agent.`);
//         }
//     });
// sendMessageToUser: async (req, res) => {
//     try {
//         const { user_id, message } = req.body;

//         // Fetch user and agent information dynamically
//         const user = await userModel.findById(user_id);
//         const agentEmail = req.user.email; // Assuming agent information is stored in req.user
//         // Combine user and agent emails
//         const toEmails = [user.email, agentEmail];

//         // Send email notification to both user and agent
//         const subject = 'New Support Message';
//         await sendEmailNotification(toEmails, subject, message);
//         res.status(201).json({ message: 'Message sent successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }


};
module.exports = MessagesController;