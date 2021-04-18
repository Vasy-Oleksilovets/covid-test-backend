// @ts-nocheck
const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

const organizationSchema = new mongoose.Schema(
{
    street: {
        type: String,
        default: 'Not Provided'
    },
    zip: {
        type: String,
        default: 'Not Provided'
    },
    state: {
        type: String,
        default: 'Not Provided'
    },
    city: {
        type: String,
        default: 'Not Provided'
    },
    name: {
        type: String,
        required: true
    }
});
    
mongoose.model('TestingOrganization', organizationSchema);

module.exports = organizationSchema;