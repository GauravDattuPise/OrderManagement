const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({

    cName: { type: String, required: true },
    cOrders: { type: Number, default: 0 },
    category : {type : String, default : "regular"},
    totalDiscount: { type: Number, default: 0}
    
})

module.exports = mongoose.model("Customer", customerSchema)   

