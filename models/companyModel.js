// @ts-nocheck
const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

const companySchema = new mongoose.Schema(
{
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    contact_name: {
        type: String
    },
    stripe_customer_id: {
        type: String
    },
    tested_no: {
        type: Number
    },
    unit_price: {
        type: Number,
        default: 125
    }
});

mongoose.model('Company', companySchema);

module.exports = companySchema;