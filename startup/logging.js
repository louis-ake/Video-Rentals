const winston = require('winston');
//require('winston-mongodb');
// require('express-async-errors'); - could not get this (automated asnyc error logging) - used explicit imports + references instead

module.exports = function() {
    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: './logs/uncaughtExceptions.log' }));

    process.on('unhandledRejection', (error) => {
        throw error;
    });

    winston.add(new winston.transports.Console());
    winston.add(new winston.transports.File({ filename: './logs/logfile.log' }));
    //winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly' }));
}



//throw new Error('something went wrong during startup');

// const p = Promise.reject(new Error('Something failed miserably'));
// p.then(() => console.log('Done'));