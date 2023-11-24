const mongoose = require('mongoose');
const schemaOptions = {
    strict: false,
    timestamps: true,
};
const userschema = new mongoose.Schema(
    {
        id:{ type:mongoose.Schema.Types.ObjectId, required:true, unique:true},
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 5 },
        displayName: { type: String },
        role: {
            type: String,
            required: true,

        },

    },
    // schemaOptions
    {
        strict: false,
        timestamps: true,
    }
);


module.exports = mongoose.model('userModel', userschema);