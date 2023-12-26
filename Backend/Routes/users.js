const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');
// * Get all users
router.get("/", authorizationMiddleware(['user', 'admin']), userController.getAllUsers);

router.get("/availableusers", authorizationMiddleware(['user', 'agent', 'manager', "admin"]), userController.getAvailableUsers);
// * Get one user
router.get("/:id", authorizationMiddleware(['user', 'agent', "admin", "manager"]), userController.getUser);

// * Update one user
router.put("/:id", authorizationMiddleware(['user']), userController.updateUser);

// * Delete one user
router.delete("/:id", authorizationMiddleware(['user']), userController.deleteUser);

// * Update user role
router.post("/assign", authorizationMiddleware(['user']), userController.updateRole);

// * Register user by admin
router.post("/create", authorizationMiddleware(['admin']), userController.registerByAdmin);

module.exports = router; // ! Don't forget to export the router