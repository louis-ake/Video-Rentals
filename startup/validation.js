const HapiJoi = require('@hapi/joi');

module.exports = function() {
    HapiJoi.objectId = require('joi-objectid')(HapiJoi);
}