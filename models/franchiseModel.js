// @ts-nocheck
const mongoose = require('mongoose');

const franchiseSchema = new mongoose.Schema(
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
    company_id: {
        type: String
    },
    tested_no: {
        type: Number
    }
});

mongoose.model('Franchise', franchiseSchema);

module.exports = franchiseSchema;