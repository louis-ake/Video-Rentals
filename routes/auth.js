const bcrypt = require('bcryptjs');
const HapiJoi = require('@hapi/joi');
const {User} = require('../models/users');
const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../middleware/async');

router.post('/', asyncMiddleware(async(req, res) => {
    const { error } = validateAuth(req.body);
    if (error) return res.status(400).send(error);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password'); // don't want to send a 404 as this gives too much information to the client

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    return res.status(200).send(token); // if it gets to this point, is valid 
}));

function validateAuth(req) {
    const schema = HapiJoi.object ({
        email: HapiJoi.string().min(5).max(255).required().email(),
        password: HapiJoi.string().min(5).max(255).required()
    });
    return schema.validate(req);
}

module.exports = router;