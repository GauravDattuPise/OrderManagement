const express = require('express')
const router = express.Router()

const {createCustomer, getCustomer} = require('../controllers/customerController')
const {createOrder} = require('../controllers/orderController')

router.post("/customer", createCustomer);
router.get("/customer/:customerId", getCustomer)

router.post("/createOrder", createOrder)


module.exports = router