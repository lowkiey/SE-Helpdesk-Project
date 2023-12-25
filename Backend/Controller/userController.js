const userModel = require("../Models/userModel");
const sessionModel = require("../Models/sessionModel");
const AgentModel = require("../Models/Agent");
const notificationModel = require("../Models/notificationModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const axios = require("axios"); // Import axios for making HTTP requests
const speakeasy = require("speakeasy");
const logError = require('../utils/logger');

const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false, // Set to true if you're using port 465 (SSL), false for port 587 (TLS)
    auth: {
        user: 'sehelpdeskproject@outlook.com',
        pass: 'amirwessam2023',
    },
});
const generateOTP = (secret) => {
    return speakeasy.totp({
        secret: secret,
        encoding: 'base32',
    });
};
async function sendOtpEmail(user, otp) {
    console.log('Sending OTP email...');
    const mailOptions = {
        from: '"HELPDESK" <sehelpdeskproject@outlook.com>', // Replace with your email address
        to: user.email, // User's email address
        subject: 'Your OTP for Login',
        text: `Your one-time password (OTP) is: ${otp}`,
    };
    try {
        // const notification = new notificationModel({
        //     from: '"HELPDESK" <sehelpdeskproject@outlook.com>',
        //     to: user.email,
        //     text: `Your one-time password (OTP) is: ${otp}`,
        // });
        // await notification.save();

        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');

        // // Delete the notification after 1 hour
        // setTimeout(async () => {
        //     await notificationModel.deleteOne({ _id: notification._id });
        //     console.log('Notification deleted after 1 hour');
        // }, 60 * 60 * 1000); // 1 hour in milliseconds
    } catch (error) {
        logError(error);
        console.error('Error sending email:', error);
        throw error; // Make sure to rethrow the error to propagate it to the calling function
    }
};
const verifyOTP = async (email, otp) => {
    try {
        const foundUser = await userModel.findOne({ email });

        if (!foundUser || foundUser.otp !== otp) {
            return false;
        }

        // Clear OTP after successful verification
        foundUser.otp = null;
        await foundUser.save();

        return true;
    } catch (error) {
        logError(error);
        console.error('Error verifying OTP:', error);
        return false;
    }
};

