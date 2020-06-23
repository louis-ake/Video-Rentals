const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {Movie, validate} = require('../models/movies'); 
const {Genre} = require('../models/genres');
const asyncMiddleware = require('../middleware/async');

router.get('/', asyncMiddleware(async(req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies)
}));

router.post('/', auth, asyncMiddleware(async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre')

    const movie = new Movie({
        title: req.body.title,
        genre: { // selectively set properties, not all
            _id: genre._id,
            name: genre.name
        }, 
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    await movie.save();
    res.send(movie);
}));

router.put('/:id', asyncMiddleware(async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre')
    
    const movie = await Movie.findByIdAndUpdate(req.params.id, { 
        title: req.body.title,
        genre: { // selectively set properties, not all
            _id: genre._id,
            name: genre.name
        }, 
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, {
        new: true
    })

    if (!movie) return res.status(404).send('Customer with given ID not found');

    res.send(movie);
}));

router.delete('/:id', asyncMiddleware(async(req, res) => {
    const movie = Movie.findByIdAndRemove(req.params.id);

    if (!movie) return res.status(404).send('Customer with given ID not found');

    res.send(movie);
}));

router.get('/:id', asyncMiddleware(async(req, res) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie) return res.status(404).send('Customer with the given ID not found');
    res.send(movie);
}));

module.exports = router;