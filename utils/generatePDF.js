// @ts-nocheck
const pdfFiller = require('pdffiller-stream');
const {sendEmail} = require('./mail');
const moment = require('moment');
const { v4 } = require('uuid');

const generatePDFFile = async (patient) => {
  try {
    const sourcePDF = "pdftemplate/template.pdf";
    const {Pt_Lname, Pt_Fname, Pt_Ethnicity, Pt_Email, Date_of_Birth, Patient_Age, Sex, Pt_Phone, Pt_Str, Pt_City, Pt_ST, Pt_Zip, test_variant, Result, tester_name } = patient;
    let gender = "Male";
    let Positive = "Yes";
    let Negative = "Off";
    if(Result === 2) {
      Positive = "Off";
      Negative = "Yes";
    }
    if(Sex === 'Female') {
      gender = "Female";
    }
    else {
      gender = "Male";
    }
    let careStart = "Off";
    let bdVeritor = "Off";
    if(test_variant == "CareStart"){
      careStart = "Yes";
    }
    else if(test_variant == "BD Veritor"){
      bdVeritor = "Yes";
    }
    let dob = '';
    if(moment(Date_of_Birth).isValid()){
      dob = moment(Date_of_Birth).format('DD/MM/YYYY')
    }
    dob = Date_of_Birth;
    const data = {
      "Name": `${Pt_Lname} ${Pt_Fname}`,
      "Ethnicity": Pt_Ethnicity,
      "Date": new Date(),
      "Email": Pt_Email,
      "DOB": dob,
      "Age": Patient_Age,
      "Gender": gender,
      "Phone": Pt_Phone,
      "Address": Pt_Str,
      "City": Pt_City,
      "State": Pt_ST,
      "Zip": Pt_Zip,
      "BD Veritor": bdVeritor,
      "CareStart": careStart,
      "Negative": Negative,
      "Positive": Positive,
      "Test Admin Name": tester_name,
      "Test Admin Signature": tester_name,
      "Date6_af_date": moment().format("DD/MM/YYYY")
    };
    const id = v4();
    await pdfFiller.fillForm(sourcePDF, data).toFile(`outputFile${id}.PDF`)
    console.log("PDF File generated successfully");
    sendEmail(patient.Pt_Email, id);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {generatePDFFile}