const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema({

    customerId : { type : ObjectId, ref : "Customer", required : true},
    orderAmount : {type : Number, required : true},
    discount : {type : Number, default : 0}

},{timestamp : true})

module.exports = mongoose.model("Order", orderSchema)