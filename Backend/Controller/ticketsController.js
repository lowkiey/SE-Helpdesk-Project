const sessionModel = require("../Models/sessionModel");
const userModel = require("../Models/userModel");
const ticketsModel = require("../Models/ticketsModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
// Create a new ticket
const ticketsController = {
createTicket: async (req, res) => {
        try {
            const { user_id,
                category,
                subCategory,
                description,
                priority,
                status,
                agent_id,
                workflow } = req.body;
        
            const newTicket = new ticketsModel({
                user_id,
                category,
                subCategory,
                description,
                priority,
                status,
                agent_id,
                workflow
            });
            await newTicket.save();
            res.status(201).json({ message: "ticket created successfully" });
        }
        catch (error) {
            console.error("Error creating ticket:", error);
            res.status(500).json({ message: "Server error" });


        }
    },
//update ticket
  updateTicket: async (req, res) => {
        try {
            const tickets = await ticketsModel.findByIdAndUpdate(
                req.params.id,
                { status: req.body.status },
                {
                    new: true,
                }
            );
            return res.status(200).json({ tickets, msg: "ticket updated successfully" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
//delete ticket
  deleteticket: async (req, res) => {
        try {
            const ticket = await ticketsModel.findByIdAndDelete(req.params.id);
            return res.status(200).json({ ticket, msg: "ticket deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
//categorize tickets
    categoryTicket: async (req, res) => {
        try {
          const { category } = req.body;
      
          if (category === 'Software' || category === 'Hardware' || category === 'Network') {
            return res.status(200).json({category, message: 'Choose your sub-category' });
          } else {
            return res.status(200).json({ message: 'Please chat with us' });
          }
        } catch (error) {
          return res.status(500).json({ message: 'Error', error: error.message });
        }
      },
      
      
//sub category
  subCategory : async (req, res) => {
    try {
        const { category } = req.body;
        if (category === 'Hardware') {        
            return res.status(200).json({  message:['Desktops', 'Laptops', 'Printers', 'Servers', 'Networking equipment']});
        } 
        else if (category === 'Software') {
            return res.status(200).json({ message:['Operating system', 'Application software', 'Custom software', 'Integration issues']});
          }      
        else if (category === 'Network') {
            return res.status(200).json({ message:['Email issues', 'Internet connection problems', 'Website errors']});    
        }
    }
    catch (error) {
      return res.status(500).json({ message: 'Error'});
    }
  },
//priority
  priorityy: async (req, res) => {
    try {
        const tickets = await ticketsModel.findByIdAndUpdate(
            req.params.id,      
        )
        const { subCategory } = req.body;
      if (subCategory == 'Desktops' || subCategory == 'Laptops') {
        return res.status(200).json({ subCategory, message:'priority = High'})
      } else if (subCategory == 'Printers' || subCategory == 'Servers') {
        return res.status(200).json({ subCategory, message:'priority = Medium'})
      } else if (subCategory == 'Networking equipment') {
        return res.status(200).json({subCategory, message:'priority = Low'})
      }
  
      if (subCategory == 'Operating system') {
        return res.status(200).json({ subCategory, message:'priority = High'})
      } else if (subCategory == 'Application software' || subCategory == 'Custom software') {
        return res.status(200).json({subCategory, message:'priority = Medium'})
      } else if (subCategory == 'Integration issues') {
        return res.status(200).json({ subCategory,message:'priority = Low'})
      }
  
      if (subCategory == 'Email issues') {
        return res.status(200).json({ subCategory, message:'priority = High'})
      } else if (subCategory == 'Internet connection problems') {
        return res.status(200).json({subCategory, message:'priority = Medium'})
      } else if (subCategory == 'Website errors') {
        return res.status(200).json({ subCategory, message:'priority = Low'})
      }
  return res.status(200).json({ priority });
    } 
    catch (error) {
      return res.status(500).json({ message: 'Error', error: error.message });
    }
  }, 
//workflow
  workflowIssue: async (req, res) => {
    try {
        const tickets = await ticketsModel.findById(
            req.params.id,
            { workflow: req.body.workflow },
        )

    await tickets.save();
    return res.status(200).json({ message: 'Custom workflow assigned successfully', tickets });
  } 
  catch (error) {
    return res.status(500).json({ message: 'Error assigning custom workflow', error: error.message });
  }
    }
};

module.exports = ticketsController;