const mongoose = require('mongoose');

const userschema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 5 },
        displayName: { type: String },
        role: { type: String, required: false },
        otp: { type: String }, //s7
        mfa: { type: Boolean, default: false }, //s7
        available: { type: Boolean, default: false, required: false } // Ensure available is defined as Boolean

    },
    {
        strict: false,
        timestamps: true,
    }
);

module.exports = mongoose.model('userModel', userschema);