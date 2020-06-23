const express = require('express');
const router = express.Router();
const {Customer, validate} = require('../models/customers');
const asyncMiddleware = require('../middleware/async'); 

router.get('/', asyncMiddleware(async(req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers)
}));

router.post('/', asyncMiddleware(async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error);

    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    await customer.save();
    res.send(customer);
}));

router.put('/:id', asyncMiddleware(async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error);
    
    const customer = await Customer.findByIdAndUpdate(req.params.id, { 
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, {
        new: true
    })

    if (!customer) return res.status(404).send('Customer with given ID not found');

    res.send(customer);
}));

router.delete('/:id', asyncMiddleware(async(req, res) => {
    Customer.findByIdAndRemove(req.params.id);

    if (!customer) return res.status(404).send('Customer with given ID not found');

    res.send(customer);
}));

router.get('/:id', asyncMiddleware(async(req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(404).send('Customer with the given ID not found');
    res.send(customer);
}));

module.exports = router;