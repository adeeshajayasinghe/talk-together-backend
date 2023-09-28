const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();

// Routes
const router1 = require('./Routes/users');
const router2 = require('./Routes/auth');

// Connect to mongoDB
mongoose.connect(process.env.DATABASE_CONNECTION_STRING);


// Middleware
app.use(express.json());
app.use(cors());
app.use('/register', router1);
app.use('/login', router2);

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Listen to port 4000
app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
