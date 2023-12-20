const userModel = require("../Models/userModel");
const sessionModel = require("../Models/sessionModel");
const AgentModel = require("../Models/Agent");
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
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    } catch (error) {
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
        console.error('Error verifying OTP:', error);
        return false;
    }
};

const userController = {
    register: async (req, res) => {
        try {
            const { email, password, displayName, role } = req.body;

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
                role,
            });

            // Save the user to the database
            await newUser.save();

            // If the registered user is an agent
            if (role === "agent") {
                const { rating, resolution_time, ticket_id, agentType } = req.body;

                // Create a new agent
                const newAgent = new AgentModel({
                    user_id: newUser._id,
                    rating,
                    resolution_time,
                    ticket_id,
                    agentType,
                });

                // Save the agent to the database
                await newAgent.save();
            }

            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
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
            const generatedOTP = generateOTP();
            user.otp = generatedOTP; // Save OTP in user document
            await user.save();
            await sendOtpEmail(user, generatedOTP);

            return res.status(200).json({ message: 'OTP sent to your email', email });
        } catch (error) {
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
                { expiresIn: 120 * 60 * 60 }
            );
            const currentDateTime = new Date();
            const expiresAt = new Date(currentDateTime + 120 * 60 * 60 ); // expire in 3 minutes
            let newSession = new sessionModel({
                userId: user._id,
                token,
                expiresAt,
            });
            await newSession.save();
            const userId = user._id.toString();
            return res
                .cookie('token', token, {
                    expires: expiresAt,
                    withCredentials: true,
                    httpOnly: false,
              //  secure: true,
                })
                .status(200)
                .json({ message: 'Login successful', user });
        } catch (error) {
            console.error('Error completing login:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const users = await userModel.find();
            return res.status(200).json(users);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await userModel.findById(req.params.id);
            return res.status(200).json(user);
        } catch (error) {
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
            return res.status(500).json({ message: error.message });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const user = await userModel.findByIdAndDelete(req.params.id);
            return res.status(200).json({ user, msg: "User deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    getAllUserIds: async (req, res) => {
        try {
            const users = await userModel.find({}, '_id'); // Only retrieve the _id field
            const userIds = users.map(user => user._id);
            return res.status(200).json(userIds);
        } catch (error) {
            console.error('Error getting user IDs:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

};
module.exports = userController;