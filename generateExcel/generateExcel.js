// @ts-nocheck
const mongoose = require('mongoose');
var schedule = require('node-schedule');
const PatientSchema = require('../models/patientModel');
const Patient = mongoose.model('Patient', PatientSchema);
const {uploadGoogleDriveExt} = require('./googleDriveAccess');
const {getMonthwithTwoCharacters, getDaywithTwoCharacters} = require('../utils/util');
const excel = require("exceljs");

const scheduletoGenerateExcelFile = () => {
    var j = schedule.scheduleJob('0 0 * * *', function(){
        getPatients();
    });
}

const getPatients = async() => {
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let day = new Date().getDay();
    let testedPatients = await Patient.find({Test_Result_Date: {$gte: new Date(year, month, day, 0, 0, 0)}});
    console.log(testedPatients[0]);
    generateExcelFile(testedPatients);
}

const generateExcelFile = (patients) => {
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Tutorials");
    worksheet.columns = [
        { header: "Reporting_Facility_Name", key: "Reporting_Facility_Name", width: 25 },
        { header: "CLIA_Number", key: "CLIA_Number", width: 15 },
        { header: "Performing_Organization_Name", key: "Performing_Organization_Name", width: 30 },
        { header: "Performing_Organization_Address", key: "Performing_Organization_Address", width: 30 },
        { header: "Performing_Organization_City", key: "Performing_Organization_City", width: 30 },
        { header: "Performing_Organization_Zip", key: "Performing_Organization_Zip", width: 30 },
        { header: "Performing_Organization_State", key: "Performing_Organization_State", width: 30 },
        { header: "Device_Identifier", key: "Device_Identifier", width: 20 },
        { header: "Ordered Test Name", key: "Ordered_Test_Name", width: 30 },
        { header: "LOINC Code", key: "LOINC_Code", width: 20 },
        { header: "LOINC_Text", key: "LOINC_Text", width: 70 },
        { header: "Result", key: "Result", width: 10 },
        { header: "Result Units", key: "Result_Units", width: 12 },
        { header: "Reference Range", key: "Reference_Range", width: 15 },
        { header: "Date_Test_Performed", key: "createdAt", width: 20 },
        { header: "Test Result Date", key: "Test_Result_Date", width: 20 },
        { header: "Pt Fname", key: "Pt_Fname", width: 20 },
        { header: "Pt Middle Initial", key: "Pt_Middle_Initial", width: 20 },
        { header: "Pt Lname", key: "Pt_Lname", width: 20 },
        { header: "Date of Birth", key: "Date_of_Birth", width: 25 },
        { header: "Patient Age", key: "Patient_Age", width: 20 },
        { header: "Sex", key: "Sex", width: 10 },
        { header: "Pt Race", key: "Pt_Race", width: 10 },
        { header: "Pt Ethnicity", key: "Pt_Ethnicity", width: 30 },
        { header: "Pt Phone", key: "Pt_Phone", width: 20 },
        { header: "Pt Str", key: "Pt_Str", width: 30 },
        { header: "Pt City", key: "Pt_City", width: 20 },
        { header: "Pt ST", key: "Pt_ST", width: 10 },
        { header: "Pt Zip", key: "Pt_Zip", width: 10 },
        { header: "Pt County", key: "Pt_County", width: 10 },
        { header: "Accession_Number", key: "Accession_Number", width: 20 },
        { header: "Ordering Facility", key: "Ordering_Facility", width: 20 },
        { header: "Ordering Facility Address", key: "Ordering_Facility_Address", width: 25 },
        { header: "Ordering_Facility_City", key: "Ordering_Facility_City", width: 25 },
        { header: "Ordering Facility State", key: "Ordering_Facility_State", width: 30 },
        { header: "Ordering Facility Zip", key: "Ordering_Facility_Zip", width: 20 },
        { header: "Ordering Provider Last Name", key: "Ordering_Provider_Last_Name", width: 30 },
        { header: "Ordering Provider First Name", key: "Ordering_Provider_First_Name", width: 30 },
        { header: "Ordering Provider NPI", key: "Ordering_Provider_NPI", width: 30 },
        { header: "Ordering_Provider_Street_Address", key: "Ordering_Provider_Street_Address", width: 30 },
        { header: "Ordering_Provider_City", key: "Ordering_Provider_City", width: 20 },
        { header: "Ordering_Provider_State", key: "Ordering_Provider_State", width: 25 },
        { header: "Ordering_Provider_Zip", key: "Ordering_Provider_Zip", width: 20 },
        { header: "Ordering_Provider_Phone", key: "Ordering_Provider_Phone", width: 30 },
        { header: "Specimen_ID", key: "Specimen_ID", width: 15 },
        { header: "Specimen_Type", key: "Specimen_Type", width: 20 },
        { header: "Date_Test_Ordered", key: "Date_Test_Ordered", width: 30 },
        { header: "Date_Specimen_Collected", key: "Date_Specimen_Collected", width: 30 },
    ];

    for(let patient of patients){
        worksheet.addRows([{
            Reporting_Facility_Name: 'Grand Ave Pharmacy',
            CLIA_Number: '45D2193869',
            Performing_Organization_Name: "Grand Ave Pharmacy",
            Performing_Organization_Address: "1615 Grand Avenue Pkwy Ste 104",
            Performing_Organization_City: "Pflugerville",
            Performing_Organization_Zip: "78660",
            Performing_Organization_State: "TX",
            Device_Identifier: '',
            Ordered_Test_Name: 'COVID19 Rapid Antigen Test',
            LOINC_Code: '94558-4',
            LOINC_Text: 'SARS-CoV-2 (COVID-19) Ag [Presence] in Respiratory specimen by Rapid immunoassay',
            Result: (patient.Result==1? 'Positive': 'Negative'),
            Result_Units: '',
            Reference_Range: '',
            createdAt: patient.createdAt,
            Test_Result_Date: patient.Test_Result_Date,
            Pt_Fname: patient.Pt_Fname,
            Pt_Middle_Initial:  '',
            Pt_Lname: patient.Pt_Lname,
            Date_of_Birth: patient.Date_of_Birth,
            Patient_Age:  patient.Patient_Age,
            Sex: patient.Sex,
            Pt_Race: patient.Pt_Race,
            Pt_Ethnicity: patient.Pt_Ethnicity,
            Pt_Phone: patient.Pt_Phone,
            Pt_Str: patient.Pt_Str,
            Pt_City: patient.Pt_City,
            Pt_ST: patient.Pt_ST,
            Pt_Zip: patient.Pt_Zip,
            Pt_County: patient.Pt_County,
            Accession_Number: '',
            Ordering_Facility: '',
            Ordering_Facility_Address: '',
            Ordering_Facility_City: '',
            Ordering_Facility_State: '',
            Ordering_Facility_Zip: '',
            Ordering_Provider_Last_Name: '',
            Ordering_Provider_First_Name: '',
            Ordering_Provider_NPI: '',
            Ordering_Provider_Street_Address: '',
            Ordering_Provider_City: '',
            Ordering_Provider_State: '',
            Ordering_Provider_Zip: '',
            Ordering_Provider_Phone: '',
            Specimen_ID: 'ABCZ990011002352',
            Specimen_Type: 'Nasopharyngeal',
            Date_Test_Ordered: '',
            Date_Specimen_Collected: ''
        }]);
    }
    let month = getMonthwithTwoCharacters();
    let day = getDaywithTwoCharacters();

    let fileName = `${new Date().getFullYear()}${month}${day}.xlsx`;
    workbook.xlsx.writeFile(fileName) 
    .then(function () {
        uploadGoogleDriveExt();
    });
}

module.exports = {scheduletoGenerateExcelFile, generateExcelFile}