const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');
// * Get all users
router.get("/", authorizationMiddleware(['user','admin',"agent"]), userController.getAllUsers);
// * Get one user
router.get("/:id", authorizationMiddleware(['user','admin', "agent"]), userController.getUser);

// * Update one user
router.put("/:id", authorizationMiddleware(['user','admin', "agent"]), userController.updateUser);

// * Delete one user
router.delete("/:id", authorizationMiddleware(['user','admin', "agent"]), userController.deleteUser);

router.get("/users/id",authorizationMiddleware(['user','admin', "agent"]), userController.getAllUserIds);

module.exports = router; // ! Don't forget to export the router