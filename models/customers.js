const mongoose= require('mongoose');
const HapiJoi = require('@hapi/joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));

function validateCustomer(customer) {
    const schema = HapiJoi.object ({
        name: HapiJoi.string().min(5).max(50).required(),
        phone: HapiJoi.string().min(5).max(50).required(),
        isGold: HapiJoi.boolean()
    });
    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;