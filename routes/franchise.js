// @ts-nocheck
const express = require('express');
const router = express.Router();
const FranchiseSchema = require('../models/franchiseModel');
const mongoose = require('mongoose');
const Franchise = mongoose.model('Franchise', FranchiseSchema);
const {isEmpty, isEmail, isPhone, isZipCode} = require('../utils/util');
const authVerify = require('../middleware/authVerify');

router.post('/get-franchises', async(req, res) => {
  try{
    const {company_id} = req.body;
    const filter = {company_id};
    const franchises = await Franchise.find(filter);
    return res.status(200).json({franchises})
  }
  catch {
    return res.status(500).json({error: "Server Error"});
  }
});

router.post('/create-franchise', authVerify, async(req, res) => {
  try{
    const {email, name, contactname, company_id} = req.body; 
    //TODO add other fields for the franchise field
    if(isEmpty(email)) return res.status(400).json({error: 'Franchise Contact Email cannot be empty'});
    if(isEmpty(name)) return res.status(400).json({error: 'Franchise Name cannot be empty'});
    if(isEmpty(contactname)) return res.status(400).json({error: 'Franchise contact name cannot be empty'});
    if(isEmpty(company_id)) return res.status(400).json({error: 'Company ID cannot be empty'});
    let newFranchise = new Franchise();
    newFranchise.email = email;
    newFranchise.name = name;
    newFranchise.contact_name = contactname;
    newFranchise.company_id = company_id;
    newFranchise.tested_no = 0;
    newFranchise.save((err) => {
      if(err) return res.status(400).json({error: 'There is some error when save it'});
      return res.status(200).json({message: "Saved successfully"});
    });
  }
  catch {
    return res.status(500).json({error: "Server Error"});
  }
});

router.post('/update-franchise', authVerify, async(req, res) => {
  try {
    const {id, email, name, contactname} = req.body;
    if(isEmpty(id)) return res.status(400).json({error: 'ID cannot be empty'});
    if(isEmpty(email)) return res.status(400).json({error: 'Franchise Contact Email cannot be empty'});
    if(isEmpty(name)) return res.status(400).json({error: 'Franchise Name cannot be empty'});
    if(isEmpty(contactname)) return res.status(400).json({error: 'Franchise contact name cannot be empty'});
    Franchise.findByIdAndUpdate(id, {email, name, contact_name: contactname}, function(err){
      if(err) return res.status(500).json({error: "There is some error when Updating"});
      else return res.status(200).json({message: "Updated Successfully"});
    })
  }
  catch {
    return res.status(500).json({error: "There is some error when Updating"});
  }
})

router.post('/delete-franchise', authVerify, async(req, res) => {
  try{
    const {id} = req.body;
    if(isEmpty(id))  return res.status(400).json({error: 'ID cannot be empty'});
    Franchise.findByIdAndRemove(id, function(err){
      if(err) return res.status(500).json({error: "There is some error when Updating"});
      else return res.status(200).json({message: "Removed Successfully"});
    })
  }
  catch {
    return res.status(500).json({error: "There is some error when Updating"});
  }
})

module.exports = router;