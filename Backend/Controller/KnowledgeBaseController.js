const KnowledgeBaseModel = require('../Model/KnowledgeBase');
const sessionModel = require('../Model/sessionModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");

const knowledgeBaseController = {
    create: async (req, res) => {
        try {
            const { title, content, category, subcategory } = req.body;
            const newKnowledgeBase = new KnowledgeBaseModel({
                title,
                content,
                category,
                subcategory,
            });
            await newKnowledgeBase.save();
            res.status(201).json({ message: "Knowledge base created successfully" });
        } catch (error) {
            console.error("Error creating knowledge base:", error);
            res.status(500).json({ message: "Server error" });
        }
    },
    get: async (req, res) => {
        try {
            const knowledgeBase = await KnowledgeBaseModel.find();
            res.status(200).json({ knowledgeBase });
        } catch (error) {
            console.error("Error getting knowledge base:", error);
            res.status(500).json({ message: "Server error" });
        }
    },
    update: async (req, res) => {
        try {
            const { title, content, category, subcategory } = req.body;
            const knowledgeBase = await KnowledgeBaseModel.findOneAndUpdate(
                { _id: req.params.id },
                {
                    title,
                    content,
                    category,
                    subcategory,
                }
            );
            res.status(200).json({ message: "Knowledge base updated successfully" });
        } catch (error) {
            console.error("Error updating knowledge base:", error);
            res.status(500).json({ message: "Server error" });
        }
    },
    delete: async (req, res) => {
        try {
            const knowledgeBase = await KnowledgeBaseModel.findOneAndDelete({
                _id: req.params.id,
            });
            res.status(200).json({ message: "Knowledge base deleted successfully" });
        } catch (error) {
            console.error("Error deleting knowledge base:", error);
            res.status(500).json({ message: "Server error" });
        }
    },
};

module.exports = knowledgeBaseController;
