// @ts-nocheck
const express = require('express');
const router = express.Router();
const PatientSchema = require('../models/patientModel');
const mongoose = require('mongoose');
const Patient = mongoose.model('Patient', PatientSchema);
const {isEmpty, isEmail, isPhone, isZipCode} = require('../utils/util');
const authVerify = require('../middleware/authVerify');
const organizationSchema = require('../models/testorganizationModel');
const TestOrganization = mongoose.model('TestOrganization', organizationSchema);

const {generatePDFFile} = require('../utils/generatePDF');
const { truncate } = require('fs');
//WebHook URL
router.post('/save-calendly-patient', async(req, res) => {
  try {
    const {event, payload} = req.body;
    if(isEmpty(event) || isEmpty(payload)) return res.status(422).json({error: "error detected"});
    const {questions_and_answers, invitee, event_type} = payload;
    if(isEmpty(event_type)) return res.status(422).json({error: "event type cannot be empty"});
    if(isEmpty(payload)) return res.status(422).json({error: "error detected"});
    console.log(event_type);
    console.log(payload);
    if(event === "invitee.created"){
      let birthDate = ''; 
      let age = '';
      let streetAddress = '';
      let city = '';
      let zipCode = '';
      let county = '';
      let phone = '';
      let sex = '';
      let race = '';
      let ethnicity = '';
      let appDate = new Date(payload.event.invitee_start_time);
      console.log("this is app date");
      console.log(appDate);
      let state = 'CA';
      for(let item of questions_and_answers){
        if(item.question === "Date of Birth (mm/dd/yyyy)")
          birthDate = item.answer;
        if(item.question === "Age")
          age = item.answer;
        if(item.question === "Street Address")
          streetAddress = item.answer;
        if(item.question === "City")
          city = item.answer;
        if(item.question === "Zip Code")
          zipCode = item.answer;
        if(item.question === "County")
          county = item.answer;
        if(item.question === "Cell Phone Number")
          phone = item.answer;
        if(item.question === "Sex")
          sex = item.answer;
        if(item.question === "Race")
          race = item.answer;
        if(item.question === "Ethnicity")
          ethnicity = item.answer;
      }
      let location_name = event_type.name; 
      let cashFlag = 0;   
      let uuid = payload.event.uuid;
      let location_id = ''
      console.log(`previous location name is ${location_name}`);
      if(location_name.includes('Cash')){
        location_name = location_name.replace(/\sCash/g, '');
        cashFlag = 1;
      }
      console.log(`location name is ${location_name}`);
      let testOrg = await TestOrganization.find({name: location_name});
      if(testOrg.length > 0){
        location_id = testOrg[0]._id;
      }
      let company_id = '';
      phone = phone.replace(/\s/g, '').replace(/-/g, '');
      phone = phone.replace("+1", '');
      await Patient.findOne({ 'calendar_uuid':  uuid }, async function(err, patient) {
        if (err){
          console.log("there is error to find the uuid");
          return res.status(401).json({error: "There is Error"});
        }  
        if (patient) {
          console.log(`There is already user has the same uuid ${uuid}`);
          return res.status(401).json({error: "There is already one user"});
        } else {
          savePatient(invitee.name, invitee.email, age, birthDate, streetAddress, city, zipCode, county, phone, sex, race, ethnicity, state, location_id, company_id, res, uuid, true , '1', appDate, cashFlag, false);
        }
      });
    }
    else if(event === "invitee.cancelled"){
      return res.status(200).json({message: "cancelled"});
    }
    else return res.status(422).json({error: "Some error detected"});
  }catch {
    return res.status(400).json({message:"There is some error"});
  }
});

router.post('/getpatients', authVerify, async(req, res) => {
  try{
    const { location_id } = req.body;
    if(isEmpty(location_id)) return res.status(400).json({error: "Location ID cannot be empty"});
    const patients = await Patient.find({$or: [{location_Id: location_id, Result: 0, is_ignore: false}, {location_Id: location_id, Result: undefined, is_ignore: false}]}).sort([['appointment_date', 1]]);
    return res.status(200).json({patients})
  }catch {
    return res.status(422).json({error: "Some error detected"});
  }
});

router.post('/get-patients-with-location-id', async(req, res) => {
  const { location_id } = req.body;
  const patients = await Patient.find({location_Id: location_id});
  const location = await TestOrganization.findById(location_id);
  return res.status(200).json({patients, location});
})

router.post('/get-patients-with-result', authVerify, async(req, res) => {
  try{
    const { location_id } = req.body;
    if(isEmpty(location_id)) return res.status(400).json({error: "Location ID cannot be empty"});
    const patients = await Patient.find({$or: [{location_Id: location_id, Result: 1, is_ignore: false}, {location_Id: location_id, Result: 2, is_ignore: false}]}).sort([['appointment_date', -1]]);
    return res.status(200).json({patients})
  }catch {
    return res.status(422).json({error: "Some error detected"});
  }
});

router.post('/get-patients-with-company-id', authVerify, async(req, res) => {
  try {
    const {company_id} = req.body;
    if(isEmpty(company_id)) return res.status(400).json({error: "Company ID cannot be empty"});
    const filter = {company_id, is_ignore: false};
    const patients = await Patient.find(filter);
    return res.status(200).json({patients})
  }catch {
    return res.status(422).json({error: "Some error detected"});
  }
});

