const express = require('express');
const router = express.Router();
const {Movie} = require('../models/movies');
const {Customer} = require('../models/customers');
const {Rental, validate} = require('../models/rentals');
const Fawn = require('fawn');
const mongoose = require('mongoose');
const asyncMiddleware = require('../middleware/async');

Fawn.init(mongoose);

router.get('/', asyncMiddleware(async(req, res) => {
    const rentals = await Movie.find().sort('-dateOut');
    res.send(rentals)
}));

router.post('/', asyncMiddleware(async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error);

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie');

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer');

    let rental = new Rental({
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        }
    });
    // rental = await movie.save();

    // movie.numberInStock--;
    // movie.save();

    try {
        new Fawn.Task()
            .save('rentals', rental) // working directly with the colletion
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();
        res.send(movie);
    } catch (ex) {
        res.status(500).send('Something failed'); // 500 = internal server error
    }    
}));

module.exports = router;