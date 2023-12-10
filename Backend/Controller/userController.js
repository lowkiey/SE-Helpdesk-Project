const userModel = require("../Models/userModel");
const sessionModel = require("../Models/sessionModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
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
  async function sendOtpEmail(user, otp) {
    console.log('Sending OTP email...');
    const mailOptions = {
        from: '"HELPDESK"', // Replace with your email address
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
  }
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
      
          const { otp } = req.body;
      
          if (!otp) {
            // Generate and send new OTP to user's email in database
            const newOtp = speakeasy.totp({
              secret: user.secret,
              encoding: "base32",
            });
            await sendOtpEmail(user, newOtp);
      
            // Prompt user for OTP
            return res.status(422).json({
              message: "OTP required for login. Check your email.",
            });
          }
      
          // Verify the provided OTP
          const verified = speakeasy.totp.verify({
            secret: user.secret,
            encoding: "base32",
            token: otp,
          });
      
          if (!verified) {
            // Invalid OTP, do not send another OTP
            return res.status(401).json({ message: "Invalid OTP" });
          }
      
          // Both password and OTP are valid, proceed to login
          const currentDateTime = new Date();
          const expiresAt = new Date(+currentDateTime + 1800000); // 3 minutes
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
      
          // Set cookie and respond with success
          return res
            .cookie("token", token, {
              expires: expiresAt,
              withCredentials: true,
              httpOnly: false,
              sameSite: "none",
            })
            .status(200)
            .json({ message: "Login successful", user });
        } catch (error) {
          console.error("Error logging in user:", error);
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
      const { email, role } = req.body;
      try {
        const user = await userModel.findOne({ email });
    
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        const updatedUser = await userModel.findOneAndUpdate(
          { email },
          { role },
        );
    
        return res.status(200).json({ message: "Role updated successfully", user: updatedUser });
      } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ message: "Server error" });
      }
    },
    logout: async (req, res) => { 
       try {
      // Get the token from the request cookies
      const token = req.cookies.token;
  
      // Delete the session from the database based on the token
      await sessionModel.findOneAndDelete({ token });
  
      // Clear the cookie on the client side
      res.clearCookie('token', {
        withCredentials: true,
        httpOnly: false,
        sameSite: 'none',
      });
      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Error logging out user:', error);
      res.status(500).json({ message: 'Server error' });
    }
},  
};
module.exports = userController;