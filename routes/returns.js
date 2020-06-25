const HapiJoi = require('@hapi/joi');
const moment = require('moment');
const { Rental } = require('../models/rentals');
const { Movie } = require('../models/movies');
const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../middleware/async');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.post('/', [auth, validate(validateReturn)], asyncMiddleware(async(req, res) => {
    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId
    });

    if (!rental) return res.status(404).send('Rental not found');

    if (rental.dateReturned !== undefined) return res.status(400).send('Rental already processed');

    rental.dateReturned = new Date();
    const rentalDays = moment().diff(rental.dateOut, 'days')
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;

    await Movie.update({ _id: rental.movie._id}, {
        $inc: { numberInStock: 1 }
    });

    await rental.save();
    return res.status(200).send(rental);
}));

function validateReturn(req) {
    const schema = HapiJoi.object({
        customerId: HapiJoi.objectId().required(),
        movieId: HapiJoi.objectId().required()
    });
    return schema.validate(req);
}

module.exports = router;