const userController = {

    getAvailableUsers: async (req, res) => {
        try {
            // Find all available users
            const availableUser = await userModel.find({ available: true }).lean();

            res.status(200).json({ availableUser });
        } catch (error) {
            logError(error);
            console.error('Error fetching available users:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    //Register El adima
    // register: async (req, res) => {
    //     try {
    //         const { email, password, displayName, role } = req.body;

    //         // Check if the user already exists
    //         const existingUser = await userModel.findOne({ email });

    //         if (existingUser) {
    //             return res.status(409).json({ message: "User already exists" });
    //         }

    //         // Hash the password
    //         const hashedPassword = await bcrypt.hash(password, 10);

    //         // Create a new user
    //         const newUser = new userModel({
    //             email,
    //             password: hashedPassword,
    //             displayName,
    //             role,
    //         });

    //         // Save the user to the database
    //         await newUser.save();

    //         // If the registered user is an agent
    //         if (role === "agent") {
    //             const { rating, resolution_time, ticket_id, agentType } = req.body;

    //             // Create a new agent
    //             const newAgent = new AgentModel({
    //                 user_id: newUser._id,
    //                 rating,
    //                 resolution_time,
    //                 ticket_id,
    //                 agentType,
    //             });

    //             // Save the agent to the database
    //             await newAgent.save();
    //         }

    //         res.status(201).json({ message: "User registered successfully" });
    //     } catch (error) {
    // logError(error);

    //         console.error("Error registering user:", error);
    //         res.status(500).json({ message: "Server error" });
    //     }
    // },

    register: async (req, res) => {
        try {
            const { email, password, displayName, mfa } = req.body;

            // Check if the user already exists
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: "User already exists" });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const newUser = new userModel({
                email,
                password: hashedPassword,
                displayName,
                mfa
            });

            // Save the user to the database
            await newUser.save();

            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            logError(error);
            console.error("Error registering user:", error);
            res.status(500).json({ message: "Server error" });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find the user by email
            const user = await userModel.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check password
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {

                return res.status(405).json({ message: 'Incorrect password' });
            }

            // Generate and send OTP to user's email 
            if (user.mfa === true) {

                const generatedOTP = generateOTP();
                user.otp = generatedOTP; // Save OTP in user document
                await user.save();
                await sendOtpEmail(user, generatedOTP);
                return res.status(200).json({ message: 'OTP sent to your email', email, user });
            }
            else {


                const { _id, displayName, role } = user;

                const token = jwt.sign(
                    { user: { userId: user._id, role: user.role } },
                    secretKey,
                    { expiresIn: 3 * 60 * 60 }
                );
                const currentDateTime = new Date();
                const expiresAt = new Date(+currentDateTime + 180000000); // 3 hours
                let newSession = new sessionModel({
                    userId: user._id,
                    token,
                    // expiresAt,
                });
                await newSession.save();
                const userId = user._id.toString();

                const userNotifications = await notificationModel.find({ to: email }).lean();

                return res
                    .cookie('token', token, {
                        expires: expiresAt,
                        withCredentials: true,
                        httpOnly: false,
                        sameSite: 'none',
                        secure: true,    //comment this if u want to run using thunder client
                    })
                    .status(200)
                    .json({ message: 'Login successful', user, token, userNotifications });
            }
        } catch (error) {
            logError(error);
            console.error('Error initiating login:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    verify: async (req, res) => {
        try {
            const { email, otp } = req.body;

            const isOTPVerified = await verifyOTP(email, otp);

            if (!isOTPVerified) {
                return res.status(406).json({ message: 'Invalid OTP' });
            }
            const user = await userModel.findOne({ email });
            const { _id, displayName, role } = user;

            const token = jwt.sign(
                { user: { userId: user._id, role: user.role } },
                secretKey,
                { expiresIn: 3 * 60 * 60 }
            );
            const currentDateTime = new Date();
            const expiresAt = new Date(+currentDateTime + 180000000); // 3 hours
            let newSession = new sessionModel({
                userId: user._id,
                token,
                // expiresAt,
            });
            await newSession.save();
            const userId = user._id.toString();

            const userNotifications = await notificationModel.find({ to: email }).lean();

            return res
                .cookie('token', token, {
                    expires: expiresAt,
                    withCredentials: true,
                    httpOnly: false,
                    sameSite: 'none',
                    secure: true,    //comment this if u want to run using thunder client
                })
                .status(200)
                .json({ message: 'Login successful', user, token, userNotifications });
        } catch (error) {
            logError(error);
            console.error('Error completing login:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const users = await userModel.find();
            return res.status(200).json(users);
        } catch (e) {
            logError(error);

            return res.status(500).json({ message: e.message });
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await userModel.findById(req.params.id);
            return res.status(200).json(user);
        } catch (error) {
            logError(error);
            return res.status(500).json({ message: error.message });
        }
    },
    updateUser: async (req, res) => {
        try {
            const user = await userModel.findByIdAndUpdate(
                req.params.id,
                { name: req.body.name },
                {
                    new: true,
                }
            );
            return res.status(200).json({ user, msg: "User updated successfully" });
        } catch (error) {
            logError(error);
            return res.status(500).json({ message: error.message });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const user = await userModel.findByIdAndDelete(req.params.id);
            return res.status(200).json({ user, msg: "User deleted successfully" });
        } catch (error) {
            logError(error);
            return res.status(500).json({ message: error.message });
        }
    },
    updateRole: async (req, res) => {
        const { displayName, role } = req.body;
        try {
            const user = await userModel.findOne({ displayName });

            if (!user) {

                return res.status(404).json({ message: "User not found" });
            };
            const agentCount = await userModel.countDocuments({ role: "agent" });

            if (role === "agent") {
                const { rating, resolution_time } = req.body;

                // Create a new agent
                const newAgent = new AgentModel({
                    user_id: user._id,
                    rating,
                    resolution_time,
                    // ticket_id
                });

                // Save the agent to the database
                await newAgent.save();

            }
            if (role === "agent" && agentCount >= 3) {
                return res.status(400).json({ message: "Maximum number of agents reached" });
            }
            const updatedUser = await userModel.findOneAndUpdate(
                { displayName },
                { role },
            );

            return res.status(200).json({ message: "Role updated successfully", user: updatedUser });
        } catch (error) {
            logError(error);
            console.error("Error updating user role:", error);

            res.status(500).json({ message: "Server error" });
        }
    }

};


module.exports = userController;