router.post('/save-patient', authVerify, async(req, res) => {
  try {
    let uuid = '';
    const {name, email, age, birthDate, streetAddress, city, zipCode, county, phone, sex, race, ethnicity, state, location_id, company_id, is_paid, cares} = req.body;
    savePatient(name, email, age, birthDate, streetAddress, city, zipCode, county, phone, sex, race, ethnicity, state, location_id, company_id, res, uuid, is_paid, cares, new Date())
  }catch {
    return res.status(500).send({error: "There is some error saving this information"});
  }
});

router.post('/save-update-ignore', authVerify, async(req, res) => {
  try {
    const { patient } = req.body;
    if(patient === undefined || Object.keys(patient).length === 0) return res.status(401).json({error: 'request error'});
    else {
      await Patient.findByIdAndUpdate(patient._id, {is_ignore: true});
      return res.status(200).json({message: 'Updated successfully'});
    }
  } catch {
    return res.status(400).json({error: 'There is an error while updating.'});
  }
});

router.post('/saveResults', authVerify, async(req, res) => {
  try {
    const { updatedPatients } = req.body;
    if(updatedPatients ==  undefined || updatedPatients.length==0) return res.status(401).json({error: 'request error'});
    else {
      for(let item of updatedPatients){
        await Patient.findByIdAndUpdate(item._id, {Result: item.Result, Test_Result_Date: new Date()});
      }
    }
    return res.status(200).json({message: "updated successfully"});
  }
  catch {
    return res.status(500).json({error: "There is some error while updating database"})
  } 
});

router.post('/save-patient-result', async(req, res) => {
  try {
    const { patient } = req.body;
    console.log(patient);
    if(patient === undefined || Object.keys(patient).length === 0) return res.status(401).json({error: 'request error'});
    else {
      await Patient.findByIdAndUpdate(patient._id, {Result: patient.Result, Test_Result_Date: new Date(), test_variant: patient.test_variant, tester_name: patient.tester_name});
      generatePDFFile(patient);
      return res.status(200).json({message: 'Updated successfully'});
    }
  } catch {
    return res.status(500).json({error: 'There is some error while updating database'});
  }
});

router.post('/save-ignore-result', async(req, res) => {
  try {
    await Patient.updateMany({location_Id: '6010c5d92e5b055d47c10892'}, {is_ignore: false});
    return res.status(500).json({error: 'updated successfully'});
  }
  catch {
    return res.status(500).json({error: 'There is some error while updating database'}); 
  }
})

router.post('/paid-employees', authVerify, async(req, res) => {
  try {
    const { payEmployeeList } = req.body;
    if(isEmpty(payEmployeeList) || payEmployeeList.length === 0) return res.status(400).json({error: 'Bad Request'});
      
  }catch {
    return res.status(500).json({error: "There is some error when updating database"})
  }
})

const savePatient = (name, email, age, birthDate, streetAddress, city, zipCode, county, phone, sex, race, ethnicity, state, location_id, company_id, res, uuid, ispaid, cares, appDate, cashFlag = 0) => {
  try {
    let nameArr = name.split(/\s+/);
    let firstName = nameArr.slice(0, -1).join(" ");
    let lastName = nameArr.pop();
    let patient = new Patient();
    patient.Pt_Fname = firstName;
    patient.Pt_Lname = lastName;
    patient.Pt_Lname = lastName;
    patient.Patient_Age = age;
    patient.Pt_Email = email;
    patient.Date_of_Birth = birthDate;
    patient.Pt_Str = streetAddress;
    patient.Pt_City = city;
    patient.Pt_Zip = zipCode;
    patient.Pt_County = county;
    patient.Pt_Phone = phone;
    patient.Sex = sex;
    patient.Pt_Race = race;
    patient.Pt_Ethnicity = ethnicity;
    patient.Pt_ST = state;
    patient.location_Id = location_id;
    patient.calendar_uuid = uuid;
    patient.is_paid = ispaid;
    patient.is_ignore = false;
    patient.Result = 0;
    patient.test_variant = '';
    patient.tester_name = '';
    patient.appointment_date = appDate;
    patient.cashFlag = cashFlag;
    if(!isEmpty(company_id)) patient.company_id = company_id;
    if(!isEmpty(cares)) {
      console.log("this is cares part");
      patient.cares = parseInt(cares);
      console.log(cares);
    }
    patient.save(function(err) {
      if(err) throw err;
      console.log("patient saved successfully");
      return res.status(200).json({message: "Saved successfully"});
    })
  }
  catch {
    return res.status(500).json({err: "There is an error"});
  }
}

router.post('/update-all-cash-field', async(req, res) => {
  try {
    await Patient.updateMany({}, {cash: 0});
    return res.status(500).json({error: 'updated successfully'});
  }
  catch {
    return res.status(500).json({error: 'There is some error while updating database'}); 
  }
})

router.post('/appointments-count', async(req, res) => {
  try {
    const { location_id } = req.body;
    const patients = await Patient.find({location_Id: location_id});
    return res.status(200).json({count: patients.length})
  }catch {
    return res.status(500).json({error: "Server Error"})
  }
})

router.post('/revenue', async(req, res) => {
  try {
    const { location_id } = req.body;
    const patients = await Patient.find({location_Id: location_id});
    patients.filter(e => {
      if (e.is_paid === true && (e.cash === 0 || e.cash === 2)) {
        return true;
      }
      return false;
    })
    return res.status(200).json({revenue: patients.length * 125});
  }catch {
    return res.status(500).json({error: "Server Error"})
  }
})

module.exports = router;