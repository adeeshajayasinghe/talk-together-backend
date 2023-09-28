const express = require('express');
const router = express.Router();
const { User, validate } = require('../Models/User');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const mobilePattern = /^070\d{7}$/; // Regular expression to match "070" followed by 7 digits

    if (!mobilePattern.test(req.body.mobile)) {
        return res.status(400).json({ error: 'Service provider should be Mobitel.' });
    }

    let user = await User.findOne({mobile:req.body.mobile});
    if (user) {
        // return res.status(400).send('User already registered!')
        return res.status(400).json({ error: 'User already registered!' });
    }

    user = new User(_.pick(req.body, ['fullName', 'email', 'mobile', 'password']));
    // bcrypt used to hash the password
    // salt is like a key. Without salt we cannot decrypt the hashed password. salt is included in the password.
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user = await user.save();

    //  lodash is used to get specific items to the user as a response. Pick method is usefull for that purpose. 
    // Send the logged in token through a http header.
    const token = jwt.sign({_id:user._id, mobile:user.mobile}, process.env.JWT_SECRET_KEY);
    res.send(token);
});

module.exports = router;