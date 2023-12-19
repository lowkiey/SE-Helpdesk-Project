const sessionModel = require("../Models/sessionModel");
const userModel = require("../Models/userModel");
const reportsModel = require("../Models/reportsModel");
const ticketsModel = require("../Models/ticketsModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const Agent = require("../Models/Agent");

const reportController = {
    createReport: async (req, res) => {
        const ticket_id = req.params.id;
        //const agent = req.user.userId;
        try {
            const {
                agent_id,
                ticketStatusReport,
                resoultionTimeReport,
                agentPreformanceReport
            } = req.body;
            const ticket = await ticketsModel.findById(ticket_id);
            if (!ticket) {
                return res.status(404).json({ message: "Ticket not found" });
            }
            // Fetch the agent's rating using the agent_id from the ticket
            const agent = await Agent.findById(agent_id);
            if (!agent) {
                return res.status(404).json({ message: "Agent not found" });
            }
            const agentRating = agent.rating;
            const newReport = new reportsModel({
                agent_id: agent_id,
                ticket_id: ticket_id,
                ticketStatusReport: ticketStatusReport,
                resoultionTimeReport: resoultionTimeReport,
                agentPreformanceReport: agentPreformanceReport,
                agentRating: agentRating // Include the agent's rating in the report
            });
            await newReport.save();
            res.status(201).json(newReport);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    viewReport: async (req, res) => {
        const ticket_id = req.params.id;
        try {
            const report = await reportsModel.findOne({ ticket_id });
    
            if (!report) {
                return res.status(404).json({ message: 'Report not found' });
            }
    
            res.status(200).json(report);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    
    },
    viewAllReports: async(req,res)=>{
      try {
        const reports = await reportsModel.find();
        return res.status(200).json(reports);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
    },
     viewIssues :async (req, res) => {
      const counts = {
        Hardware: {
          'Desktops': 0,
          'Laptops': 0,
          'Printers': 0,
          'Servers': 0,
          'Networking equipment': 0,
          total: 0,
        },
        Software: {
          'Operating system': 0,
          'Application software': 0,
          'Custom software': 0,
          'Integration issues': 0,
          total: 0,
        },
        Network: {
          'Email issues': 0,
          'Internet connection problems': 0,
          'Website errors': 0,
          total: 0,
        },
      };
      
      try {
        const allIssues = await ticketsModel.find();
      
        // Loop through each issue and update the counts
        allIssues.forEach((issue) => {
          // Check if the issue has category and subCategory fields
          if (issue && issue.category && issue.subCategory) {
            // Check if the category is one of the expected ones
            if (counts[issue.category]) {
              // Check if the subcategory is one of the expected ones
              if (counts[issue.category][issue.subCategory] !== undefined) {
                // Increment the count for the specific subcategory
                counts[issue.category][issue.subCategory]++;
                // Increment the total count for the category
                counts[issue.category].total++;
              } else {
                // Log subcategories that are not expected for debugging
                console.log(`Unexpected subcategory: ${issue.subCategory}`);
              }
            } else {
              // Log categories that are not expected for debugging
              console.log(`Unexpected category: ${issue.category}`);
            }
          } 
        });
      
        // Return the counts as a JSON response
        res.status(200).json(counts);
      } catch (err) {
        // Handle any errors that occur during the database query or processing
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      }
        }
      
  

};
module.exports = reportController; 
