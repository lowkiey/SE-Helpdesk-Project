const userModel = require("../Models/userModel");
const sessionModel = require("../Models/sessionModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
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
                return res.status(404).json({ message: "User not found" });
            }

            // Check if the password is correct
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(405).json({ message: "Incorrect password" });
            }

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