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

            // Save the ticket to the database
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
categoryTicket : async (req, res) => {
    try {
        const tickets = await ticketsModel.findById(
            req.params.id,
            { category: req.body.category },
        )
        if (tickets.category != 'Software' || tickets.category != 'Hardware' || tickets.category != 'Network') {
            return res.status(200).json({ message:'please chat with us'});
         } 
         else {
            return res.status(200).json({ message:'choose your sub category'});
            }          
        } 
    catch (error) {
      return res.status(500).json({ message: 'Error', error: error.message });
    }
  },
  //priority based on sub category
  subCategoryPriority : async (req, res) => {
    try {
        const { category } = req.body;
        let priority = 'Low'; 
        if (category === 'Hardware') {        
            return res.status(200).json({ message:['Desktops', 'Laptops', 'Printers', 'Servers', 'Networking equipment']});
        }
             if (subCategory== 'Desktops' || subCategory== 'Desktops'){
                  priority='high';
             }
             else if (subCategory== 'Printers' || subCategory== 'Printers'){
                priority='Medium';
           }
           else if (subCategory== 'Networking equipment'){
            priority='low';
       }
          
        else if (category === 'Software') {
            return res.status(200).json({ message:['Operating system', 'Application software', 'Custom software', 'Integration issues']});
          } 
          if (subCategory== 'Operating system'){
            priority='high';
          }
          else if (subCategory== 'Application software' || subCategory== 'Custom software'){
          priority='Medium';
         }
          else if (subCategory== 'Integration issues'){
          priority='low';
         }
        else if (category === 'Network') {
            return res.status(200).json({ message:['Email issues', 'Internet connection problems', 'Website errors']});
          }
          if (subCategory== 'Email issues'){
            priority='high';
          }
          else if (subCategory== 'Internet connection problems' ){
          priority='Medium';
         }
          else if (subCategory== 'Website errors'){
          priority='low';
         }
        }
    catch (error) {
      return res.status(500).json({ message: 'Error'});
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