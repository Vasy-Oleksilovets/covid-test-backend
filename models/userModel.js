// @ts-nocheck
const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema(
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
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Number,
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
      
    
mongoose.model('User', userSchema);

module.exports = userSchema;