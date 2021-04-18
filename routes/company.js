// @ts-nocheck
const express = require('express');
const router = express.Router();
const CompanySchema = require('../models/companyModel');
const mongoose = require('mongoose');
const Company = mongoose.model('Company', CompanySchema);
const {isEmpty, isEmail, isPhone, isZipCode} = require('../utils/util');
const authVerify = require('../middleware/authVerify');

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_TEST_KEY);

router.get('/get-companies', async(req, res) => {
  try{
    const filter = {};
    const companies = await Company.find(filter);
    return res.status(200).json({companies})
  }
  catch {
    return res.status(500).json({error: "Server Error"});
  }
});

router.post('/create-company', authVerify, async(req, res) => {
  try{
    const {email, name, contactname, stripeID} = req.body; 
    //TODO add other fields for the company field
    if(isEmpty(email)) return res.status(400).json({error: 'Company Contact Email cannot be empty'});
    if(isEmpty(name)) return res.status(400).json({error: 'Company Name cannot be empty'});
    if(isEmpty(contactname)) return res.status(400).json({error: 'Company contact name cannot be empty'});
    let newCompany = new Company();
    newCompany.email = email;
    newCompany.name = name;
    newCompany.contact_name = contactname;
    newCompany.stripe_customer_id = stripeID;
    newCompany.tested_no = 0;
    newCompany.unit_price = 125;
    newCompany.save((err) => {
      if(err) return res.status(400).json({error: 'There is some error when save it'});
      return res.status(200).json({message: "Saved successfully"});
    });
  }
  catch {
    return res.status(500).json({error: "Server Error"});
  }
});

router.post('/update-company', authVerify, async(req, res) => {
  try {
    const {id, email, name, contactname, stripeID} = req.body;
    if(isEmpty(id)) return res.status(400).json({error: 'ID cannot be empty'});
    if(isEmpty(email)) return res.status(400).json({error: 'Company Contact Email cannot be empty'});
    if(isEmpty(name)) return res.status(400).json({error: 'Company Name cannot be empty'});
    if(isEmpty(contactname)) return res.status(400).json({error: 'Company contact name cannot be empty'});
    await Company.findByIdAndUpdate(id, {email, name, contact_name: contactname, stripe_customer_id: stripeID}, function(err){
      if(err) return res.status(500).json({error: "There is some error when Updating"});
      else return res.status(200).json({message: "Updated Successfully"});
    })
  }
  catch {
    return res.status(500).json({error: "There is some error when Updating"});
  }
})

router.post('/delete-company', authVerify, async(req, res) => {
  try{
    const {id} = req.body;
    if(isEmpty(id))  return res.status(400).json({error: 'ID cannot be empty'});
    Company.findByIdAndRemove(id, function(err){
      if(err) return res.status(500).json({error: "There is some error when Updating"});
      else return res.status(200).json({message: "Removed Successfully"});
    })
  }
  catch {
    return res.status(500).json({error: "There is some error when Updating"});
  }
});

//Create the customer with the stripe securty key
router.post('/create-customer', authVerify, async(req, res) => {
  try{
    const {email, name, companyId} = req.body;
    if(isEmpty(email)) return res.status(400).json('Email cannot be empty');
    if(isEmpty(name)) return res.status(400).json('Name cannot be empty');
    
    //Create the customer with the email and name
    const customer = await stripe.customers.create({
      description: 'Company Customer for the test reporting.',
      name,
      email
    });
    if(customer) {
      console.log(`Customer created successfully - ${customer.id}`);
      //Need to save the customer_id to the stipe_customer_id of the company
      //cus_It9Jf0vUERAvC6
      //cus_It9LMdfkyFbq0v
      // cus_It9MuGQ12nPnJe
      await Company.findByIdAndUpdate(companyId, {stripe_customer_id: customer.id}, function(err){
        if(err) return res.status(500).json({error: "There is some error when saving customer id."});
        else return res.status(200).json({customer_id: customer.id});
      })
    }
    else return res.status(500).json({error: 'Error occured when saving customer.'});
  }
  catch {
    return res.status(500).json({error: "There is some error when Updating"});
  }
});

//Attach a payment method to a Customer

router.post('/attach-payment-method', authVerify, async(req, res) => {
  try{
    const {paymentMethod_id, customer_id} = req.body;
    if(isEmpty(paymentMethod_id)) return res.status(400).json({error: 'Company ID cannot be empty'});
    if(isEmpty(customer_id)) return res.status(400).json({error: 'Customer ID cannot be empty'});
    
    const paymentMethod = await stripe.paymentMethods.attach(
      paymentMethod_id,
      {customer: customer_id}
    );
    console.log(paymentMethod);
    if(paymentMethod) return res.status(200).json({message: "Payment method successfully added to this customer."})
    else return res.status(500).json({error: "There is error message when attaching method."})
  }
  catch {
      return res.status(500).json({error: "There is some error when Updating"});
  }
});

module.exports = router;