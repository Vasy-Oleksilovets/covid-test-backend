// @ts-nocheck
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserSchema = require('../models/userModel');
const User = mongoose.model('User', UserSchema);
const jwt = require('jsonwebtoken');
const { getMySecret, isEmpty, isEmail } = require('../utils/util');

router.post('/signup', async (req, res) => {
  try {
    const token = getMySecret();
    const {username, email, password, active} = req.body;
    if(isEmpty(username)) return res.status(401).json({error: 'Username cannot empty.'});
    if(isEmpty(email)) return res.status(401).json({error: 'Email cannot empty.'});
    if(!isEmail(email)) return res.status(401).json({error: 'Email format is not correct.'});
    if(isEmpty(password)) return res.status(401).json({error: 'Password cannot be empty.'});
    User.findOne({ 'email':  email }, function(err, user) {
      if (err)
        return res.status(401).json({error: "There is error with database connection"});
      if (user) {
        return res.status(401).json({error: "Username/password was incorrect."});
      } else {
        var user = new User();
        user.username = username;
        user.email = email;
        user.password = user.generateHash(password);
        user.active = active;
        user.save(function(err) {
          if (err)
          throw err;
          const userToken = jwt.sign({userId: user._id, username: user.username, email: user.email}, token);
          return res.status(200).json({userToken});
        });
      }
    });
  }
  catch {
    return res.status(422).json({success: false, message: "There is error"});
  }
});

router.post('/signin', async (req, res) => {
  try {
    const token = getMySecret();
    const {email, password} = req.body;
    User.findOne({ 'email':  email }, function(err, user) {
      if (err)
        return res.status(400).json({error: "There is an error with database connection"});
      if (!user)
        return res.status(400).json({error: "Username/password was incorrect."});
      if (!user.validPassword(password))
        return res.status(400).json({error: "Invalid Password"});
      else {
        const userToken = jwt.sign({ userId: user._id, username: user.username, email: user.email, admin: true }, token);
        if(user.active) return res.status(200).json({token: userToken});
        else return res.status(400).json({error: 'User is not active for now.'});
      }
    });
  }
  catch{
    return res.status(422).json({error: 'Unexpected Error!'})
  }
})

module.exports = router;