const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
{
    Result: {
        type: Number,
        default: 0
    },

    //IF 0 not tested
    //   1 positive
    //   2 negative
    Test_Result_Date: {
        type: Date
    },
    Pt_Lname: {
        type: String,
        default: 'Not Provided'
    },
    Pt_Fname: {
        type: String,
        default: 'Not Provided'
    },
    Pt_Email: {
        type: String,
        default: 'Not Provided'
    },
    Date_of_Birth: {
        type: String,
        default: 'Not Provided'
    },
    Patient_Age: {
        type: String
    },
    Sex: {
        type: String,
        default: 'Not Provided'
    },
    Pt_Race: {
        type: String,
        default: 'Not Provided'
    },
    Pt_Ethnicity: {
        type: String,
        default: 'Not Provided'
    },
    Pt_Phone: {
        type: String,
        default: 'Not Provided'
    },
    Pt_Str: {
        type: String,
        default: 'Not Provided'
    },
    Pt_City: {
        type: String,
        default: 'Not Provided'
    },
    Pt_ST: {
        type: String,
        default: 'Not Provided'
    },
    Pt_Zip: {
        type: String,
        default: 'Not Provided'
    },
    Pt_County: {
        type: String,
        default: 'Not Provided'
    },
    location_Id: {
        type: String, 
        default: 'Not Provided'
    },
    company_id: {
        type: String,
        default: 'Not Provided'
    },
    calendar_uuid: {
        type: String
    },
    is_paid: {
        type: Boolean,
        required: true,
        default: false
    },
    cares: {
        type: Number,
        default: 0
    },
    is_ignore: {
        type: Boolean,
        required: true,
        default: false
    },
    test_variant: {
        type: String,
        default: ''
    },
    tester_name: {
        type: String,
        default: ''
    },
    appointment_date: {
        type: Date,
    },
    cash: {
        type: Number,
        default: 0 
        // 0: normal calendly event, 1: cash not collected, 2: cash collected
    }
}, {timestamps: true});
  

mongoose.model('Patient', patientSchema);

module.exports = patientSchema;