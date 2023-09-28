const mongoose = require('mongoose');
const Joi = require('joi');

// Create a schema for the user
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        max: 255
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        min: 10,
        max: 10
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 1024
    }
});

const User = mongoose.model('User', userSchema);

// Validate user
function validateUser(user) {
    const schema = Joi.object({
        fullName: Joi.string().max(255).required(),
        email: Joi.string().email().required(),
        mobile: Joi.string().min(10).max(10).required(),
        password: Joi.string().min(8).max(1024).required()
    });
    return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;