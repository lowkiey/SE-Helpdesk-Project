const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');
// * OTP verification
// router.post('/verify-otp', userController.verifyOTP);
// * Get all users
router.get("/", authorizationMiddleware(['user']), userController.getAllUsers);
// * Get one user
router.get("/:id", authorizationMiddleware(['user']), userController.getUser);

// * Update one user
router.put("/:id", authorizationMiddleware(['user']), userController.updateUser);

// * Delete one user
router.delete("/:id", authorizationMiddleware(['user']), userController.deleteUser);
// router.put("/", authorizationMiddleware(['admin']), userController.updateRole);

module.exports = router; // ! Don't forget to export the router