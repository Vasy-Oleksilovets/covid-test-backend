// @ts-nocheck
const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

const testerSchema = new mongoose.Schema(
{
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: false
    },
    active: {
        type: Boolean,
        required: true
    },
    location_id: {
        type: String,
        required: true
    },
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Number,
});

testerSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

testerSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
      
    
mongoose.model('Tester', testerSchema);

module.exports = testerSchema;