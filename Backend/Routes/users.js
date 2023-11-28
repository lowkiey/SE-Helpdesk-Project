const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');
// * Get all users
router.get("/",  authorizationMiddleware(['admin']),userController.getAllUsers);
// * Get one user
router.get("/:id", authorizationMiddleware(['admin','customer']), userController.getUser);

// * Update one user
router.put("/:id",  authorizationMiddleware(['admin','customer']),userController.updateUser);

// * Delete one user
router.delete("/:id", authorizationMiddleware(['admin']), userController.deleteUser);
module.exports = router; // ! Don't forget to export the router