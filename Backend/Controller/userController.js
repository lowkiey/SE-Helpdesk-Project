const userModel = require("../Models/userModel");
const sessionModel = require("../Models/sessionModel");
const AgentModel = require("../Models/Agent");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const axios = require("axios"); // Import axios for making HTTP requests
// const speakeasy = require("speakeasy");
// const transporter = nodemailer.createTransport({
//     host: 'smtp-mail.outlook.com',
//     port: 587,
//     secure: false, // Set to true if you're using port 465 (SSL), false for port 587 (TLS)
//     auth: {
//         user: 'sehelpdeskproject@outlook.com',
//         pass: 'amirwessam2023',
//     },
// });
// const generateOTP = (secret) => {
//     return speakeasy.totp({
//         secret: secret,
//         encoding: 'base32',
//     });
// }; async function sendOtpEmail(user, otp) {
//     console.log('Sending OTP email...');
//     const mailOptions = {
//         from: '"HELPDESK" <sehelpdeskproject@outlook.com>', // Replace with your email address
//         to: user.email, // User's email address
//         subject: 'Your OTP for Login',
//         text: `Your one-time password (OTP) is: ${otp}`,
//     };
//     try {
//         await transporter.sendMail(mailOptions);
//         console.log('OTP email sent successfully');
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw error; // Make sure to rethrow the error to propagate it to the calling function
//     }
// };

// const verifyOTP = async (email, otp) => {
//     try {
//         // Find the user by email
//         const foundUser = await userModel.findOne({ email });

//         if (!foundUser || foundUser.otp !== otp) {
//             return false; // OTP doesn't match or user not found
//         }

//         // If the OTP is valid, clear it from the database
//         foundUser.otp = null;
//         await foundUser.save();

//         return true; // OTP verified successfully
//     } catch (error) {
//         console.error('Error verifying OTP:', error);
//         return false;
//     }
// };
const userController = {
    // verifyOTP: async (req, res) => {
    //     try {
    //         const { email, otp } = req.body;

    //         const isOTPVerified = await verifyOTP(email, otp);

    //         if (isOTPVerified) {
    //             return res.status(200).json({ message: 'OTP verified successfully' });
    //         } else {
    //             return res.status(401).json({ message: 'Invalid OTP' });
    //         }
    //     } catch (error) {
    //         console.error('Error verifying OTP:', error);
    //         res.status(500).json({ message: 'Server error' });
    //     }
    // },
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
            const userid = newUser._id.toString();

            // Save the user to the database
            await newUser.save();

            // If the registered user is an agent
            if (role === "agent") {
                const { rating, resolution_time, ticket_id, agentAvailability } = req.body;
                const role = "agent";
                // Create a new agent
                const newAgent = new AgentModel({
                    user_id: userid,
                    rating,
                    resolution_time,
                    ticket_id,
                    agentAvailability,
                });

                const newUser = new userModel({
                    email,
                    password: hashedPassword,
                    role,
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

            // Generate and send new OTP to user's email in the database
            // const newOtp = generateOTP(user.secret);
            // await sendOtpEmail(user, newOtp);

            // // Proceed with OTP verification logic
            // const isOTPVerified = await verifyOTP(email, newOtp);

            // if (isOTPVerified) {
                // Clear the generated OTP from user object

                const currentDateTime = new Date();
                const expiresAt = new Date(+currentDateTime + 1800000); // expire in 3 minutes
                // Generate a JWT token
                const token = jwt.sign(
                    { user: { userId: user._id, role: user.role } },
                    secretKey,
                    {
                        expiresIn: 3 * 60 * 60,
                    }
                );

                let newSession = new sessionModel({
                    userId: user._id,
                    token,
                    expiresAt: expiresAt,
                });
                await newSession.save();

                return res
                    .cookie("token", token, {
                        expires: expiresAt,
                        withCredentials: true,
                        httpOnly: false,
                        sameSite: 'none'
                    })
                    .status(200)
                    .json({ message: "Login successful", user });
            // }
            // user.otp = null;
            // await user.save();


        } catch (error) {
            console.error("Error logging in:", error);
            res.status(500).json({ message: "Server error" });
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


};
module.exports = userController;
