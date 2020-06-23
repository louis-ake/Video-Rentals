const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const {Genre, validate} = require('../models/genres');
const express = require('express');
const validateObjectId = require('../middleware/validateObjectId');
const router = express.Router();

router.get('/', asyncMiddleware(async(req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
}));

router.post('/', auth, asyncMiddleware(async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error);

    const genre = new Genre({ name: req.body.name });
    await genre.save();
    res.send(genre);
}));

router.put('/:id', asyncMiddleware(async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error);
    
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    })

    if (!genre) return res.status(404).send('Genre with given ID not found');

    res.send(genre);
}));

router.delete('/:id', [auth, admin], asyncMiddleware(async(req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) return res.status(404).send('Genre with given ID not found');

    res.send(genre);
}));

router.get('/:id', validateObjectId, asyncMiddleware(async(req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre) return res.status(404).send('Genre with the given ID not found');
    res.send(genre);
}));

module.exports = router; 