// @ts-nocheck
const mongoose = require('mongoose');
const app = require('express')();
const cors = require('cors')
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text({ limit: '6mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

//Import route
const patientRoute = require('./routes/patient');
const testerRoute = require('./routes/tester');
const testorganizationRoute = require('./routes/testingorganization');
const companyRoute = require('./routes/company');
const franchiseRoute = require('./routes/franchise');
const userRoute = require('./routes/user');
const paymentRoute = require('./routes/payment');
const mongoUri = `mongodb+srv://admin:CAHNt6GCJhJAboEn@cluster0.r4uyf.mongodb.net/rxrapidtesting?retryWrites=true&w=majority`;
require('dotenv').config()
//Import generate Excel function
const {scheduletoGenerateExcelFile} = require('./generateExcel/generateExcel');

const port = process.env.PORT || 3000;

app.use('/patient', patientRoute);
app.use('/auth', testerRoute);
app.use('/testorganization', testorganizationRoute);
app.use('/company', companyRoute);
app.use('/franchise', franchiseRoute);
app.use('/user', userRoute);
app.use('/payment', paymentRoute);

function connectDB() {
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });
  console.log("mongodb is connecting now");
  mongoose.connection.on('connected', () => {
    const server = app.listen(port, () => {
      console.log(`mongodb connected successfully on port ${port}`);
      scheduletoGenerateExcelFile();
    })
  });

  mongoose.connection.on('error', (err) => {
    console.log('mongo connection error', err);
  });
}

connectDB();

