const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController"); // Fix casing issue
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');
const fs = require('fs');
const path = require('path');
// * Get all users

router.get('/read-error-log', (req, res) => {
    const errorLogPath = path.join(__dirname, '..', 'file.txt');
    
    fs.readFile(errorLogPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Failed to read file:", err);
            return res.status(500).send('Error reading the file');
        }

        // Parse the file content and format the errors
        try {
            const errors = data.split('\n').filter(line => line.trim()).map(line => JSON.parse(line));
            const formattedErrors = errors.map(error => {
                // Format each error entry with a predefined layout
                return `Time: ${error.timestamp || 'Not provided'}\n` +
                       `Level: ${error.level}\n` +
                       `Message: ${error.message}\n` +
                       `${error.stack ? `Stack Trace: ${error.stack.replace(/\\n/g, '\n')}` : ''}`;
            }).join('\n\n');

            // Send the formatted errors in the response
            res.send({ content: formattedErrors });
        } catch (parseError) {
            console.error("Error parsing file contents:", parseError);
            res.status(500).send('Error parsing the log file');
        }
    });
});



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