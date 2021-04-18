const mailjet = require ('node-mailjet').connect('a258073c7a9d65904a3db024e28ebef2', '48d85317432c5c0404d1c5463c38e471')
const pdf2base64 = require('pdf-to-base64');
const fs = require('fs');
const sendEmail = async(email, id) => {
  try {
    if(email){
      const response = await pdf2base64(`outputFile${id}.PDF`);
      const request = mailjet
        .post("send", {'version': 'v3.1'})
        .request({
          "Messages":[{
            "From": {
              "Email": "no-reply2187@rxrapidtesting.com",
              "Name": "Your Rapid Test Results"
            },
            "To": [{
              "Email": email,
              "Name": "Patient"
            }],
            "Subject": "Your Rapid Test Results",
            "TextPart": "This is the result of your test.",
            "HTMLPart": "",
            'Attachments': [{
              "ContentType": "applicaction/pdf",
              "Filename": "result.pdf",
              "Base64Content": response,
            }]
          }]
        })
      request
        .then((result) => {
          console.log("Email send successfully");
          fs.unlink(`outputFile${id}.PDF`,function(err){
            if(err) return console.log(err);
            console.log('file deleted successfully');
          });  
        })
        .catch((err) => {
          console.log(err.statusCode)
        })
    }
  } catch (error) {
    console.log(error);
  }
}
module.exports = {sendEmail}