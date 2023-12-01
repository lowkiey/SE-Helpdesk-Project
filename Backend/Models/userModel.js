const mongoose = require('mongoose');

const userschema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 5 },
        displayName: { type: String },
        role: { type: String, required: true },
    },
    {
        strict: false,
        timestamps: true,
    }
);

module.exports = mongoose.model('Users', userschema);