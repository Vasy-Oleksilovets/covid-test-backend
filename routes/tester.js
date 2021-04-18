// @ts-nocheck
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const TesterSchema = require('../models/testerModel');
const Tester = mongoose.model('Tester', TesterSchema);
const jwt = require('jsonwebtoken');
const organizationSchema = require('../models/testorganizationModel');
const TestOrganization = mongoose.model('TestOrganization', organizationSchema);
const { getMySecret, isEmpty, isEmail } = require('../utils/util');

router.post('/signup', async (req, res) => {
  try {
    const token = getMySecret();
    const {testername, email, password, org_id} = req.body;
    if(isEmpty(testername)) return res.status(401).json({error: 'Testername cannot empty.'});
    if(isEmpty(email)) return res.status(401).json({error: 'Email cannot empty.'});
    if(isEmpty(org_id)) return res.status(401).json({error: 'Organization ID cannot empty.'});
    if(!isEmail(email)) return res.status(401).json({error: 'Email format is not correct.'});
    if(isEmpty(password)) return res.status(401).json({error: 'Password cannot be empty.'});
    Tester.findOne({ 'email':  email }, function(err, tester) {
      if (err)
        return res.status(401).json({error: "There is error with database connection"});
      if (tester) {
        return res.status(401).json({error: "There is already tester that has this email"});
      } else {
        var tester = new Tester();
        tester.username = testername;
        tester.email = email;
        tester.active = true;
        tester.password = tester.generateHash(password);
        tester.location_id = org_id;
        tester.save(function(err) {
          if (err)
          throw err;
          const testerToken = jwt.sign({testerId: tester._id}, token);
          return res.status(200).json({testerToken});
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
    Tester.findOne({ 'email':  email }, function(err, tester) {
      if (err)
        return res.status(400).json({error: "There is an error with database connection"});
      if (!tester)
        return res.status(400).json({error: "Username/password was incorrect."});
      if (!tester.validPassword(password))
        return res.status(400).json({error: "Invalid Password"});
      else {
        TestOrganization.findById(tester.location_id, function(err, testorg){
          if(err) return res.status(500).json({error: "There is an error for the tester's organization"});
          else {
            const testerToken = jwt.sign({ userId: tester._id, username: tester.username, email: tester.email, location: testorg.name, admin: false, location_id: testorg._id }, token);
            if(tester.active) return res.status(200).json({token: testerToken});
            else return res.status(400).json({error: 'Tester is not active for now.'});
          }
        })
      }
    });
  }
  catch{
    return res.status(422).json({error: 'Unexpected Error!'})
  }
})

module.exports = router;
