const express = require('express');
const router = express.Router();
const { User } = require('../Models/User');
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // Get the user by mobile number
    let user = await User.findOne({mobile: req.body.mobile});
    if (!user) {
        return res.status(400).json({ error: 'Incorrect mobile number or password!' });
    }

    // Check for the password decrypting the user input. 
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).json({ error: 'Incorrect mobile number or password!' });
    }
    /*After logged in server sends a token to the user. Usign this don't need to query the database for some details (like email which is 
        included in the payload) in the next time that user trying to log in.
        First para: payload, second para: Private key(shouldn't be hard coded in the source code like this. This use to identify the user by 
        the server from the token)*/
    // In powershell use $env:variablename = "value" to set environment variables. 'set' will not work.
   const token = jwt.sign({_id:user._id, mobile:user.mobile}, process.env.JWT_SECRET_KEY);
   res.send({token: token, userID: user._id});
});

function validate(user){
    const schema = Joi.object({
        mobile: Joi.string().min(10).max(10).required(),
        password: Joi.string().min(8).max(255).required()
    });
    return schema.validate(user);
};


module.exports = router;