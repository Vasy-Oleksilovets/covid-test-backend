// @ts-nocheck
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const organizationSchema = require('../models/testorganizationModel');
const TestOrganization = mongoose.model('TestOrganization', organizationSchema);
const {isEmpty, isEmail, isPhone, isZipCode} = require('../utils/util');

router.post('/create', async (req, res) => {
  try {
    const {name, street, zip, state, city} = req.body;
    if(isEmpty(name)) return res.status(400).json({error: "Name cannot be empty"});
    let testingOrg = new TestOrganization();
    testingOrg.name = name;
    if(!isEmpty(street)) testingOrg.street = street;
    if(!isEmpty(zip)) testingOrg.zip = zip;
    if(!isEmpty(state)) testingOrg.state = state;
    if(!isEmpty(city)) testingOrg.city = city;
    testingOrg.save(function(err) {
      if(err) throw err;
      // res.status(200).json({message: "Saved successfully"});
      return res.status(200).json({orgId: testingOrg._id});
    })
  }   
  catch {
    return res.status(422).json({success: false, message: "There is error"});
  }
});

router.get('/get-test-org', async (req, res) => {
  try{
    const filter = {};
    const testOrgs = await TestOrganization.find(filter, null, {sort: {name: 1}});
    return res.status(200).json({testOrgs})
  }
  catch {
    return res.status(500).json({error: "Server Error"});
  }
});

//Get the ID of the location and send the full information of that test location -> Used in the walk in form - front-end
router.post('/get-detail-location', async (req, res) => {
  try {
    const { locationID } = req.body;
    if(isEmpty(locationID)) return res.status(401).json({error: "Bad Request"});
    await TestOrganization.findById(locationID, function(err, location){
      if(err) return res.status(500).json({error: 'Server Error'});
      return res.status(200).json({location});
    })
  }
  catch {
    return res.status(500).json({error: 'Server Error'});
  }
});

module.exports = router;
