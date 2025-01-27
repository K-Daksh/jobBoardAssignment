const express = require('express');
const cors = require('cors');
const json = require('body-parser').json;
const urlencoded = require('body-parser').urlencoded;
const app = express();
const dotenv = require('dotenv');
const connectToDb = require('./db/db');
const cookieParser = require('cookie-parser');
const studentRoute = require('./routes/student.routes');
const companyRoute = require('./routes/company.routes');


connectToDb();

dotenv.config();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/student', studentRoute);
app.use('/company', companyRoute);

app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is up and running' });
});


module.exports = app;