const express = require('express');
const router = express.Router();
const AutomatedWorkflowController = require("../Controller/AutomatedWorkFlowController");
const authorizationMiddleware = require('../Middleware/autherizationMiddleware');


// * OTP verification
// router.post('/verify-otp', userController.verifyOTP);
// * Get all users
router.get("/", authorizationMiddleware(['user']), AutomatedWorkflowController.createAutomatedWorkflowWithRouting);
// * Get one user
router.post("/create", authorizationMiddleware(['user']), AutomatedWorkflowController.createAutomatedWorkflow);

module.exports = router; // ! Don't forget to export the router

