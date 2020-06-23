const mongoose = require('mongoose');
const HapiJoi = require('@hapi/joi');
const {genreSchema} = require('./genres');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
    const schema = HapiJoi.object ({
        title: HapiJoi.string().min(5).max(50).required(),
        genreId: HapiJoi.objectId().required(), // note you only want the client to send the genre ID
        numberInStock: HapiJoi.number().min(0).required(),
        dailyRentalRate: HapiJoi.number().min(0).required()
    });
    return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;