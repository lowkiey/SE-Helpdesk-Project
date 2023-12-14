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
const userController = {
    register: async (req, res) => {
        try {
            const { email, password, displayName} = req.body;

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
    
          // Check password
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
              httpOnly: false, // Set to true if the token should not be accessible via client-side scripts
              sameSite: "lax", // Use 'none' for cross-origin and ensure using HTTPS
              secure: false, // Set to true in production if using HTTPS
            })
            .status(200)
            .json({ message: "Login successful", user, token }); // Send the token back to the client
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
    updateRole: async (req, res) => {
      const { _id, role } = req.body;
      try {
        const user = await userModel.findOne({ _id });
    
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        const agentCount = await userModel.countDocuments({ role: "agent" });

        if (role === "agent" && agentCount >= 3) {
          return res.status(400).json({ message: "Maximum number of agents reached" });
        }
        const updatedUser = await userModel.findOneAndUpdate(
          { _id },
          { role },
        );
    
        return res.status(200).json({ message: "Role updated successfully", user: updatedUser });
      } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ message: "Server error" });
      }
    }


};
module.exports = userController;