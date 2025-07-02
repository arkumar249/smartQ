const mongoose = require("mongoose");


const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: "store_name"
    },
    address: {
        type: String,
        required: true,
        default: "address_56"
    },
    contact: {
        type: String,
        required: true,
        default: "1234"
    },
    isOpen: {
        type: Boolean,
        required: true,
        default: true
    },
    tokenCounter:{ // use for token number assignment 
        type:Number,
        default:0,
    },
    averageWaitTime:{
        type:Number, 
        default:5,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    outOfStock:[{type:String}],
    allTokens: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Token' }],
    lastQueueReset:{
        type:Date, 
        default:Date.now,
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("Store", storeSchema);
