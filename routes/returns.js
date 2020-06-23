const { Rental } = require('../models/rentals');
const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../middleware/async');

router.post('/', asyncMiddleware(async(req, res) => {
    if (!req.body.customerId) return res.status(400).send('customerId not provided');
    if (!req.body.movieId) return res.status(400).send('movieId not provided');

    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId
    });

    if (!rental) return res.status(404).send('Rental not found');
    
    if (rental.dateReturned !== undefined) return res.status(400).send('Rental already processed');

    res.status(401).send('unauthorised');
}));

module.exports = router;