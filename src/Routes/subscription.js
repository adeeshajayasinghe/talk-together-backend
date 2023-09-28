const express = require('express');
const router = express.Router();
const Joi = require('joi');
const axios = require('axios');
require('dotenv').config();


router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const apiURL = process.env.API_URL;
    const app_id = process.env.APP_ID;
    const api_key = process.env.API_KEY;

    async function makeApiRequest() {
        try {
          // Create the payload with default values and additional parameters
          const payload = {
            applicationId: app_id,
            password: api_key,
            subscriberId: req.body.subscriberId,
            action: req.body.action
            };
          // Make the POST request to the API
          const response = await axios.post(apiURL, payload);
      
          // Handle the API response here
          res.send(response.data);
        } catch (error) {
          // Handle errors here
          console.error('API Error:', error);
        }
      }



});

function validate(subscription){
    const schema = Joi.object({
        subscriberId: Joi.string().required(),
        action: Joi.string().valid('0', '1').required()
    });
    return schema.validate(subscription);
};

module.exports = router;