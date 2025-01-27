const mongoose = require('mongoose');

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/jobBoardLocal';
const uri = process.env.DB_CONNECT || DEFAULT_URI;

function connectToDb() {
    mongoose.connect(uri
    ).then(() => {
        console.log('Connected to DB');
    }).catch(err => console.log(err));
}

module.exports = connectToDb;