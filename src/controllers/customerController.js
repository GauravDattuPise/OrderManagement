
const mongoose = require('mongoose')
const customerModel = require('../models/customerModel')
const orderModel = require('../models/orderModel')

const createCustomer = async function (req, res) {

    try {
        let customerData = req.body.cName
        
        if (!customerData) return res.status({ status: false, message: "customer name is required" })

        const savedCustomer = await customerModel.create(customerData)

        return res.status(201).send({ status: true, message: "Success", data: savedCustomer })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.createCustomer = createCustomer

//=====================================================================================================================


const getCustomer = async function (req, res) {

    try {
        const customerId = req.params.customerId

        if (!mongoose.isValidObjectId(customerId))
            return res.status(400).send({ status: false, message: 'Please provide valid customer id' })

        let findCustomer = await customerModel.findById(customerId).select({__v : 0})
        if (!findCustomer)
            return res.status(400).send({ status: false, message: "customer not found" })

            
            let getOrders = await orderModel.find({ customerId: findCustomer._id }).select({__v : 0})
            
            if (getOrders.length == 0){
               getOrders = "You have not placed any orders"
            }
            
            let customerData = findCustomer.toObject();
            customerData.customerOrders = getOrders
            
            return res.status(200).send({ status: true, message: "Success", data: customerData })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.getCustomer = getCustomer
