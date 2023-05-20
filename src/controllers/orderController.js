const mongoose = require('mongoose')
const customerModel = require('../models/customerModel')
const orderModel = require('../models/orderModel')

const createOrder = async function (req, res) {

    try {
        let orderData = req.body
        let { customerId, orderAmount } = orderData

        if (Object.keys(orderData).length == 0) {
            return res.status(400).send({ status: false, message: "Provide some details to create order" })
        }

        if (!customerId)
            return res.status(400).send({ status: false, message: "CustormerId is required" })

        if (!mongoose.isValidObjectId(customerId))
            return res.status(400).send({ status: false, message: "Please provide valid customer id" })


        if (!orderAmount)
            return res.status(400).send({ status: false, message: "orderAmount is required" })

        if (typeof orderAmount != "number")
            return res.status(400).send({ status: false, message: 'Order amount should be in number' })

        let findCustomer = await customerModel.findById(customerId).select({ cOrders: 1, category: 1, totalDiscount: 1 })
        if (!findCustomer)
            return res.status(400).send({ status: false, message: "customer not found" })

            // ORDER CREATED
        const createdOrder = await orderModel.create(orderData)

        // ORDER COUNT INCREASING BY 1
        let updateOrders = await customerModel.findByIdAndUpdate(customerId, { $inc: { cOrders: +1 } }, { new: true });

        // IF CUSTOMER PLACED 9 ORDERS
        if (updateOrders.cOrders == 9) {
            console.log("You have placed 9 orders with us. Buy one more stuff and you will be promoted to Gold customer and enjoy 10% discounts!")
        }

                // IF CUSTOMER PLACED 19 ORDERS
        if (updateOrders.cOrders == 19) {
            console.log("You have placed 19 orders with us. Buy one more stuff and you will be promoted to Platinum customer and enjoy 10% discounts!")
        }

        // IF CUSTOMER ORDERS ARE <= 10
        if (updateOrders.cOrders <= 10) {
            updateOrders.orderAmount = 0
        }

        // making category gold
        if (updateOrders.cOrders == 10) {
            updateOrders.category = "Gold"
        }

        // providing 10 % discount
        if (updateOrders.cOrders > 10 && updateOrders.cOrders <= 20) {
            updateOrders.orderAmount = orderData.orderAmount * 0.1
        }

        // making category platinum
        if (updateOrders.cOrders == 20) {
            updateOrders.category = "Platinum"
        }

        // providing 20 % discount
        if (updateOrders.cOrders > 20) {
            updateOrders.orderAmount = orderData.orderAmount * 0.2
        }

        // updating customer CATEGORY & TOTAL dISCOUNT
        await customerModel.findByIdAndUpdate(customerId, { category: updateOrders.category, $inc: { totalDiscount: +updateOrders.orderAmount } }, { new: true });

        // updating order DISCOUNT
       let updateOrders2 = await orderModel.findOneAndUpdate({_id : createdOrder._id},{discount : updateOrders.orderAmount},{new : true}).select({__v : 0})
        
       //  sending updated Order
       return res.status(201).send({ status: true, message: "Success", data: updateOrders2 })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.createOrder = createOrder

//==========================================================================================

const nodeMailer = require("nodemailer")

const transport = async function(req,res){

    const transportEmail = nodeMailer.createTransport({

        service : "gmail",
        auth : {
            user : "gauravpise87@gmail.com",
            pass : "PasswordGp@2001"
        }
    }) ;

    const mailOptions = {
        from : "gauravpise87@gmail.com",
        to : "chandranathssplhyd22@gmail.com",
        subjet : "sending email using nodemailer",
        html : "Hello i am your friend"
    }

    transportEmail.sendMail(mailOptions, function(err, success){
        if(err)
        return res.status(400).send({status : false, message : err.message})

        else
        return res.status(200).send({status : false, message : success})
    })
}

module.exports.transport = transport